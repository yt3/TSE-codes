#!/bin/bash

spin -a modelBad.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DSAFETY -DNOCLAIM -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000 > results

spin -p -s -r -X -v -n123 -k modelBad.pml.trail -u10000 modelBad.pml >> results