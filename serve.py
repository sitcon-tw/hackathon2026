import http.server
import os
import re
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
CHUNK = 64 * 1024
RANGE_PATTERN = re.compile(r"bytes=(\d*)-(\d*)")


class RangeRequestHandler(http.server.SimpleHTTPRequestHandler):
    def serve_range(self):
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return False

        header = self.headers.get("Range")
        if not header:
            return False

        match = RANGE_PATTERN.match(header.strip())
        if not match:
            return False

        size = os.path.getsize(path)
        start_raw, end_raw = match.groups()

        if start_raw == "" and end_raw == "":
            return False

        if start_raw == "":
            length = int(end_raw)
            start = max(0, size - length)
            end = size - 1
        else:
            start = int(start_raw)
            end = int(end_raw) if end_raw else size - 1

        end = min(end, size - 1)

        if start > end or start >= size:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.end_headers()
            return True

        content_length = end - start + 1
        self.send_response(206)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(content_length))
        self.send_header("Content-Type", self.guess_type(path))
        self.end_headers()

        if self.command == "GET":
            with open(path, "rb") as source:
                source.seek(start)
                remaining = content_length
                while remaining > 0:
                    chunk = source.read(min(CHUNK, remaining))
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    remaining -= len(chunk)
        return True

    def do_GET(self):
        if self.serve_range():
            return
        super().do_GET()

    def do_HEAD(self):
        if self.serve_range():
            return
        super().do_HEAD()


if __name__ == "__main__":
    with http.server.ThreadingHTTPServer(("", PORT), RangeRequestHandler) as server:
        print(f"Serving on http://localhost:{PORT} (HTTP Range supported)")
        server.serve_forever()
