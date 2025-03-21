#!/bin/bash

# Navigate to your Node.js project directory
cd ./backend

# Start the Node.js server
nodemon server &

# Start the React server
cd ../schoolthrifties-p2p

npm run dev &



# Alternatively, if you want to use a specific file to run the server, use:
# node server.js

# If you're using a tool like nodemon, you can use:
# npx nodemon server.js