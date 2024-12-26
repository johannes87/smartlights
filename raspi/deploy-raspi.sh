#!/bin/bash

# used to deploy frontend and backend to my Raspberry Pi; expects git
# checkout in ~/git/, and a webserver to point to ~/web/, and the node
# binaries to be located in $NODE_BIN

# deploy-raspi.env should define:
#
# DESTINATION='smartlights@raspihost'
# SUDO_DESTINATION='sudo_capable_user@raspihost'
# BACKEND_URL='http://raspihost:8000'
# The "bin" subdir of the nodejs binary archive from nodejs.org:
# NODE_BIN='/home/smartlights/node/bin'

cd $(dirname $0)
source deploy-raspi.env

function server_command() {
    echo 'Running on server: "'$1'"'
    ssh $DESTINATION 'PATH='$NODE_BIN':$PATH && '$1
}

function server_command_root() {
    echo 'Running on server as root: "'$1'"'
    ssh $SUDO_DESTINATION 'sudo sh -c "'$1'"'
}

cd ..

# frontend
echo "Building frontend..."
(cd smartlights-frontend && npm ci --only=production && npm run build)
rsync -av --del smartlights-frontend/build/ $DESTINATION:web

# backend
server_command "cd smartlights && git pull"
server_command "cd smartlights/smartlights-backend && npm ci --only=production"
server_command_root "systemctl restart smartlights-backend"
