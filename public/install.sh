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
	echo "[*] Installing Smux..."6
	# clone the repo
	git clone https://github.com/renhiyama/smux.git ~/.smux
elif
cd ~/.smux/server
echo "[*] Installing Dependencies..."
npm install
# check if script exists, if yes delete it
if [ -f "/usr/local/bin/smux" ]; then
	echo "[*] Deleting old script..."
	rm /usr/local/bin/smux
fi
# write a bash script to run the server and save it to /usr/local/bin or /bin
echo '#!/bin/bash
cd ~/.smux/server
node index.js' > ~/.smux/smux-server
chmod +x ~/.smux/smux-server
# check if sudo is available
if [ -x "$(command -v sudo)" ]; then
  sudo mv ~/.smux/smux-server /usr/local/bin/smux-server
else
  mv ~/.smux/smux-server /bin/smux-server
fi
echo '`smux-server` installed successfully'
