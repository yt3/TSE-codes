#define NO_OF_PROCESSES		6
#define GUARD0_1	(! (ol && dob == d1) || ((! (current[0] == receiving0_0 ||  current[1] == receiving0) || !encrypted[0]) && (! (current[0] == receiving1_0 ||  current[1] == receiving1) || encrypted[0])))
#define GUARD1_1	(! ol && dm == d1 && current[4] == before_evolution && current[1] == before_comm)
#define GUARD0_2	(! (ol && dob == d2) || ((! (current[0] == receiving0_0 ||  current[2] == receiving0) || !encrypted[1]) && (! (current[0] == receiving1_0 ||  current[2] == receiving1) || encrypted[1])))
#define GUARD1_2	(! ol && dm == d2 && current[5] == before_evolution && current[2] == before_comm)

mtype = { before_comm, before_evolution, evolved, after_enc, sending, receiving0, receiving1, after_dec, before_comm_0, before_evolution_0, evolved_0, after_enc_0, sending_0, receiving0_0, receiving1_0, after_dec_0, comm0, ack0, comm1, ack1, evolve, evolve_0, encrypt_0, decrypt_0, d0, encrypt_1, decrypt_1, d1, encrypt_2, decrypt_2, d2}

mtype current[NO_OF_PROCESSES];
bool encrypted[2], ol;

