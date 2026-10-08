"""Rewrite the site CSP in the nginx config. Run on the VPS as root.

Kept as a file rather than an inline heredoc because the policy is full of
single quotes, which a shell wrapper silently strips.
"""
import re
import shutil
import time

CONFIG = "/etc/nginx/sites-available/kynocreative"

CSP = "; ".join([
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://js.stripe.com https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.stripe.com",
    "frame-src https://js.stripe.com https://checkout.stripe.com https://googleads.g.doubleclick.net https://www.google.com https://td.doubleclick.net",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests",
])

replacement = '    add_header Content-Security-Policy "%s" always;' % CSP

with open(CONFIG, encoding="utf-8") as fh:
    source = fh.read()

updated, count = re.subn(
    r"^[ \t]*add_header Content-Security-Policy .*$",
    lambda _m: replacement,
    source,
    count=1,
    flags=re.M,
)
if count != 1:
    raise SystemExit("expected exactly one CSP line, found %d" % count)

shutil.copy2(CONFIG, "%s.bak-csp2-%s" % (CONFIG, time.strftime("%Y%m%d%H%M%S")))
with open(CONFIG, "w", encoding="utf-8") as fh:
    fh.write(updated)

print("written")
print(replacement)
