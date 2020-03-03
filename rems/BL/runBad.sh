#!/bin/bash

spin -a rems3Bad.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DSAFETY -DNOCLAIM -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000 > results

spin -p -s -r -X -v -n123 -k rems3Bad.pml.trail -u10000 rems3Bad.pml >> results