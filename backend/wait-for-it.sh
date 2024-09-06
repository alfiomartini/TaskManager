#!/usr/bin/env bash
# wait-for-it.sh

set -e

host="$1"
shift
port="$1"
shift
cmd="$@"

# Timeout in seconds
timeout=30

echo "Waiting for $host:$port to be available..."
for i in $(seq $timeout); do
    if nc -z "$host" "$port"; then
        echo "$host:$port is available. Executing command."
        exec $cmd
        exit 0
    fi
    echo "Waiting for $host:$port... ($i/$timeout)"
    sleep 1
done

echo "$host:$port did not become available in time."
exit 1
