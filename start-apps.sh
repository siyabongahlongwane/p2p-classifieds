#!/bin/bash

cd ./schoolthrifties-p2p && npm run dev &
cd ../backend && nodemon server
