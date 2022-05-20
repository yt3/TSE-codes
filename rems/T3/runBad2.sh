#!/bin/bash

spin -a rems3Bad2.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000  -a -n -N prop3

spin -n123 -k rems3Bad2.pml.trail -u10000 rems3Bad2.pml > results