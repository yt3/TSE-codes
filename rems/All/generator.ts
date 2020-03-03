declare function require(x: string): any;

const fs = require('fs');
const max = 36;

function main(no) {
    const write = `rems${no}.pml`;
    no--;
    fs.writeFileSync(write, `bool is_before_comm = 1, encrypted, evolved;

init {
if
:: goto before_comm0_0
:: evolved = 1;
goto before_comm0_1
fi\n`);
    for (var i = 0; i < no; i++) {
	for (var j = 0; j <= no; j++) {
	    fs.appendFileSync(write, `before_comm${i}_${j}:is_before_comm = 1;
if
:: // printf("process %d changed from before_comm to sending\\n", ${i});
goto sending_to${i}_${j}
:: // printf("process %d changed from before_comm to receiving\\n", ${i});
goto receiving_from${i}_${j}\n`);
	    if (j < no) {
		fs.appendFileSync(write, `:: `);
	    if (j == 0) {
		fs.appendFileSync(write, `evolved = 1;\n`);
	    }
		fs.appendFileSync(write, `// printf("process %d changed from before_evolution to evolved\\n", ${i + no});
goto before_comm${i}_${j + 1}\n`);
	    }
	    fs.appendFileSync(write, `fi
sending_to${i}_${j}:`);
	    if (i == 0 && j > 0) fs.appendFileSync(write, `encrypted = 1;\n`)
	    if (i == 0) fs.appendFileSync(write, `is_before_comm = 0;\n`);
	    fs.appendFileSync(write, `if\n`);
	    for (var k = 0; k < no; k++) {
		fs.appendFileSync(write, `:: // printf("process %d changed from sending to before_comm\\n", ${i});
goto before_comm${k}_${j}\n`)
	    }
	    fs.appendFileSync(write, `fi
receiving_from${i}_${j}:`);
	    if (i == 0 && j > 0) fs.appendFileSync(write, `encrypted = 1;\n`)
	    if (i == 0) fs.appendFileSync(write, `is_before_comm = 0;\n`);
	    fs.appendFileSync(write, `if\n`);
	    for (var k = 0; k < no; k++) {
		fs.appendFileSync(write, `:: // printf("process %d changed from receiving to before_comm$\\n", ${i});
goto before_comm${k}_${j}\n`)
	    }
	    fs.appendFileSync(write, `fi\n`);
	}
    }
    fs.appendFileSync(write, `}

ltl prop1 { [] (!evolved -> !encrypted) }

ltl prop2 { [] (!is_before_comm && evolved -> [] encrypted) }

ltl prop3 { [] (!is_before_comm -> <> is_before_comm) }`);
}
for (var i = 2; i < max; i+=3) {
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
for (var i = 2; i < max; i+=3) {
    gen(i)
}
fs.writeFileSync("results", "");
fs.writeFileSync("commands", "#!/bin/bash\n\n");
for (var i = 2; i < max; i+=3) {
    fs.appendFileSync("commands", `\\time -f \"memory %M\\ntime %e\" ./dl${i}-2 >> results 2>&1
\\time -f \"memory %M\\ntime %e\" ./prop1-${i}-2 >> results 2>&1
./prop2-${i}-2 >> results 2>&1
./prop3-${i}-2 >> results 2>&1\n`);
    for (var j = 0; j < 4; j++) {
	fs.appendFileSync("commands", `\\time -f \"memory %M\\ntime %e\" ./dl${i} >> results 2>&1\n`);
    }
    for (var k = 0; k < 4; k++) {
	fs.appendFileSync("commands", `\\time -f \"memory %M\\ntime %e\" ./prop-${i} >> results 2>&1\n`);
    }
}
