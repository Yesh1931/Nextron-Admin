import http.server
import socketserver
import os

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Force CORS and caching headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    # Override guess_type to enforce correct MIME types regardless of OS registry corruptions
    def guess_type(self, path):
        if path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.svg'):
            return 'image/svg+xml'
        elif path.endswith('.png'):
            return 'image/png'
        elif path.endswith('.jpg') or path.endswith('.jpeg'):
            return 'image/jpeg'
        elif path.endswith('.html'):
            return 'text/html'
        return super().guess_type(path)

# Ensure we run from the project root
os.chdir(os.path.dirname(os.path.abspath(__file__)))

handler = MyHTTPRequestHandler

# Allow reusing the address immediately
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), handler) as httpd:
    print(f"Serving ECE Concept Explorer at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
        httpd.server_close()
