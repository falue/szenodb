#!/bin/bash

# Create build
git push &&
npm run build &&
cd ./dist &&

# Copy specified dir recursively
# use port 2121 as per metanet. get IP from metanet gui. foldername of website.
scp -P 2121 -r ./ filmkulissen@80.74.158.100:/szenodb.telefabi.ch


# NOTES

# login manually to server:
# ssh <username>@80.74.158.100 -p2121

# get authrized ssh keys /home/<username>/.ssh:
# https://download.asperasoft.com/download/docs/ascp/3.5.2/html/dita/creating_public_key_cmd.html

# Save ssh key in file /.ssh/authorized_keys on server 
# https://www.metanet.ch/support/713

# following copies only the specified file
#scp ./otherdir/myfile user@servername:/final/path/otherdir/
