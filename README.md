Source codes for TSE submission
====

Overview

Source codes for TSE submission:

"Towards scalable model checking of reflective systems based on
labeled transition systems"

including:

rems - source codes that generate and verify specifications of the
remote elderly monitoring system example. All but rems/Maude are for
SPIN.

rems/All - for the specifications with T1, T2, and T3.

rems/BL - for the baseline specifications.

rems/Maude - for the specifications in Maude.

rems/T1 - for the specifications with T1.

rems/T1T2 - for the specifications with T1 and T2.

rems/T1T3 - for the specifications with T1 and T3.

rems/T2 - for the specifications with T2.

rems/T2T3 - for the specifications with T2 and T3.

rems/T3 - for the specifications with T3.

rems/results.sample - a sample of a part of created "results" file.

robot - source codes that generate and verify specifications of the
robot example using SPIN.

## Requirement

The following software is required:

Bash		https://www.gnu.org/software/bash/

Node.js		https://nodejs.org/

Typescript	https://www.typescriptlang.org/

Maude		http://maude.cs.illinois.edu/

SPIN		http://spinroot.com/

GCC			https://gcc.gnu.org/

## Description

You can reproduce the following two types of experimental results
mentioned in the paper using these programs.

First, using the files "rems/BL/rems3Bad.pml", "rems/BL/runBad.sh",
"robot/modelBad.pml", and "robot/runBad.sh", you can check if the
failures can be detected. After you execute "runBad.sh", you can
obtain a file named "results".

For example, the results of executing "rems/BL/runBad.sh" looks as
follows, where "//" means that comments follow (see the
"rems/BL/results.sample" file):

```
pan:1: invalid end state (at depth 33)	// Deadlock detected.
...
State-vector 96 byte, depth reached 531, errors: 1
      414 states, stored	// Number of explored states.
...
// The trace of counterexample starts from here,
  1:	proc  0 (:init::1) rems3Bad.pml:15 (state 1)	[current[0] = before_comm_0]	<merge 49 now @2>
...
 34:	proc  0 (:init::1) rems3Bad.pml:77 (state 60)	[((ol&&(dob==d1)))]
// and ends here.
spin: trail ends after 34 steps
#processes: 1
		current[0] = sending_0
		current[1] = receiving0
		current[2] = before_comm
		current[3] = evolved_0
		current[4] = evolved
		current[5] = evolved
		encrypted[0] = 0
		encrypted[1] = 0
		ol = 1
	// These are the current values of the variables.
	// "current[i]" is the current state of the i-th process.
	// "encrypted[i]" is true if the i-th client device
	// communicated an encrypted message.
...
```

Second, using the other files, you can measure and compare the
scalability of various settings. After you execute "run.sh" in each
directory, you can obtain a file named "results". Its content is a
repetition of the following descriptions (see the
"rems/results.sample" file):

```
...
  or use e.g.: spin -search -ltl prop1 rems7.pml
	// "rems7.pml" is the model with seven clients.
pan: ltl formula prop1	// Verifying the satisfaction of the
			// proposition named "prop1" that means the
			// second property mentioned in the paper.

			// No such description means that deadlock
			// freedom (the first property) is being
			// verified.
...
  2925217 states, stored	// The number of explored states.
...
memory 550108
time 16.40
...
memory 550124
time 16.39	// The amount of consumed memory and time are measured
		// five times for calculation of the average.
```

## Usage

To check if the failures can be detected,

$ chmod 755 runBad.sh
$ ./runBad.sh

To measure the scalability,

$ chmod 755 run.sh
$ ./run.sh

Then, the results are stored in the "results" file.

## Install

Just download the files.
