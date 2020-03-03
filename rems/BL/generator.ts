declare function require(x: string): any;

const fs = require('fs');
const max = 10;

function main(noOfDevices) {
    var index, index0, no: number;
    const write = `rems${noOfDevices}.pml`;
    const noOfStates = noOfDevices * 12 - 8;
    const noOfProcesses = noOfDevices * 2;
    fs.writeFileSync(write, `#define NO_OF_PROCESSES		${noOfProcesses}\n`);
    for (var i = 1; i < noOfDevices; i++) {
	fs.appendFileSync(write, `#define GUARD0_${i}	(! (ol && dob == d${i}) || ((! (current[0] == receiving0_0 ||  current[${i}] == receiving0) || !encrypted[${i-1}]) && (! (current[0] == receiving1_0 ||  current[${i}] == receiving1) || encrypted[${i-1}])))
#define GUARD1_${i}	(! (! ol && dm == d${i} && current[${i+noOfDevices}] == before_evolution) || current[${i}] == before_comm)\n`);
    }
    fs.appendFileSync(write, `
mtype = { before_comm, before_evolution, evolved, after_enc, sending, receiving0, receiving1, after_dec, before_comm_0, before_evolution_0, evolved_0, after_enc_0, sending_0, receiving0_0, receiving1_0, after_dec_0, comm0, ack0, comm1, ack1, evolve, evolve_0, `);
    for (var i = 0; i < noOfDevices; i++) {
	fs.appendFileSync(write, `encrypt_${i}, decrypt_${i}, d${i}`);
	if (i + 1 < noOfDevices) fs.appendFileSync(write, `, `);
    }
    fs.appendFileSync(write, `}

mtype current[NO_OF_PROCESSES];
bool encrypted[${noOfDevices - 1}], ol;

init {\n`);
    fs.appendFileSync(write,`mtype dob, dm, s_before_comm_0_targets[${noOfProcesses}], s_after_enc_0_targets[${noOfProcesses}], s_before_comm_0_ls[${noOfProcesses}], s_after_enc_0_ls[${noOfProcesses}], `);
    for (var i = 1; i < noOfDevices; i++) {
	fs.appendFileSync(write,`s_sending_0_${i}_targets, s_receiving0_0_${i}_targets, s_receiving1_0_${i}_targets, s_after_dec_0_${i}_targets, s_before_comm_${i}_targets[2], s_after_enc_${i}_targets[2], s_sending_${i}_targets, s_receiving0_${i}_targets, s_receiving1_${i}_targets, s_after_dec_${i}_targets, s_sending_0_${i}_ls, s_receiving0_0_${i}_ls, s_receiving1_0_${i}_ls, s_after_dec_0_${i}_ls, s_before_comm_${i}_ls[2], s_after_enc_${i}_ls[2], s_sending_${i}_ls, s_receiving0_${i}_ls, s_receiving1_${i}_ls, s_after_dec_${i}_ls`);
	if (i < noOfDevices - 1) fs.appendFileSync(write,`, `);
    }
    fs.appendFileSync(write,`;
atomic {
current[0] = before_comm_0;
current[${noOfDevices}] = before_evolution_0;\n`);
    for (var i = 1; i < noOfDevices; i++) {
	fs.appendFileSync(write,`s_before_comm_0_targets[${i - 1}] = sending_0;
s_before_comm_0_targets[${i + noOfDevices - 2}] = receiving0_0;
s_after_enc_0_targets[${i - 1}] = sending_0;
s_after_enc_0_targets[${i + noOfDevices - 2}] = receiving0_0;
s_sending_0_${i}_targets = before_comm_0;
s_receiving0_0_${i}_targets = before_comm_0;
s_before_comm_${i}_targets[0] = sending;
s_before_comm_${i}_targets[1] = receiving0;
s_sending_${i}_targets = before_comm;
s_receiving0_${i}_targets = before_comm;
s_before_comm_0_ls[${i - 1}] = comm0;
s_before_comm_0_ls[${i + noOfDevices - 2}] = comm1;
s_after_enc_0_ls[${i - 1}] = comm0;
s_after_enc_0_ls[${i + noOfDevices - 2}] = comm1;
s_sending_0_${i}_ls = ack0;
s_receiving0_0_${i}_ls = ack1;
s_before_comm_${i}_ls[0] = comm1;
s_before_comm_${i}_ls[1] = comm0;
s_sending_${i}_ls = ack1;
s_receiving0_${i}_ls = ack0;
current[${i}] = before_comm;
current[${i + noOfDevices}] = before_evolution;\n`)
    }
    fs.appendFileSync(write, `if
:: ol = 0
:: ol = 1
fi
if\n`);
    for (var i = 1; i < noOfDevices; i++) {
	fs.appendFileSync(write,`:: dob = d${i}\n`)
    }
    fs.appendFileSync(write, `fi
if\n`);
    for (var i = 1; i < noOfDevices; i++) {
	fs.appendFileSync(write,`:: dm = d${i}\n`)
    }
    fs.appendFileSync(write, `fi
}
do
:: atomic {
if\n`);
    for (var i = 1; i < noOfDevices; i++) {
	fs.appendFileSync(write,`:: ol && dob == d${i} ->
if
:: current[0] == before_comm_0 && s_before_comm_0_ls[${i - 1}] == comm0 && current[${i}] == before_comm && s_before_comm_${i}_ls[1] == comm0 ->
encrypted[${i - 1}] = 0;
// printf("process %d changed from %e to %e\\n", 0, current[0], s_before_comm_0_targets[${i - 1}]);
current[0] = s_before_comm_0_targets[${i - 1}];
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], s_before_comm_${i}_targets[1]);
current[${i}] = s_before_comm_${i}_targets[1]
:: current[0] == before_comm_0 && s_before_comm_0_ls[${i - 1}] == comm0 && current[${i}] == after_enc && s_after_enc_${i}_ls[1] == comm0  ->
encrypted[${i - 1}] = 1;
// printf("process %d changed from %e to %e\\n", 0, current[0], s_before_comm_0_targets[${i - 1}]);
current[0] = s_before_comm_0_targets[${i - 1}];
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], s_after_enc_${i}_targets[0]);
current[${i}] = s_after_enc_${i}_targets[0]
:: current[0] == before_comm_0 && s_before_comm_0_ls[${i - 1}] == encrypt_0 ->
// printf("process %d changed from %e to %e\\n", 0, current[0], s_before_comm_0_targets[${i - 1}]);
current[0] = s_before_comm_0_targets[${i - 1}];
:: current[${i}] == before_comm && s_before_comm_${i}_ls[0] == encrypt_${i} ->
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], s_before_comm_${i}_targets[0]);
current[${i}] = s_before_comm_${i}_targets[0];
:: ((current[0] == before_comm_0 && s_before_comm_0_ls[${i + noOfDevices - 2}] == comm1) || (current[0] == after_enc_0 && s_after_enc_0_ls[${i + noOfDevices - 2}] == comm1)) && current[${i}] == before_comm && s_before_comm_${i}_ls[0] == comm1 ->
encrypted[${i - 1}] = 0;
// printf("process %d changed from %e to %e\\n", 0, current[0], s_before_comm_0_targets[${i + noOfDevices - 2}]);
current[0] = s_before_comm_0_targets[${i + noOfDevices - 2}];
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], s_before_comm_${i}_targets[1]);
current[${i}] = s_before_comm_${i}_targets[0]
:: ((current[0] == before_comm_0 && s_before_comm_0_ls[${i + noOfDevices - 2}] == comm1) || (current[0] == after_enc_0 && s_after_enc_0_ls[${i + noOfDevices - 2}] == comm1)) && current[${i}] == after_enc && s_after_enc_${i}_ls[0] == comm1 ->
encrypted[${i - 1}] = 1;
// printf("process %d changed from %e to %e\\n", 0, current[0], s_before_comm_0_targets[${i + noOfDevices - 2}]);
current[0] = s_before_comm_0_targets[${i + noOfDevices - 2}];
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], s_after_enc_${i}_targets[0]);
current[${i}] = s_after_enc_${i}_targets[0]
:: current[0] == receiving1_0 && s_receiving1_0_${i}_ls == decrypt_0 ->
// printf("process %d changed from %e to %e\\n", 0, current[0], s_receiving1_0_${i}_targets);
current[0] = s_receiving1_0_${i}_targets;
:: current[${i}] == receiving1 && s_receiving1_${i}_ls == decrypt_${i} ->
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], s_receiving1_${i}_targets);
current[${i}] = s_receiving1_${i}_targets;
:: current[0] == sending_0 && s_sending_0_${i}_ls == ack0 && current[${i}] == receiving0 && s_receiving0_${i}_ls == ack0 && GUARD0_${i} ->
// printf("process %d changed from %e to %e\\n", 0, current[0], s_sending_0_${i}_targets);
current[0] = s_sending_0_${i}_targets;
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], s_receiving0_${i}_targets);
current[${i}] = s_receiving0_${i}_targets;
:: current[0] == sending_0 && s_sending_0_${i}_ls == ack0 && current[${i}] == after_dec && s_after_dec_${i}_ls == ack0 && GUARD0_${i} ->
// printf("process %d changed from %e to %e\\n", 0, current[0], s_sending_0_${i}_targets);
current[0] = s_sending_0_${i}_targets;
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], s_after_dec_${i}_targets);
current[${i}] = s_after_dec_${i}_targets;
:: current[0] == receiving0_0 && s_receiving0_0_${i}_ls == ack1 && current[${i}] == sending && s_sending_${i}_ls == ack1 && GUARD0_${i} ->
// printf("process %d changed from %e to %e\\n", 0, current[0], s_receiving0_0_${i}_targets);
current[0] = s_receiving0_0_${i}_targets;
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], s_sending_${i}_targets);
current[${i}] = s_sending_${i}_targets;
:: current[0] == after_dec_0 && s_after_dec_0_${i}_ls == ack1 && current[${i}] == sending && s_sending_${i}_ls == ack1 && GUARD0_${i} ->
// printf("process %d changed from %e to %e\\n", 0, current[0], s_after_dec_0_${i}_targets);
current[0] = s_after_dec_0_${i}_targets;
// printf("process %d changed from %e to %e\\n", ${i}, current[${i}], s_sending_${i}_targets);
current[${i}] = s_sending_${i}_targets;
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
current[${i + noOfDevices}] = evolved;
s_before_comm_0_targets[${i - 1}] = after_enc_0;
s_before_comm_0_targets[${i + noOfDevices - 2}] = receiving1_0;
s_after_enc_0_targets[${i + noOfDevices - 2}] = receiving1_0;
s_receiving0_0_${i}_targets = 0;
s_receiving1_0_${i}_targets = after_dec_0;
s_after_dec_0_${i}_targets = before_comm_0;
s_before_comm_${i}_targets[0] = after_enc;
s_before_comm_${i}_targets[1] = receiving1;
s_after_enc_${i}_targets[0] = sending;
s_after_enc_${i}_targets[1] = receiving1;
s_sending_${i}_targets = before_comm;
s_receiving0_${i}_targets = 0;
s_receiving1_${i}_targets = after_dec;
s_after_dec_${i}_targets = before_comm;
s_before_comm_0_ls[${i - 1}] = encrypt_0;
s_before_comm_0_ls[${i + noOfDevices - 2}] = comm1;
s_after_enc_0_ls[${i + noOfDevices - 2}] = comm1;
s_receiving0_0_${i}_ls = 0;
s_receiving1_0_${i}_ls = decrypt_0;
s_after_dec_0_${i}_ls = ack1;
s_before_comm_${i}_ls[0] = encrypt_${i};
s_before_comm_${i}_ls[1] = comm0;
s_after_enc_${i}_ls[0] = comm1;
s_after_enc_${i}_ls[1] = comm0;
s_sending_${i}_ls = ack1;
s_receiving0_${i}_ls = 0;
s_receiving1_${i}_ls = decrypt_${i};
s_after_dec_${i}_ls = ack0\n`);
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
    fs.appendFileSync(write, `fi
:: !ol ->
if\n`);
    for (var i = 1; i < noOfDevices; i++) {
	fs.appendFileSync(write,`:: dm = d${i}\n`);
    }
    fs.appendFileSync(write, `fi
:: else -> skip
fi
}
od
}

ltl prop1 { [] (current[${noOfDevices + 1}] == before_evolution -> !encrypted[0]) }

ltl prop2 { [] ((current[1] != before_comm) && (current[1] != after_enc) && (current[${noOfDevices + 1}] == evolved) -> [] (encrypted[0])) }

ltl prop3 { []<>(ol == 1) -> [] ((current[1] == sending || current[1] == receiving0 || current[1] == receiving1) -> <> (current[1] == before_comm)) }`);
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