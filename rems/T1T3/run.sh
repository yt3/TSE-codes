#!/bin/bash

tsc generator.ts
node generator.js
chmod 755 dl* prop* commands
./commands