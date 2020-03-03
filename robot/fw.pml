typedef labels {
  mtype elements[MAX_NO_OF_LABELS]
}

typedef state {
  mtype targets[MAX_NO_OF_TRANSITIONS], ls[MAX_NO_OF_TRANSITIONS]
}

mtype current[NO_OF_PROCESSES], last_label;

init {
  int i = 0;
  byte sid;
  bool triggered[NO_OF_PROCESSES], b;
  mtype index0, s, l, procid0, next[NO_OF_PROCESSES],
  procids[NO_OF_PROCESSES], indices[MAX_NO_OF_TRANSITIONS];
  state ss[NO_OF_STATES];
  labels ls[NO_OF_PROCESSES];
  first();
  do
    :: atomic {
      choose_process();
    }
       do
	 :: atomic {
	   s = current[I];
	   to_sid();
	   i = i + (I - PROCID) * MAX_INDEX * MAX_INDEX * MAX_INDEX * MAX_INDEX;
	 }
	    if
	      :: ss[sid].targets[0] == 0 -> b = 1
	      :: atomic {
		else ->
		triggered[PROCID] = 0;
		choose_target();
		i = (ss[sid].targets[I] == 0 -> i - I : i);
		index0 = indices[I];
		l = 0;
	      }
		 do
		   :: do
			:: atomic {
			  l = ss[sid].ls[I];
			  evaluate();
			  if
			    :: b ->
			       triggered[PROCID] = 1
			       next[PROCID] = ss[sid].targets[I];
			       break
			    :: else -> 
			       i = (ss[sid].targets[I + 1] == 0 -> i - I : i + 1);
			       if
				 :: indices[I] == index0 -> break
				 :: else -> skip
			       fi
			  fi
			}
		      od
		      atomic {
			if
			  :: triggered[PROCID] -> skip
			  :: else ->
			     b = 1;
			     break
			fi
			i = i - J * MAX_INDEX;
			b = 0;
		      }
		      do
			:: J == NO_OF_PROCESSES -> break
			:: J == PROCID -> JPP
			:: atomic {
			  else ->
			  triggered[J] = 0;
			  i = i - K * MAX_INDEX * MAX_INDEX;
			}
			   do
			     :: ls[J].elements[K] == 0 -> break
			     :: atomic {
			       ls[J].elements[K] == l ->
			       s = current[J];
			       to_sid();
			       i = i - L * MAX_INDEX * MAX_INDEX * MAX_INDEX;
			     }
				do
				  :: ss[sid].ls[L] == 0 -> break
				  :: atomic {
				    ss[sid].ls[L] == l ->
				    evaluate();
				    if
				      :: b ->
					 if
					   :: triggered[J] -> break
					   :: triggered[J] = 1
					 fi
					 next[J] = ss[sid].targets[L];
					 LPP
				      :: else -> LPP
				    fi
				  }
				  :: else -> LPP
				od
				break
			     :: else -> KPP;
			   od
			   if
			     :: (ls[J].elements[K] == 0) || triggered[J] -> JPP
			     :: else -> break
			   fi
		      od
		      if
			:: J == NO_OF_PROCESSES ->
progress:		   eff();
			   i = i - J * MAX_INDEX;
			   do
			     :: J == NO_OF_PROCESSES -> break
			     :: atomic {
			       else ->
			       if
				 :: triggered[J] ->
				    printf("process %d changed from %e to %e\n", J, current[J], next[J]);
				    current[J] = next[J];
				    last_label = l
				 :: else -> skip
			       fi
			       JPP
			     }
			   od
			   b = 0;
			   break
			:: atomic {
			  else ->
			  s = current[PROCID];
			  to_sid();
			  i = (ss[sid].targets[I + 1] == 0 -> i - I : i + 1);
			  if
			    :: indices[I] == index0 ->
			       b = 1;
			       break
			    :: else -> skip
			  fi
			}
		      fi
		 od
		 i = i - I + PROCID
	    fi
	    atomic {
	      check_dl()
	    }
       od
  od
}