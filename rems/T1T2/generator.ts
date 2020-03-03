declare function require(x: string): any;

const fs = require('fs');
const max = 22;

function main(noOfDevices) {
    var index, index0, no: number;
    const write = `rems${noOfDevices}.pml`;
    const noOfStates = noOfDevices * 12 - 8;
    const noOfProcesses = noOfDevices * 2;
    fs.writeFileSync(write, `#define NO_OF_PROCESSES		${noOfProcesses}\n`);
    for (var i = 1; i < noOfDevices; i++) {
	fs.appendFileSync(write, `#define GUARD0_${i}	(!(ol && dob == d${i}) || (!(current[${i + noOfDevices}] == before_evolution && encrypted[${i-1}]) && (!(current[${i + noOfDevices}] == evolved) || encrypted[${i-1}])))
#define GUARD1_${i}	(! (! ol && dm == d${i} && current[${i + noOfDevices}] == before_evolution) || current[${i}] == before_comm)\n`);
    }
    fs.appendFileSync(write, `
mtype = { before_comm, before_evolution, evolved, sending, receiving, before_comm_0, before_evolution_0, evolved_0, sending_0, receiving_0, comm0, ack0, comm1, ack1, evolve, evolve_0, `);
    for (var i = 0; i < noOfDevices; i++) {
	fs.appendFileSync(write, `d${i}`);
	if (i + 1 < noOfDevices) fs.appendFileSync(write, `, `);
    }
    fs.appendFileSync(write, `}

mtype current[NO_OF_PROCESSES];
bool encrypted[${noOfDevices - 1}];

init {\n`);
    fs.appendFileSync(write,`mtype dob, dm;
bool ol;
atomic {
current[0] = before_comm_0;
current[${noOfDevices}] = before_evolution_0;\n`);
    for (var i = 1; i < noOfDevices; i++) {
	fs.appendFileSync(write,`current[${i}] = before_comm;
current[${i + noOfDevices}] = before_evolution;\n`);
    }
    fs.appendFileSync(write,`if\n`);
    for (var i = 1; i < noOfDevices; i++) {
	fs.appendFileSync(write,`:: dob = d${i};\n`)
    }
    fs.appendFileSync(write,`fi
dm = d1;
if
:: ol = 0
:: ol = 1
fi
}
do
:: atomic {
if\n`);
    for (var i = 1; i < noOfDevices; i++) {
	fs.appendFileSync(write,`:: ol && dob == d${i} ->
if
:: current[0] == before_comm_0 && current[${i}] == before_comm ->
encrypted[${i - 1}] = (current[${i + noOfDevices}] == evolved);
// printf("process %d changed from %e to %e\\n", 0, current[0], sending_0);
current[0] = sending_0;
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], receiving);
current[${i}] = receiving
:: current[0] == before_comm_0 && current[${i}] == before_comm ->
encrypted[${i - 1}] = (current[${i + noOfDevices}] == evolved);
// printf("process %d changed from %e to %e\\n", 0, current[0], receiving_0);
current[0] = receiving_0;
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], sending);
current[${i}] = sending
:: current[0] == sending_0 && current[${i}] == receiving && GUARD0_${i} ->
// printf("process %d changed from %e to %e\\n", 0, current[0], before_comm_0);
current[0] = before_comm_0;
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], before_comm);
current[${i}] = before_comm;
:: current[0] == receiving_0 && current[${i}] == sending && GUARD0_${i} ->
// printf("process %d changed from %e to %e\\n", 0, current[0], before_comm_0);
current[0] = before_comm_0;
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], before_comm);
current[${i}] = before_comm
fi\n`);
    }
    fs.appendFileSync(write, `:: !ol && current[${noOfDevices}] == before_evolution_0 ->
// printf("process %d changed from %e to %e\\n", ${noOfDevices}, current[${noOfDevices}], evolved_0);
current[${noOfDevices}] = evolved_0\n`);
    for (var i = 1; i < noOfDevices; i++) {
	fs.appendFileSync(write,`:: !ol && dm == d${i} && current[${noOfDevices}] == evolved_0 && GUARD1_${i} ->
// printf("process %d changed from %e to %e\\n", ${noOfDevices}, current[${noOfDevices}], evolved_0);
current[${noOfDevices}] = evolved_0;
// printf("process %d changed from %e to %e\\n", ${i + noOfDevices}, current[${i + noOfDevices}], evolved);
current[${i + noOfDevices}] = evolved;\n`);
    }
    fs.appendFileSync(write,`:: else -> skip
fi
if
:: ol = 0
:: ol = 1
fi
if
:: ol && current[0] == before_comm_0 ->
if\n`);
    for (var i = 1; i < noOfDevices; i++) {
	fs.appendFileSync(write,`:: dob = d${i}\n`);
    }
    fs.appendFileSync(write, `fi\n`);
    for (var i = 1; i + 1 < noOfDevices; i++) {
	fs.appendFileSync(write,`:: !ol && current[${i + noOfDevices}] == evolved && dm == d${i} && current[${i}] == before_comm ->
dm = d${i + 1}
:: !ol && (current[${i + noOfDevices}] == evolved || current[${i}] != before_comm) ->
ol = 1\n`);
    }
    fs.appendFileSync(write, `:: else -> skip
fi
}
od
}

ltl prop1 { [] (current[${noOfDevices + 1}] == before_evolution -> !encrypted[0]) }

ltl prop2 { [] ((current[1] != before_comm) && (current[${noOfDevices + 1}] == evolved) -> [] (encrypted[0])) }

ltl prop3 { [] ((current[1] == sending || current[1] == receiving) -> <> (current[1] == before_comm)) }`);
}
for (var i = 2; i < max; i++) {
    main(i)
}
function gen(no) {
    fs.writeFileSync(`dl${no}-2`, `#!/bin/bash

(spin -a rems${no}.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DSAFETY -DNOCLAIM -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000 -n) > /dev/null`);
    fs.writeFileSync(`prop1-${no}-2`, `#!/bin/bash

(spin -a rems${no}.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000  -a -n -N prop1) > /dev/null`);
    fs.writeFileSync(`prop2-${no}-2`, `#!/bin/bash

(spin -a rems${no}.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000  -a -n -N prop2) > /dev/null`);
    fs.writeFileSync(`prop3-${no}-2`, `#!/bin/bash

(spin -a rems${no}.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000  -a -n -N prop3) > /dev/null`);
    fs.writeFileSync(`dl${no}`, `#!/bin/bash

spin -a rems${no}.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DSAFETY -DNOCLAIM -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000 -n`);
    fs.writeFileSync(`prop1-${no}`, `#!/bin/bash

spin -a rems${no}.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000  -a -n -N prop1`);
    fs.writeFileSync(`prop2-${no}`, `#!/bin/bash

spin -a rems${no}.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000  -a -n -N prop2`);
    fs.writeFileSync(`prop3-${no}`, `#!/bin/bash

spin -a rems${no}.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000  -a -n -N prop3`);
}
for (var i = 2; i < max; i++) {
    gen(i)
}
fs.writeFileSync("results", "");
fs.writeFileSync("commands", "#!/bin/bash\n\n");
for (var i = 2; i < max; i++) {
    fs.appendFileSync("commands", `\\time -f \"memory %M\\ntime %e\" ./dl${i} >> results 2>&1\n`);
    for (var j = 0; j < 4; j++) {
	fs.appendFileSync("commands", `\\time -f \"memory %M\\ntime %e\" ./dl${i}-2 >> results 2>&1\n`);
    }
    fs.appendFileSync("commands", `\\time -f \"memory %M\\ntime %e\" ./prop1-${i} >> results 2>&1\n`);
    for (var j = 0; j < 4; j++) {
	fs.appendFileSync("commands", `\\time -f \"memory %M\\ntime %e\" ./prop1-${i}-2 >> results 2>&1\n`);
    }
    fs.appendFileSync("commands", `\\time -f \"memory %M\\ntime %e\" ./prop2-${i} >> results 2>&1\n`);
    for (var j = 0; j < 4; j++) {
	fs.appendFileSync("commands", `\\time -f \"memory %M\\ntime %e\" ./prop2-${i}-2 >> results 2>&1\n`);
    }
    fs.appendFileSync("commands", `\\time -f \"memory %M\\ntime %e\" ./prop3-${i} >> results 2>&1\n`);
    for (var j = 0; j < 4; j++) {
	fs.appendFileSync("commands", `\\time -f \"memory %M\\ntime %e\" ./prop3-${i}-2 >> results 2>&1\n`);
    }
}