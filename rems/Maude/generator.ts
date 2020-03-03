declare function require(x: string): any;

const fs = require('fs');
const max = 10;

class Gen {
    static main(no) {
	const write = [];
	write[0] = `rems-dl${no}.maude`;
	write[1] = `rems-prop1-${no}.maude`;
	write[2] = `rems-prop2-${no}.maude`;
	write[3] = `rems-prop3-${no}.maude`;
	no--;
	for (var j = 0; j < 4; j++) {
	    fs.writeFileSync(write[j], `load model-checker

mod BASE is
protecting NAT .
protecting BOOL .
protecting STRING .
inc CONFIGURATION .
sort Msgg .
ops GW Device : -> Cid [ctor] .
op State :_ : String -> Attribute [ctor gather (&)] .
op Msg :_ : Msgg -> Attribute [ctor gather (&)] .
op gw : -> Oid [ctor] .
op device : Nat -> Oid [ctor] .
ops msg ack encryptedMsg : Oid Oid -> Msgg [ctor] .
op none : -> Msgg [ctor] .

var A : AttributeSet .
var O : Oid .
var X : Configuration .
vars M M1 : Msgg .
var S : String .
\n`);
	    for (var i = 0; i < no; i++) {
		fs.appendFileSync(write[j], `  rl [b1-${i}] : < gw : GW | State : "g1", Msg : M , A > => < gw : GW | State : "g2", Msg : msg(gw, device(${i})), A > .
rl [b2-${i}] : < device(${i}) : Device | State : "d1", Msg : M, A > =>  < device(${i}) : Device | State : "d2", Msg : msg(device(${i}), gw), A > .
crl [b3-${i}] : < device(${i}) : Device | State : "d2", Msg : M, A > < gw : GW | State : S, Msg : M1, A > =>  < device(${i}) : Device | State : "d3", Msg : M, A > < gw : GW | State : "g3", Msg : M, A >
if M = msg(device(${i}), gw) /\\ (S == "g1" or S == "g2") .
crl [b4-${i}] : < device(${i}) : Device | State : "d3", Msg : M, A > < gw : GW | State : "g3", Msg : M, A > =>  < device(${i}) : Device | State : "d1", Msg : ack(gw, device(${i})), A > < gw : GW | State : "g1", Msg : M, A >
if M = msg(device(${i}), gw) .
crl [b5-${i}] : < device(${i}) : Device | State : S, Msg : M1, A > < gw : GW | State : S, Msg : M, A > =>  < device(${i}) : Device | State : "d4", Msg : M, A > < gw : GW | State : "g4", Msg : M, A >
if M = msg(gw, device(${i})) /\\ (S == "d1" or S == "d2") .
crl [b6-${i}] : < device(${i}) : Device | State : "d4", Msg : M, A > < gw : GW | State : "g4", Msg : M, A > =>  < device(${i}) : Device | State : "d1", Msg : M, A > < gw : GW | State : "g1", Msg : ack(device(${i}), gw), A >
if M = msg(gw, device(${i})) .
`);
	    }
	    fs.appendFileSync(write[j], ` endm

mod BASE2 is
protecting NAT .
protecting BOOL .
protecting STRING .
inc CONFIGURATION .
sort Msgg .
ops GW Device : -> Cid [ctor] .
op State :_ : String -> Attribute [ctor gather (&)] .
op Msg :_ : Msgg -> Attribute [ctor gather (&)] .
op gw : -> Oid [ctor] .
op device : Nat -> Oid [ctor] .
ops msg ack encryptedMsg : Oid Oid -> Msgg [ctor] .
op none : -> Msgg [ctor] .

var A : AttributeSet .
var O : Oid .
var X : Configuration .
vars M M1 : Msgg .
var S : String .
\n`);
	    for (var i = 0; i < no; i++) {
		fs.appendFileSync(write[j], `  rl [b1-${i}] : < gw : GW | State : "g1", Msg : M , A > => < gw : GW | State : "g2", Msg : msg(gw, device(${i})), A > .
rl [b9-${i}] : < gw : GW | State : "g2", Msg : msg(gw, device(${i})) , A > => < gw : GW | State : "g2", Msg : encryptedMsg(gw, device(${i})), A > .
rl [b4-${i}] : < device(${i}) : Device | State : "d1", Msg : M, A > =>  < device(${i}) : Device | State : "d2", Msg : msg(device(${i}), gw), A > .
rl [b10-${i}] : < device(${i}) : Device | State : "d2", Msg : msg(device(${i}), gw), A > =>  < device(${i}) : Device | State : "d2", Msg : encryptedMsg(device(${i}), gw), A > .
crl [b11-${i}] : < device(${i}) : Device | State : "d2", Msg : M, A > < gw : GW | State : S, Msg : M1, A > =>  < device(${i}) : Device | State : "d3", Msg : M, A > < gw : GW | State : "g3", Msg : M, A >
if M = encryptedMsg(device(${i}), gw) /\\ (S == "g1" or S == "g2") .
crl [b12-${i}] : < device(${i}) : Device | State : "d3", Msg : M, A > < gw : GW | State : "g3", Msg : M, A > =>  < device(${i}) : Device | State : "d1", Msg : ack(gw, device(${i})), A > < gw : GW | State : "g1", Msg : M, A >
if M = encryptedMsg(device(${i}), gw) .
crl [b13-${i}] : < device(${i}) : Device | State : S, Msg : M1, A > < gw : GW | State : "g2", Msg : M, A > =>  < device(${i}) : Device | State : "d4", Msg : M, A > < gw : GW | State : "g4", Msg : M, A >
if M = encryptedMsg(gw, device(${i})) /\\ (S == "d1" or S == "d2") .
crl [b14-${i}] : < device(${i}) : Device | State : "d4", Msg : M, A > < gw : GW | State : "g4", Msg : M, A > =>  < device(${i}) : Device | State : "d1", Msg : M, A > < gw : GW | State : "g1", Msg : ack(device(${i}), gw), A >
if M = encryptedMsg(gw, device(${i})) .
`);
	    }
	    fs.appendFileSync(write[j], `endm

mod MANAGING is
pr META-LEVEL .
inc CONFIGURATION .
inc MODEL-CHECKER .
inc LTL-SIMPLIFIER .
pr BASE .
sort ResultTriple?Set .
subsort Configuration < State .
subsort ResultTriple? < ResultTriple?Set .
op none : -> ResultTriple?Set [ctor] .
op __ : ResultTriple?Set ResultTriple?Set -> ResultTriple?Set [ctor assoc comm id: none] .
ops Managing Managed : -> Cid [ctor] .
op M :_ : Object -> Attribute [ctor gather (&)] .
op S :_ : String -> Attribute [ctor gather (&)] .
op C :_ : Term -> Attribute [ctor gather (&)] .
op R :_ : Module -> Attribute [ctor gather (&)] .
op metaESearch : Module Term Term Condition Qid Bound ~> ResultTriple?Set .
op metaESearch1 : Module Term Term Condition Qid Bound Nat ~> ResultTriple?Set .
op rewriteManaged : Object -> Object .
op evolve : Module Nat -> Module .
op evolveMsg : Nat -> Msg .
op addRL : Module RuleSet -> Module .
op removeRL : Module QidSet -> Module .
ops removeRLS getRLS : RuleSet QidSet -> RuleSet .
ops removeRLS1 getRL : RuleSet Qid -> RuleSet .
op rls : -> RuleSet .
op appear : Module Term Term -> Bool .
ops mg md : -> Oid [ctor] .
op deadlock : -> Configuration .
op dlFree : -> Prop .
op appearP : Term -> Prop .
op mgState : String -> Prop .

vars Mg Md : Oid .
var Conf : Term .
vars Beh Beh' : Module .
vars V V' : Variable .
vars T T1 T2 T3 : Term .
var S : Substitution? .
var M : Module .
var Cond : Condition .
vars Q Q' Q1 Q2 : Qid .
var B : Bound .
vars I N : Nat .
var RT : ResultTriple? .
var RTs : ResultTriple?Set .
var MdO : Object .
vars Str Str1 : String .
vars IL IL' : ImportList .
vars StS StS' : SortSet .
vars SDS SDS' : SubsortDeclSet .
vars ODS ODS' : OpDeclSet .
vars MAS MAS' : MembAxSet .
vars ES ES1 ES2 : EquationSet .
vars RS RS' : RuleSet .
var QS : QidSet .
vars TPL TPL' : TypeList .
vars TP TP' : Type .
vars AS AS' : AttrSet .
var OD : OpDecl .
var C : Cid .
var A : AttributeSet .
var O : Object .
var ST : Configuration .

eq metaESearch(M, T1, T2, Cond, Q, B) = metaESearch1(M, T1, T2, Cond, Q, B, 0) .
ceq metaESearch1(M, T1, T2, Cond, Q, B, I)
= if (RT == failure)
then none
else RT metaESearch1(M, T1, T2, Cond, Q, B, s I) fi
if RT := metaSearch(M, T1, T2, Cond, Q, B, I) .
`);
	    for (var i = 0; i < no; i++) {
		fs.appendFileSync(write[j], `  eq evolve(Beh, ${i}) = addRL(removeRL(Beh, 'b2-${i} ; 'b3-${i} ; 'b5-${i} ; 'b6-${i}), getRLS(rls, 'b9-${i} ; 'b10-${i} ; 'b11-${i} ; 'b12-${i} ; 'b13-${i} ; 'b14-${i})) .
`);
	    }
	    fs.appendFileSync(write[j], `  eq removeRL(mod Q is IL sorts StS . SDS ODS MAS ES RS endm, QS)
= mod Q is IL sorts StS . SDS ODS MAS ES removeRLS(RS, QS) endm .
eq removeRLS(RS, none) = RS .
eq removeRLS(RS, Q ; QS) = removeRLS(removeRLS1(RS, Q), QS) .
eq removeRLS1(none, Q) = none .
eq removeRLS1((rl T1 => T2 [label(Q1)] .) RS, Q2)
= if (Q1 == Q2) then removeRLS1(RS, Q2)
else (rl T1 => T2 [label(Q1)] .) removeRLS1(RS, Q2) fi .
eq removeRLS1((crl T1 => T2 if Cond [label(Q1)] .) RS, Q2)
= if (Q1 == Q2) then removeRLS1(RS, Q2)
else (crl T1 => T2 if Cond [label(Q1)] .) removeRLS1(RS, Q2) fi .
eq addRL(mod Q is IL sorts StS . SDS ODS MAS ES RS endm, RS')
= mod Q is IL sorts StS . SDS ODS MAS ES (RS RS') endm .
eq rls = upRls('BASE2, false) .
eq getRLS(RS, none) = none .
eq getRLS(RS, Q ; QS) = getRL(RS, Q) getRLS(RS, QS) .
eq getRL(none, Q) = none .
eq getRL((rl T1 => T2 [label(Q1)] .) RS, Q2)
= if (Q1 == Q2) then (rl T1 => T2 [label(Q1)] .) getRL(RS, Q2)
else getRL(RS, Q2) fi .
eq getRL((crl T1 => T2 if Cond [label(Q1)] .) RS, Q2)
= if (Q1 == Q2) then (crl T1 => T2 if Cond [label(Q1)] .) getRL(RS, Q2)
else getRL(RS, Q2) fi .
eq appear(Beh, Conf, T) = (metaMatch(Beh, '__[T, 'Rest:Configuration], Conf, nil, 0) =/= noMatch) .
eq (ST |= dlFree) = (metaSearch(upModule('MANAGING, false), upTerm(ST), 'conf:Configuration, nil, '+, 1, 0) =/= failure) .
eq (ST < Mg : Managing | S : Str, M : < Md : Managed | C : Conf, R : Beh > > |= appearP(T)) = appear(Beh, Conf, T) .
eq (ST < Mg : Managing | S : Str, M : < Md : Managed | C : Conf, R : Beh > > |= mgState(Str1)) = (Str == Str1) .

crl [mg1] : < Mg : Managing | S : Str, M : < Md : Managed | C : Conf, R : Beh > >
=> < Mg : Managing | S : Str, M : < Md : Managed | C : getTerm(RT), R : Beh > >
if (RT RTs) := metaESearch(Beh, Conf, 'conf:Configuration, nil, '+, 1) .
`);
	    for (var i = 0; i < no; i++) {
		fs.appendFileSync(write[j], `  crl [mg${i + 2}] : evolveMsg(${i}) < Mg : Managing | S : "m${i + 1}", M : < Md : Managed | C : Conf, R : Beh > >
=> < Mg : Managing | S : "m${i + 2}", M : < Md : Managed | C : Conf, R : evolve(Beh, ${i}) > >
if appear(Beh, Conf, '<_:_|_>['gw.Oid,'GW.Cid,'_\`,_['A:AttributeSet,'State\`:_['"g1".String]]]) .
`);
	    }
	    fs.appendFileSync(write[j], `endm\n\n`);
	}
	fs.appendFileSync(write[0], `search in MANAGING : `);
	for (var i = 0; i < no; i++) {
	    fs.appendFileSync(write[0], `evolveMsg(${i}) `);
	}
	fs.appendFileSync(write[0], `< mg : Managing | S : "m1", M : < md : Managed | C : upTerm(`);
	for (var i = 0; i < no; i++) {
	    fs.appendFileSync(write[0], `< device(${i}) : Device | State : "d1", Msg : none > `);
	}
	fs.appendFileSync(write[0], `< gw : GW | State : "g1", Msg : none >), R : upModule('BASE, false) > > =>! C:Configuration .

quit`);
	fs.appendFileSync(write[1], `red in MANAGING : modelCheck( `);
	for (var i = 0; i < no; i++) {
	    fs.appendFileSync(write[1], `evolveMsg(${i}) `);
	}
	fs.appendFileSync(write[1], `< mg : Managing | S : "m1", M : < md : Managed | C : upTerm(`);
	for (var i = 0; i < no; i++) {
	    fs.appendFileSync(write[1], `< device(${i}) : Device | State : "d1", Msg : none > `);
	}
	fs.appendFileSync(write[1], `< gw : GW | State : "g1", Msg : none >), R : upModule('BASE, false) > >, [] (appearP(upTerm(< device(0) : Device | State : "d3", Msg : M:Msgg >)) -> <> appearP(upTerm(< device(0) : Device | State : "d1", Msg : M:Msgg >)))) .

quit`);
	fs.appendFileSync(write[2], `red in MANAGING : modelCheck( `);
	for (var i = 0; i < no; i++) {
	    fs.appendFileSync(write[2], `evolveMsg(${i}) `);
	}
	fs.appendFileSync(write[2], `< mg : Managing | S : "m1", M : < md : Managed | C : upTerm(`);
	for (var i = 0; i < no; i++) {
	    fs.appendFileSync(write[2], `< device(${i}) : Device | State : "d1", Msg : none > `);
	}
	fs.appendFileSync(write[2], `< gw : GW | State : "g1", Msg : none >), R : upModule('BASE, false) > >, [] (mgState("m1") -> ~ appearP(upTerm(< O:Oid : C:Cid | Msg : encryptedMsg(O1:Oid, O2:Oid), A:AttributeSet >)))) .

quit`);
	fs.appendFileSync(write[3], `red in MANAGING : modelCheck( `);
	for (var i = 0; i < no; i++) {
	    fs.appendFileSync(write[3], `evolveMsg(${i}) `);
	}
	fs.appendFileSync(write[3], `< mg : Managing | S : "m1", M : < md : Managed | C : upTerm(`);
	for (var i = 0; i < no; i++) {
	    fs.appendFileSync(write[3], `< device(${i}) : Device | State : "d1", Msg : none > `);
	}
	fs.appendFileSync(write[3], `< gw : GW | State : "g1", Msg : none >), R : upModule('BASE, false) > >,   [] (mgState("m${i + 2}") -> [] ~ appearP(upTerm(< O:Oid : C:Cid | Msg : msg(O1:Oid, O2:Oid), A:AttributeSet >)))) .

quit`);
    }
}
for (var i = 2; i < max; i++) {
    Gen.main(i);
}
function main(no) {
    const write = [];
    fs.writeFileSync(`dl${no}`, `maude rems-dl${no}.maude`);
    fs.writeFileSync(`prop1-${no}`, `maude rems-prop1-${no}.maude`);
    fs.writeFileSync(`prop2-${no}`, `maude rems-prop2-${no}.maude`);
    fs.writeFileSync(`prop3-${no}`, `maude rems-prop3-${no}.maude`);
    fs.writeFileSync(`dl${no}-2`, `maude rems-dl${no}.maude > /dev/null`);
    fs.writeFileSync(`prop1-${no}-2`, `maude rems-prop1-${no}.maude > /dev/null`);
    fs.writeFileSync(`prop2-${no}-2`, `maude rems-prop2-${no}.maude > /dev/null`);
    fs.writeFileSync(`prop3-${no}-2`, `maude rems-prop3-${no}.maude > /dev/null`);
}
for (var i = 2; i < max; i++) {
    main(i);
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