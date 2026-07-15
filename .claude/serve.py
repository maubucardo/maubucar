import http.server, sys

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory="/Users/yugi/Documents/website", **kw)
    def log_message(self, fmt, *args):
        sys.stderr.write(fmt % args + "\n")

http.server.HTTPServer(("", 3000), Handler).serve_forever()