init {
mtype dob, dm, s_before_comm_0_targets[6], s_after_enc_0_targets[6], s_before_comm_0_ls[6], s_after_enc_0_ls[6], s_sending_0_1_targets, s_receiving0_0_1_targets, s_receiving1_0_1_targets, s_after_dec_0_1_targets, s_before_comm_1_targets[2], s_after_enc_1_targets[2], s_sending_1_targets, s_receiving0_1_targets, s_receiving1_1_targets, s_after_dec_1_targets, s_sending_0_1_ls, s_receiving0_0_1_ls, s_receiving1_0_1_ls, s_after_dec_0_1_ls, s_before_comm_1_ls[2], s_after_enc_1_ls[2], s_sending_1_ls, s_receiving0_1_ls, s_receiving1_1_ls, s_after_dec_1_ls, s_sending_0_2_targets, s_receiving0_0_2_targets, s_receiving1_0_2_targets, s_after_dec_0_2_targets, s_before_comm_2_targets[2], s_after_enc_2_targets[2], s_sending_2_targets, s_receiving0_2_targets, s_receiving1_2_targets, s_after_dec_2_targets, s_sending_0_2_ls, s_receiving0_0_2_ls, s_receiving1_0_2_ls, s_after_dec_0_2_ls, s_before_comm_2_ls[2], s_after_enc_2_ls[2], s_sending_2_ls, s_receiving0_2_ls, s_receiving1_2_ls, s_after_dec_2_ls;
atomic {
current[0] = before_comm_0;
current[3] = before_evolution_0;
s_before_comm_0_targets[0] = sending_0;
s_before_comm_0_targets[2] = receiving0_0;
s_after_enc_0_targets[0] = sending_0;
s_after_enc_0_targets[2] = receiving0_0;
s_sending_0_1_targets = before_comm_0;
s_receiving0_0_1_targets = before_comm_0;
s_before_comm_1_targets[0] = sending;
s_before_comm_1_targets[1] = receiving0;
s_sending_1_targets = before_comm;
s_receiving0_1_targets = before_comm;
s_before_comm_0_ls[0] = comm0;
s_before_comm_0_ls[2] = comm1;
s_after_enc_0_ls[0] = comm0;
s_after_enc_0_ls[2] = comm1;
s_sending_0_1_ls = ack0;
s_receiving0_0_1_ls = ack1;
s_before_comm_1_ls[0] = comm1;
s_before_comm_1_ls[1] = comm0;
s_sending_1_ls = ack1;
s_receiving0_1_ls = ack0;
current[1] = before_comm;
current[4] = before_evolution;
s_before_comm_0_targets[1] = sending_0;
s_before_comm_0_targets[3] = receiving0_0;
s_after_enc_0_targets[1] = sending_0;
s_after_enc_0_targets[3] = receiving0_0;
s_sending_0_2_targets = before_comm_0;
s_receiving0_0_2_targets = before_comm_0;
s_before_comm_2_targets[0] = sending;
s_before_comm_2_targets[1] = receiving0;
s_sending_2_targets = before_comm;
s_receiving0_2_targets = before_comm;
s_before_comm_0_ls[1] = comm0;
s_before_comm_0_ls[3] = comm1;
s_after_enc_0_ls[1] = comm0;
s_after_enc_0_ls[3] = comm1;
s_sending_0_2_ls = ack0;
s_receiving0_0_2_ls = ack1;
s_before_comm_2_ls[0] = comm1;
s_before_comm_2_ls[1] = comm0;
s_sending_2_ls = ack1;
s_receiving0_2_ls = ack0;
current[2] = before_comm;
current[5] = before_evolution;
if
:: ol = 0
:: ol = 1
fi
if
:: dob = d1
:: dob = d2
fi
if
:: dm = d1
:: dm = d2
fi
}
do
:: atomic {
if
:: ol && dob == d1 ->
if
:: current[0] == before_comm_0 && s_before_comm_0_ls[0] == comm0 && current[1] == before_comm && s_before_comm_1_ls[1] == comm0 ->
encrypted[0] = 0;
printf("process %d changed from %e to %e\n", 0, current[0], s_before_comm_0_targets[0]);
current[0] = s_before_comm_0_targets[0];
printf("process %d changed from %e to %e\n", 1, current[1], s_before_comm_1_targets[1]);
current[1] = s_before_comm_1_targets[1]
:: current[0] == after_enc_0 && s_after_enc_0_ls[0] == comm0 && current[1] == before_comm && s_before_comm_1_ls[1] == comm0  ->
encrypted[0] = 1;
printf("process %d changed from %e to %e\n", 0, current[0], s_after_enc_0_targets[0]);
current[0] = s_after_enc_0_targets[0];
printf("process %d changed from %e to %e\n", 1, current[1], s_before_comm_1_targets[1]);
current[1] = s_before_comm_1_targets[1]
:: current[0] == after_enc_0 && s_after_enc_0_ls[0] == comm0 && current[1] == after_enc && s_after_enc_1_ls[1] == comm0  ->
encrypted[0] = 1;
printf("process %d changed from %e to %e\n", 0, current[0], s_after_enc_0_targets[0]);
current[0] = s_after_enc_0_targets[0];
printf("process %d changed from %e to %e\n", 1, current[1], s_after_enc_1_targets[1]);
current[1] = s_after_enc_1_targets[1]
:: current[0] == before_comm_0 && s_before_comm_0_ls[0] == encrypt_0 ->
printf("process %d changed from %e to %e\n", 0, current[0], s_before_comm_0_targets[0]);
current[0] = s_before_comm_0_targets[0];
:: current[1] == before_comm && s_before_comm_1_ls[0] == encrypt_1 ->
printf("process %d changed from %e to %e\n", 1, current[1], s_before_comm_1_targets[0]);
current[1] = s_before_comm_1_targets[0];
:: ((current[0] == before_comm_0 && s_before_comm_0_ls[2] == comm1) || (current[0] == after_enc_0 && s_after_enc_0_ls[2] == comm1)) && current[1] == before_comm && s_before_comm_1_ls[0] == comm1 ->
encrypted[0] = 0;
printf("process %d changed from %e to %e\n", 0, current[0], s_before_comm_0_targets[2]);
current[0] = s_before_comm_0_targets[2];
printf("process %d changed from %e to %e\n", 1, current[1], s_before_comm_1_targets[0]);
current[1] = s_before_comm_1_targets[0]
:: ((current[0] == before_comm_0 && s_before_comm_0_ls[2] == comm1) || (current[0] == after_enc_0 && s_after_enc_0_ls[2] == comm1)) && current[1] == after_enc && s_after_enc_1_ls[0] == comm1 ->
encrypted[0] = 1;
printf("process %d changed from %e to %e\n", 0, current[0], s_before_comm_0_targets[2]);
current[0] = s_before_comm_0_targets[2];
printf("process %d changed from %e to %e\n", 1, current[1], s_after_enc_1_targets[0]);
current[1] = s_after_enc_1_targets[0]
:: current[0] == receiving1_0 && s_receiving1_0_1_ls == decrypt_0 ->
printf("process %d changed from %e to %e\n", 0, current[0], s_receiving1_0_1_targets);
current[0] = s_receiving1_0_1_targets;
:: current[1] == receiving1 && s_receiving1_1_ls == decrypt_1 ->
printf("process %d changed from %e to %e\n", 1, current[1], s_receiving1_1_targets);
current[1] = s_receiving1_1_targets;
:: current[0] == sending_0 && s_sending_0_1_ls == ack0 && current[1] == receiving0 && s_receiving0_1_ls == ack0 && GUARD0_1 ->
printf("process %d changed from %e to %e\n", 0, current[0], s_sending_0_1_targets);
current[0] = s_sending_0_1_targets;
printf("process %d changed from %e to %e\n", 1, current[1], s_receiving0_1_targets);
current[1] = s_receiving0_1_targets;
:: current[0] == sending_0 && s_sending_0_1_ls == ack0 && current[1] == after_dec && s_after_dec_1_ls == ack0 && GUARD0_1 ->
printf("process %d changed from %e to %e\n", 0, current[0], s_sending_0_1_targets);
current[0] = s_sending_0_1_targets;
printf("process %d changed from %e to %e\n", 1, current[1], s_after_dec_1_targets);
current[1] = s_after_dec_1_targets;
  :: current[1] == after_dec && s_after_dec_1_ls == ack0 ->
printf("process %d changed from %e to %e\n", 1, current[1], after_dec);
current[1] = after_dec;
:: current[0] == receiving0_0 && s_receiving0_0_1_ls == ack1 && current[1] == sending && s_sending_1_ls == ack1 && GUARD0_1 ->
printf("process %d changed from %e to %e\n", 0, current[0], s_receiving0_0_1_targets);
current[0] = s_receiving0_0_1_targets;
printf("process %d changed from %e to %e\n", 1, current[1], s_sending_1_targets);
current[1] = s_sending_1_targets;
:: current[0] == after_dec_0 && s_after_dec_0_1_ls == ack1 && current[1] == sending && s_sending_1_ls == ack1 && GUARD0_1 ->
printf("process %d changed from %e to %e\n", 0, current[0], s_after_dec_0_1_targets);
current[0] = s_after_dec_0_1_targets;
printf("process %d changed from %e to %e\n", 1, current[1], s_sending_1_targets);
current[1] = s_sending_1_targets;
fi
:: ol && dob == d2 ->
if
:: current[0] == before_comm_0 && s_before_comm_0_ls[1] == comm0 && current[2] == before_comm && s_before_comm_2_ls[1] == comm0 ->
encrypted[1] = 0;
printf("process %d changed from %e to %e\n", 0, current[0], s_before_comm_0_targets[1]);
current[0] = s_before_comm_0_targets[1];
printf("process %d changed from %e to %e\n", 2, current[2], s_before_comm_2_targets[1]);
current[2] = s_before_comm_2_targets[1]
:: current[0] == after_enc_0 && s_after_enc_0_ls[1] == comm0 && current[2] == before_comm && s_before_comm_2_ls[1] == comm0  ->
encrypted[1] = 1;
printf("process %d changed from %e to %e\n", 0, current[0], s_after_enc_0_targets[1]);
current[0] = s_after_enc_0_targets[1];
printf("process %d changed from %e to %e\n", 2, current[2], s_before_comm_2_targets[1]);
current[2] = s_before_comm_2_targets[1]
:: current[0] == after_enc_0 && s_after_enc_0_ls[1] == comm0 && current[2] == after_enc && s_after_enc_2_ls[1] == comm0  ->
encrypted[1] = 1;
printf("process %d changed from %e to %e\n", 0, current[0], s_after_enc_0_targets[1]);
current[0] = s_after_enc_0_targets[1];
printf("process %d changed from %e to %e\n", 2, current[2], s_after_enc_2_targets[1]);
current[2] = s_after_enc_2_targets[1]
:: current[0] == before_comm_0 && s_before_comm_0_ls[1] == encrypt_0 ->
printf("process %d changed from %e to %e\n", 0, current[0], s_before_comm_0_targets[1]);
current[0] = s_before_comm_0_targets[1];
:: current[2] == before_comm && s_before_comm_2_ls[0] == encrypt_2 ->
printf("process %d changed from %e to %e\n", 2, current[2], s_before_comm_2_targets[0]);
current[2] = s_before_comm_2_targets[0];
:: ((current[0] == before_comm_0 && s_before_comm_0_ls[3] == comm1) || (current[0] == after_enc_0 && s_after_enc_0_ls[3] == comm1)) && current[2] == before_comm && s_before_comm_2_ls[0] == comm1 ->
encrypted[1] = 0;
printf("process %d changed from %e to %e\n", 0, current[0], s_before_comm_0_targets[3]);
current[0] = s_before_comm_0_targets[3];
printf("process %d changed from %e to %e\n", 2, current[2], s_before_comm_2_targets[0]);
current[2] = s_before_comm_2_targets[0]
:: ((current[0] == before_comm_0 && s_before_comm_0_ls[3] == comm1) || (current[0] == after_enc_0 && s_after_enc_0_ls[3] == comm1)) && current[2] == after_enc && s_after_enc_2_ls[0] == comm1 ->
encrypted[1] = 1;
printf("process %d changed from %e to %e\n", 0, current[0], s_before_comm_0_targets[3]);
current[0] = s_before_comm_0_targets[3];
printf("process %d changed from %e to %e\n", 2, current[2], s_after_enc_2_targets[0]);
current[2] = s_after_enc_2_targets[0]
:: current[0] == receiving1_0 && s_receiving1_0_2_ls == decrypt_0 ->
printf("process %d changed from %e to %e\n", 0, current[0], s_receiving1_0_2_targets);
current[0] = s_receiving1_0_2_targets;
:: current[2] == receiving1 && s_receiving1_2_ls == decrypt_2 ->
printf("process %d changed from %e to %e\n", 2, current[2], s_receiving1_2_targets);
current[2] = s_receiving1_2_targets;
:: current[0] == sending_0 && s_sending_0_2_ls == ack0 && current[2] == receiving0 && s_receiving0_2_ls == ack0 && GUARD0_2 ->
printf("process %d changed from %e to %e\n", 0, current[0], s_sending_0_2_targets);
current[0] = s_sending_0_2_targets;
printf("process %d changed from %e to %e\n", 2, current[2], s_receiving0_2_targets);
current[2] = s_receiving0_2_targets;
:: current[0] == sending_0 && s_sending_0_2_ls == ack0 && current[2] == after_dec && s_after_dec_2_ls == ack0 && GUARD0_2 ->
printf("process %d changed from %e to %e\n", 0, current[0], s_sending_0_2_targets);
current[0] = s_sending_0_2_targets;
printf("process %d changed from %e to %e\n", 2, current[2], s_after_dec_2_targets);
current[2] = s_after_dec_2_targets;
:: current[0] == receiving0_0 && s_receiving0_0_2_ls == ack1 && current[2] == sending && s_sending_2_ls == ack1 && GUARD0_2 ->
printf("process %d changed from %e to %e\n", 0, current[0], s_receiving0_0_2_targets);
current[0] = s_receiving0_0_2_targets;
printf("process %d changed from %e to %e\n", 2, current[2], s_sending_2_targets);
current[2] = s_sending_2_targets;
:: current[0] == after_dec_0 && s_after_dec_0_2_ls == ack1 && current[2] == sending && s_sending_2_ls == ack1 && GUARD0_2 ->
printf("process %d changed from %e to %e\n", 0, current[0], s_after_dec_0_2_targets);
current[0] = s_after_dec_0_2_targets;
printf("process %d changed from %e to %e\n", 2, current[2], s_sending_2_targets);
current[2] = s_sending_2_targets;
fi
:: !ol && current[3] == before_evolution_0 ->
printf("process %d changed from %e to %e\n", 3, current[3], evolved_0);
current[3] = evolved_0
:: !ol && dm == d1 && current[3] == evolved_0 && GUARD1_1 ->
printf("process %d changed from %e to %e\n", 3, current[3], evolved_0);
current[3] = evolved_0;
printf("process %d changed from %e to %e\n", 4, current[4], evolved);
current[4] = evolved;
s_before_comm_0_targets[0] = after_enc_0;
s_before_comm_0_targets[2] = receiving1_0;
s_after_enc_0_targets[2] = receiving1_0;
s_receiving0_0_1_targets = 0;
s_receiving1_0_1_targets = after_dec_0;
s_after_dec_0_1_targets = before_comm_0;
s_before_comm_1_targets[0] = after_enc;
s_before_comm_1_targets[1] = receiving1;
s_after_enc_1_targets[0] = sending;
s_after_enc_1_targets[1] = receiving1;
s_sending_1_targets = before_comm;
s_receiving0_1_targets = 0;
s_receiving1_1_targets = after_dec;
s_after_dec_1_targets = before_comm;
s_before_comm_0_ls[0] = encrypt_0;
s_before_comm_0_ls[2] = comm1;
s_after_enc_0_ls[2] = comm1;
s_receiving0_0_1_ls = 0;
s_receiving1_0_1_ls = decrypt_0;
s_after_dec_0_1_ls = ack1;
s_before_comm_1_ls[0] = encrypt_1;
s_before_comm_1_ls[1] = comm0;
s_after_enc_1_ls[0] = comm1;
s_after_enc_1_ls[1] = comm0;
s_sending_1_ls = ack1;
s_receiving0_1_ls = 0;
s_receiving1_1_ls = decrypt_1;
s_after_dec_1_ls = ack0
:: !ol && dm == d2 && current[3] == evolved_0 && GUARD1_2 ->
printf("process %d changed from %e to %e\n", 3, current[3], evolved_0);
current[3] = evolved_0;
printf("process %d changed from %e to %e\n", 5, current[5], evolved);
current[5] = evolved;
s_before_comm_0_targets[1] = after_enc_0;
s_before_comm_0_targets[3] = receiving1_0;
s_after_enc_0_targets[3] = receiving1_0;
s_receiving0_0_2_targets = 0;
s_receiving1_0_2_targets = after_dec_0;
s_after_dec_0_2_targets = before_comm_0;
s_before_comm_2_targets[0] = after_enc;
s_before_comm_2_targets[1] = receiving1;
s_after_enc_2_targets[0] = sending;
s_after_enc_2_targets[1] = receiving1;
s_sending_2_targets = before_comm;
s_receiving0_2_targets = 0;
s_receiving1_2_targets = after_dec;
s_after_dec_2_targets = before_comm;
s_before_comm_0_ls[1] = encrypt_0;
s_before_comm_0_ls[3] = comm1;
s_after_enc_0_ls[3] = comm1;
s_receiving0_0_2_ls = 0;
s_receiving1_0_2_ls = decrypt_0;
s_after_dec_0_2_ls = ack1;
s_before_comm_2_ls[0] = encrypt_2;
s_before_comm_2_ls[1] = comm0;
s_after_enc_2_ls[0] = comm1;
s_after_enc_2_ls[1] = comm0;
s_sending_2_ls = ack1;
s_receiving0_2_ls = 0;
s_receiving1_2_ls = decrypt_2;
s_after_dec_2_ls = ack0
:: else -> skip
fi
if
:: ol = 0
:: ol = 1
fi
if
:: ol && current[0] == before_comm_0 ->
if
:: dob = d1
:: dob = d2
fi
:: !ol ->
if
:: dm = d1
:: dm = d2
fi
:: else -> skip
fi
}
od
}

ltl prop1 { [] (current[4] == before_evolution -> !encrypted[0]) }

ltl prop2 { [] ((current[1] != before_comm) && (current[1] != after_enc) && (current[4] == evolved) -> [] (encrypted[0])) }

ltl prop3 { []<>(ol == 1) -> [] ((current[1] == sending || current[1] == receiving0 || current[1] == receiving1) -> <> (current[1] == before_comm)) }