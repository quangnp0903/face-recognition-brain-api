
#!/usr/bin/env bash
# wait-for-it.sh

host="$1"
shift
port="$1"
shift

timeout=30
interval=1

echo "⏳ Waiting for $host:$port..."

for ((i=0; i<timeout; i+=interval)); do
  if nc -z "$host" "$port"; then
    echo "✅ $host:$port is available!"
    exec "$@"
    exit 0
  fi
  sleep $interval
done

echo "❌ Timeout waiting for $host:$port"
exit 1
