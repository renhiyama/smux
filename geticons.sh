#!/usr/bin/env sh
# Get icons from https://github.com/vscode-icons/vscode-icons/tree/master/icons
# they are licensed under the MIT license. Please see their LICENSE file for details.

# Path to the icons folder: /public/fileicons
ICONS_FOLDER=./public/fileicons

# delete the folder if it exists
if [ -d "$ICONS_FOLDER" ]; then
  echo "Deleting $ICONS_FOLDER"
  rm -rf "$ICONS_FOLDER"
fi

# create the folder
echo "Creating $ICONS_FOLDER"
mkdir "$ICONS_FOLDER"

# download the icons via git submodule clone
echo "Downloading icons and saving them temporarily in vscode-icons"

git clone \
  --depth 1  \
  --filter=blob:none  \
  --sparse \
  --quiet \
  https://github.com/vscode-icons/vscode-icons \
;
cd vscode-icons
git sparse-checkout set icons
cp -r icons/* ../"$ICONS_FOLDER"
cd ..
echo "Finishing up..."
rm -rf vscode-icons