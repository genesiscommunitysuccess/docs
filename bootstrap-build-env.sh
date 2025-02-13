#!/bin/bash
set -euo pipefail

echo "Setting up swap space..."
sudo fallocate -l 45G ../swapfile
sudo chmod 600 ../swapfile
sudo mkswap ../swapfile
sudo swapon ../swapfile
sudo swapon -s
echo "✅  Done setting up swap space!"
echo ""
