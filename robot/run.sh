#!/bin/bash

spin -a modelBad.pml
gcc -DMEMLIM=1024 -O2 -DXUSAFE -DSAFETY -DNOCLAIM -w -o pan pan.c; ./pan -m10000  -n
spin -a model.pml
gcc -DMEMLIM=1024 -O2 -DXUSAFE -DSAFETY -DNOCLAIM -w -o pan pan.c; ./pan -m10000  -n
gcc -DMEMLIM=1024 -O2 -DXUSAFE -w -o pan pan.c; ./pan -m10000  -a -n -N prop2
