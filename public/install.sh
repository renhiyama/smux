#!/bin/bash

# check for packages and install if not found
if ! [ -x "$(command -v git)" ]; then
  echo 'Error: git is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v npm)" ]; then
  echo 'Error: npm is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v node)" ]; then
  echo 'Error: node is not installed.' >&2
  exit 1
fi
# check if directory exists
if [ -d "~/.smux" ]; then
	echo "[*] Smux Installation exists already."
else
	echo "[*] Installing Smux..."
	# clone the repo
	git clone https://github.com/renhiyama/smux.git ~/.smux
fi
cd ~/.smux/server
echo "[*] Installing Dependencies..."
npm install
npm link .
echo '`smux-server` installed successfully. Run `smux-server` to start the server.'
