#!/bin/bash

# Check if file package.json exists, else, exit
if [ ! -f package.json ]; then
    echo "ERROR: package.json not found. You're in the wrong folder or this project is not an npm project."
    exit 1
fi

VERSION="0"
usage() {
    echo "Usage:"
    echo "./deploy.sh           NPM build & deploy."
    echo "./deploy.sh -i        NPM build & deploy, git commit increment marginal number (e.g '0.2.99' => '0.2.100' )."
    echo "./deploy.sh -v 6.6.6  NPM build & deploy, git commit set version to 6.6.6."
    exit 1
}

while getopts ":v:i" o; do
    case "${o}" in
        v)
            VERSION=${OPTARG} || usage
            GITMESSAGE="New version"
            ;;
        i)
            VERSION="iterate"
            GITMESSAGE="New marginal version"
            ;;
        *)
            usage
            ;;
    esac
done
shift $((OPTIND-1))  # ?

# If changes where made to package.json, stash them all.
GITSTASHED=$(git diff-index --quiet HEAD -- || echo "untracked")
if [ "$GITSTASHED" == "untracked" ]; then
    echo "Needs stashing."
    git stash
else
    echo "Does not need stashing, commence."
fi

# ITERATE MARGINAL
if [ "$VERSION" == "iterate" ]; then
    # get version number
    VERSION=$(jq -r '.version' package.json) &&
    # echo "Current version: <${VERSION}>" &&

    # increment marginal version number
    # https://stackoverflow.com/questions/8653126/how-to-increment-version-number-in-a-shell-script
    VERSION=$(echo ${VERSION} | awk -F. -v OFS=. '{$NF += 1 ; print}')
    # echo "Next version: <${VERSION}>"
fi

# GIT STASH, WRITE NEW VERSION TO package.json, GIT COMMIT, GIT STASH APPLY
if [ "$VERSION" != "0" ]; then
    echo "Add version to package.json && git commit."

    # Write version number to package.json
    echo "$( jq '.version = "'$VERSION'"' package.json)" > package.json &&
    
    # Add to git
    git commit package.json -m "${GITMESSAGE} ${VERSION}"

else
    echo "Keep current version."
fi

# Create build
git push &&
npm run build &&

# Reapply changes to local files
if [ "$GITSTASHED" == "untracked" ]; then
  git stash apply
fi

# Copy specified dir recursively
# use port 2121 as per metanet. get IP from metanet gui. foldername of website.
scp -P 2121 -r ./dist filmkulissen@80.74.158.100:/szenodb.ch &&

echo "New version uploaded to szenodb.ch: <${VERSION}>"

# NOTES

# login manually to server:
# ssh <username>@80.74.158.100 -p2121

# get authrized ssh keys /home/<username>/.ssh:
# https://download.asperasoft.com/download/docs/ascp/3.5.2/html/dita/creating_public_key_cmd.html

# Save ssh key in file /.ssh/authorized_keys on server 
# https://www.metanet.ch/support/713

# following copies only the specified file
#scp ./otherdir/myfile user@servername:/final/path/otherdir/