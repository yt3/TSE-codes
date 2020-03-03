declare function require(x: string): any;

const fs = require('fs');
const max = 10;

function createSub(no, evolved) {
    var sub = '';
    for (var i = 0; i < no; i++) {
	if (evolved[i]) sub = sub + '_' + i;
    }
    return sub;
}

function create(write, no, current, evolved) {
    if (current > 0) {
	create(write, no, current - 1, evolved);
	evolved[current] = true;
	create(write, no, current - 1, evolved);
	evolved[current] = false;
    } else {
	var sub = createSub(no, evolved);
	var sub1 = '';
	for (var i = 0; i < no; i++) {
	    fs.appendFileSync(write, `before_comm${i}${sub}:sent = 0;
if\n`);
	    if (evolved[i]) {
		fs.appendFileSync(write, `::  // printf("process %d changed from before_comm to sending\\n", ${i});
goto sending_to${i}${sub}
::  // printf("process %d changed from before_comm to receiving\\n", ${i});
goto receiving_from${i}${sub}\n`)
	    } else {
		fs.appendFileSync(write, `::  // printf("process %d changed from before_comm to sending\\n", ${i});
goto sending_to${i}${sub}
::  // printf("process %d changed from before_comm to receiving\\n", ${i});
goto receiving_from${i}${sub}\n`)
		evolved[i] = true;
		sub1 = createSub(no, evolved);
		fs.appendFileSync(write, `::  // printf("process %d changed from before_evolution to evolved\\n", ${i + no});
goto before_comm${i}${sub1}\n`);
		evolved[i] = false;
	    }
	    fs.appendFileSync(write, `fi
sending_to${i}${sub}:`);
	    if (i == 0 && evolved[0]) fs.appendFileSync(write, `encrypted = 1;\n`);
	    if (i == 0) fs.appendFileSync(write, `sent = 1;\n`);
	    fs.appendFileSync(write, `if\n`);
	    for (var j = 0; j < no; j++) {
		fs.appendFileSync(write, `::  // printf("process %d changed from sending to before_comm\\n", ${i});
goto before_comm${j}${sub}\n`);
	    }
	    fs.appendFileSync(write, `fi\n`);
	    fs.appendFileSync(write, `receiving_from${i}${sub}:`)
	    if (i == 0 && evolved[0]) fs.appendFileSync(write, `encrypted = 1;\n`);
	    if (i == 0) fs.appendFileSync(write, `sent = 1;\n`);
	    fs.appendFileSync(write, `if\n`);
	    for (var j = 0; j < no; j++) {
		fs.appendFileSync(write, `::  // printf("process %d changed from receiving to before_comm\\n", ${i});
goto before_comm${j}${sub}\n`);
	    }
	    fs.appendFileSync(write, `fi\n`);
	}
	evolved[0] = true;
	sub = createSub(no, evolved);
	for (var i = 0; i < no; i++) {
	    fs.appendFileSync(write, `before_comm${i}${sub}:sent = 0;
evolved = 1;
if\n`);
	    if (evolved[i]) {
		fs.appendFileSync(write, `::  // printf("process %d changed from before_comm to sending\\n", ${i});
goto sending_to${i}${sub}
::  // printf("process %d changed from before_comm to receiving\\n", ${i});
goto receiving_from${i}${sub}\n`)
	    } else {
		fs.appendFileSync(write, `::  // printf("process %d changed from before_comm to sending\\n", ${i});
goto sending_to${i}${sub}
::  // printf("process %d changed from before_comm to receiving\\n", ${i});
goto receiving_from${i}${sub}\n`)
		evolved[i] = true;
		sub1 = createSub(no, evolved);
		fs.appendFileSync(write, `::  // printf("process %d changed from before_evolution to evolved\\n", ${i + no});
goto before_comm${i}${sub1}\n`);
		evolved[i] = false;
	    }
	    fs.appendFileSync(write, `fi
sending_to${i}${sub}:`);
	    if (i == 0 && evolved[0]) fs.appendFileSync(write, `encrypted = 1;\n`);
	    if (i == 0) fs.appendFileSync(write, `sent = 1;\n`);
	    fs.appendFileSync(write, `if\n`);
	    for (var j = 0; j < no; j++) {
		fs.appendFileSync(write, `::  // printf("process %d changed from sending to before_comm\\n", ${i});
goto before_comm${j}${sub}\n`);
	    }
	    fs.appendFileSync(write, `fi\n`);
	    fs.appendFileSync(write, `receiving_from${i}${sub}:`)
	    if (i == 0 && evolved[0]) fs.appendFileSync(write, `encrypted = 1;\n`);
	    if (i == 0) fs.appendFileSync(write, `sent = 1;\n`);
	    fs.appendFileSync(write, `if\n`);
	    for (var j = 0; j < no; j++) {
		fs.appendFileSync(write, `::  // printf("process %d changed from receiving to before_comm\\n", ${i});
goto before_comm${j}${sub}\n`);
	    }
	    fs.appendFileSync(write, `fi\n`);
	}
	evolved[0] = false;
    }
}

function main(no) {
    const write = `rems${no}.pml`;
    no--;
    var sub;
    var evolved = [];
    for (var i = 0; i < no; i++) {
	evolved.push(false);
    }
    fs.writeFileSync(write, `bool sent, encrypted, evolved;

init {
if
:: evolved = 0;
if\n`);
    for (var i = 0; i < no; i++) {
	fs.appendFileSync(write, `:: goto before_comm${i}\n`);
    }
    fs.appendFileSync(write, `fi
:: evolved = 1;
if\n`);
    for (var i = 0; i < no; i++) {
	fs.appendFileSync(write, `:: goto before_comm${i}_0\n`);
    }
    fs.appendFileSync(write, `
fi\n`);
    create(write, no, no - 1, evolved);
    fs.appendFileSync(write, `fi
}

ltl prop1 { [] (!evolved -> !encrypted) }

ltl prop2 { [] (sent && evolved -> [] encrypted) }

ltl prop3 { [] (sent -> <> !sent) }`);
}
for (var i = 2; i < max; i++) {
    main(i)
}
function gen(no) {
    fs.writeFileSync(`dl${no}`, `#!/bin/bash

(spin -a rems${no}.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DSAFETY -DNOCLAIM -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000 -n) > /dev/null`);
    fs.writeFileSync(`prop-${no}`, `#!/bin/bash

(spin -a rems${no}.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000  -a -n -N prop1) > /dev/null`);
    fs.writeFileSync(`dl${no}-2`, `#!/bin/bash

spin -a rems${no}.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DSAFETY -DNOCLAIM -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000 -n`);
    fs.writeFileSync(`prop1-${no}-2`, `#!/bin/bash

spin -a rems${no}.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000  -a -n -N prop1`);
    fs.writeFileSync(`prop2-${no}-2`, `#!/bin/bash

spin -a rems${no}.pml; gcc -DMEMLIM=12000 -O2 -DXUSAFE -DCOLLAPSE -w -o pan pan.c; ./pan -m5000000  -a -n -N prop2`);
    fs.writeFileSync(`prop3-${no}-2`, `#!/bin/bash

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