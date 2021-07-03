bool sent, encrypted, evolved;

init {
if
:: evolved = 0;
if
:: goto before_comm0
:: goto before_comm1
fi
:: evolved = 1;
if
:: goto before_comm0_0
:: goto before_comm1_0
fi
before_comm0:sent = 0;
if
:: printf("process %d changed from before_comm to sending\n", 0);
goto sending_to0
:: printf("process %d changed from before_comm to receiving\n", 0);
goto receiving_from0
:: printf("process %d changed from before_evolution to evolved\n", 2);
goto before_comm0_0
fi
sending_to0:sent = 1;
if
:: printf("process %d changed from sending to before_comm\n", 0);
goto before_comm0
:: printf("process %d changed from sending to before_comm\n", 0);
goto before_comm1
fi
receiving_from0:sent = 1;
if
:: printf("process %d changed from receiving to before_comm\n", 0);
goto before_comm0
:: printf("process %d changed from receiving to before_comm\n", 0);
goto before_comm1
fi
after_enc00:if
:: printf("process %d changed from after_enc0 to sending\n", 0);
goto sending_to0
:: printf("process %d changed from after_enc0 to receiving\n", 0);
goto receiving_from0
:: printf("process %d changed from after_enc0 to receiving\n", 1);
goto receiving_from1
fi
after_enc0:printf("process %d changed from after_enc to receiving\n", 0);
goto receiving_from0;
/*
after_dec0:if
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm0
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm1
fi
after_dec00:if
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm0
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm1
fi
*/
before_comm1:sent = 0;
if
:: printf("process %d changed from before_comm to sending\n", 1);
goto sending_to1
:: printf("process %d changed from before_comm to receiving\n", 1);
goto receiving_from1
:: printf("process %d changed from before_evolution to evolved\n", 3);
goto before_comm1_1
fi
sending_to1:if
:: printf("process %d changed from sending to before_comm\n", 1);
goto before_comm0
:: printf("process %d changed from sending to before_comm\n", 1);
goto before_comm1
fi
receiving_from1:if
:: printf("process %d changed from receiving to before_comm\n", 1);
goto before_comm0
:: printf("process %d changed from receiving to before_comm\n", 1);
goto before_comm1
fi
after_enc01:if
:: printf("process %d changed from after_enc0 to sending\n", 1);
goto sending_to1
:: printf("process %d changed from after_enc0 to receiving\n", 0);
goto receiving_from0
:: printf("process %d changed from after_enc0 to receiving\n", 1);
goto receiving_from1
fi
after_enc1:printf("process %d changed from after_enc to receiving\n", 1);
goto receiving_from1;
after_dec1:if
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm0
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm1
fi
/*
after_dec01:if
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm0
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm1
fi
*/
before_comm0_0:sent = 0;
evolved = 1;
if
:: printf("process %d changed from before_comm to after_enc\n", 0);
goto after_enc0_0
:: printf("process %d changed from before_comm to after_enc0\n", 0);
goto after_enc00_0
fi
sending_to0_0:encrypted = 1;
sent = 1;
printf("process %d changed from sending to after_dec\n", 0);
goto after_dec0_0
receiving_from0_0:encrypted = 1;
sent = 1;
if
:: printf("process %d changed from receiving to after_dec0$\n", 0);
goto after_dec00_0
fi
after_enc00_0:if
:: printf("process %d changed from after_enc0 to sending\n", 0);
goto sending_to0_0
:: printf("process %d changed from after_enc0 to receiving\n", 0);
goto receiving_from0_0
:: printf("process %d changed from after_enc0 to receiving\n", 1);
goto receiving_from1_0
fi
after_enc0_0:printf("process %d changed from after_enc to receiving\n", 0);
goto receiving_from0_0;
/*
after_dec0_0:if
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm0_0
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm1_0
fi
after_dec00_0:if
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm0_0
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm1_0
fi
*/
before_comm1_0:sent = 0;
evolved = 1;
if
:: printf("process %d changed from before_comm to sending\n", 1);
goto sending_to1_0
:: printf("process %d changed from before_comm to receiving\n", 1);
goto receiving_from1_0
:: printf("process %d changed from before_evolution to evolved\n", 3);
goto before_comm1_0_1
fi
sending_to1_0:if
:: printf("process %d changed from sending to before_comm\n", 1);
goto before_comm0_0
:: printf("process %d changed from sending to before_comm\n", 1);
goto before_comm1_0
fi
receiving_from1_0:if
:: printf("process %d changed from receiving to before_comm\n", 1);
goto before_comm0_0
:: printf("process %d changed from receiving to before_comm\n", 1);
goto before_comm1_0
fi
after_enc01_0:if
:: printf("process %d changed from after_enc0 to sending\n", 1);
goto sending_to1_0
:: printf("process %d changed from after_enc0 to receiving\n", 0);
goto receiving_from0_0
:: printf("process %d changed from after_enc0 to receiving\n", 1);
goto receiving_from1_0
fi
after_enc1_0:printf("process %d changed from after_enc to receiving\n", 1);
goto receiving_from1_0;
after_dec1_0:if
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm0_0
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm1_0
fi
/*
after_dec01_0:if
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm0_0
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm1_0
fi
*/
before_comm0_1:sent = 0;
if
:: printf("process %d changed from before_comm to sending\n", 0);
goto sending_to0_1
:: printf("process %d changed from before_comm to receiving\n", 0);
goto receiving_from0_1
:: printf("process %d changed from before_evolution to evolved\n", 2);
goto before_comm0_0_1
fi
sending_to0_1:sent = 1;
if
:: printf("process %d changed from sending to before_comm\n", 0);
goto before_comm0_1
:: printf("process %d changed from sending to before_comm\n", 0);
goto before_comm1_1
fi
receiving_from0_1:sent = 1;
if
:: printf("process %d changed from receiving to before_comm\n", 0);
goto before_comm0_1
:: printf("process %d changed from receiving to before_comm\n", 0);
goto before_comm1_1
fi
after_enc00_1:if
:: printf("process %d changed from after_enc0 to sending\n", 0);
goto sending_to0_1
:: printf("process %d changed from after_enc0 to receiving\n", 0);
goto receiving_from0_1
:: printf("process %d changed from after_enc0 to receiving\n", 1);
goto receiving_from1_1
fi
after_enc0_1:printf("process %d changed from after_enc to receiving\n", 0);
goto receiving_from0_1;
/*
after_dec0_1:if
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm0_1
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm1_1
fi
after_dec00_1:if
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm0_1
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm1_1
fi
*/
before_comm1_1:sent = 0;
if
:: printf("process %d changed from before_comm to after_enc\n", 1);
goto after_enc1_1
:: printf("process %d changed from before_comm to after_enc0\n", 1);
goto after_enc01_1
fi
sending_to1_1:printf("process %d changed from sending to after_dec\n", 1);
goto after_dec1_1
receiving_from1_1:if
:: printf("process %d changed from receiving to after_dec0$\n", 1);
goto after_dec01_1
fi
after_enc01_1:if
:: printf("process %d changed from after_enc0 to sending\n", 1);
goto sending_to1_1
:: printf("process %d changed from after_enc0 to receiving\n", 0);
goto receiving_from0_1
:: printf("process %d changed from after_enc0 to receiving\n", 1);
goto receiving_from1_1
fi
after_enc1_1:printf("process %d changed from after_enc to receiving\n", 1);
goto receiving_from1_1;
after_dec1_1:if
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm0_1
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm1_1
fi
/*
after_dec01_1:if
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm0_1
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm1_1
fi
*/
before_comm0_0_1:sent = 0;
evolved = 1;
if
:: printf("process %d changed from before_comm to after_enc\n", 0);
goto after_enc0_0_1
:: printf("process %d changed from before_comm to after_enc0\n", 0);
goto after_enc00_0_1
fi
sending_to0_0_1:encrypted = 1;
sent = 1;
printf("process %d changed from sending to after_dec\n", 0);
goto after_dec0_0_1
receiving_from0_0_1:encrypted = 1;
sent = 1;
if
:: printf("process %d changed from receiving to after_dec0$\n", 0);
goto after_dec00_0_1
fi
after_enc00_0_1:if
:: printf("process %d changed from after_enc0 to sending\n", 0);
goto sending_to0_0_1
:: printf("process %d changed from after_enc0 to receiving\n", 0);
goto receiving_from0_0_1
:: printf("process %d changed from after_enc0 to receiving\n", 1);
goto receiving_from1_0_1
fi
after_enc0_0_1:printf("process %d changed from after_enc to receiving\n", 0);
goto receiving_from0_0_1;
/*
after_dec0_0_1:if
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm0_0_1
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm1_0_1
fi
after_dec00_0_1:if
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm0_0_1
:: printf("process %d changed from after_dec to before_comm\n", 0);
goto before_comm1_0_1
fi
*/
before_comm1_0_1:sent = 0;
evolved = 1;
if
:: printf("process %d changed from before_comm to after_enc\n", 1);
goto after_enc1_0_1
:: printf("process %d changed from before_comm to after_enc0\n", 1);
goto after_enc01_0_1
fi
sending_to1_0_1:printf("process %d changed from sending to after_dec\n", 1);
goto after_dec1_0_1
receiving_from1_0_1:if
:: printf("process %d changed from receiving to after_dec0$\n", 1);
goto after_dec01_0_1
fi
after_enc01_0_1:if
:: printf("process %d changed from after_enc0 to sending\n", 1);
goto sending_to1_0_1
:: printf("process %d changed from after_enc0 to receiving\n", 0);
goto receiving_from0_0_1
:: printf("process %d changed from after_enc0 to receiving\n", 1);
goto receiving_from1_0_1
fi
after_enc1_0_1:printf("process %d changed from after_enc to receiving\n", 1);
goto receiving_from1_0_1;
after_dec1_0_1:if
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm0_0_1
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm1_0_1
fi
/*
after_dec01_0_1:if
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm0_0_1
:: printf("process %d changed from after_dec to before_comm\n", 1);
goto before_comm1_0_1
fi
*/
after_dec0:printf("process %d changed from after_dec to after_dec\n", 0);
goto after_dec0;
after_dec00:printf("process %d changed from after_dec0 to after_dec0\n", 0);
goto after_dec00;
after_dec0_0:printf("process %d changed from after_dec to after_dec\n", 0);
goto after_dec0_0;
after_dec00_0:printf("process %d changed from after_dec0 to after_dec0\n", 0);
goto after_dec00_0;
after_dec0_1:printf("process %d changed from after_dec to after_dec\n", 0);
goto after_dec0_1;
after_dec00_1:printf("process %d changed from after_dec0 to after_dec0\n", 0);
goto after_dec00_1;
after_dec0_0_1:printf("process %d changed from after_dec to after_dec\n", 0);
goto after_dec0_0_1;
after_dec00_0_1:printf("process %d changed from after_dec0 to after_dec0\n", 0);
goto after_dec00_0_1;
after_dec01_1:printf("process %d changed from after_dec to after_dec\n", 0);
goto after_dec01_1
after_dec01_0_1:printf("process %d changed from after_dec to after_dec\n", 0);
goto after_dec01_0_1
fi
}

ltl prop1 { [] (!evolved -> !encrypted) }

ltl prop2 { [] (sent && evolved -> [] encrypted) }

ltl prop3 { [] (sent -> <> !sent) }