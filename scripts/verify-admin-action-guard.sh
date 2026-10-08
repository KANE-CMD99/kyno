#!/bin/bash
# Verify the admin Server Action guard both ways:
#   - unauthenticated call must NOT return data
#   - authenticated admin call (cookie = ADMIN_TOKEN) must return data
# The token is read on the server and never printed.
set -e
cd /opt/kyno

CHUNK=$(curl -s -m 20 'https://www.kynocreative.com/admin/dashboard' \
  | grep -oE '/_next/static/chunks/app/admin/dashboard/[^"]*\.js' | head -1)
echo "chunk: $CHUNK"

AID=$(curl -s -m 20 "https://www.kynocreative.com$CHUNK" \
  | grep -oE '"[a-f0-9]{40}"' | head -1 | tr -d '"' || true)
echo "action id: $AID"

if [ -z "$AID" ]; then echo "FAIL: 未取到 action id"; exit 1; fi

TOKEN=$(grep -E '^ADMIN_TOKEN=' .env.local | cut -d= -f2- | tr -d '"')
if [ -z "$TOKEN" ]; then echo "FAIL: 未取到 ADMIN_TOKEN"; exit 1; fi

echo
echo "--- ① 未授权（无 cookie）---"
curl -s -m 20 -X POST 'http://127.0.0.1:3000/admin/dashboard' \
  -H "Next-Action: $AID" -H 'Content-Type: text/plain;charset=UTF-8' \
  --data '[]' -o /tmp/noauth.txt -w 'HTTP %{http_code}, %{size_download} bytes\n'
echo -n "  商品数据条目: "; grep -oE 'Resume|Menu|Template' /tmp/noauth.txt | wc -l

echo
echo "--- ② 已授权（带管理员 cookie）---"
curl -s -m 20 -X POST 'http://127.0.0.1:3000/admin/dashboard' \
  -H "Next-Action: $AID" -H 'Content-Type: text/plain;charset=UTF-8' \
  -H "Cookie: kyno_admin_session=$TOKEN" \
  --data '[]' -o /tmp/auth.txt -w 'HTTP %{http_code}, %{size_download} bytes\n'
echo -n "  商品数据条目: "; grep -oE 'Resume|Menu|Template' /tmp/auth.txt | wc -l

rm -f /tmp/noauth.txt /tmp/auth.txt
