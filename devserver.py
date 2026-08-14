#!/usr/bin/env python3
"""Local static file server for development preview only.
Disables caching so edited files are always reflected immediately,
and always serves from this script's own directory regardless of cwd."""
import http.server
import functools
import os
import sys

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8181
root = os.path.dirname(os.path.abspath(__file__))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

Handler = functools.partial(NoCacheHandler, directory=root)
http.server.test(HandlerClass=Handler, port=port)
