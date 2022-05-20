#define NO_OF_PROCESSES		4

mtype = {  goto_task, visual_following_task, change_manager, goal_manager, moving, following, trying_to_recover, working1, working2, recovery_failed, failure, before_change, after_change, move, follow, fail, recovered, change_components, change}

mtype current[NO_OF_PROCESSES];

init {
  mtype moving_targets[2], failure_targets, following_targets, working1_targets, trying_to_recover_targets[2], recovery_failed_targets, working2_targets, before_change_targets, after_change_targets, moving_labels[2], failure_labels, following_labels, working1_labels, trying_to_recover_labels[2], recovery_failed_labels, working2_labels, before_change_labels, after_change_labels;
  atomic {
    moving_targets[0] = moving;
    moving_targets[1] = failure;
    failure_targets = 0;
    following_targets = following;
    working1_targets = trying_to_recover;
    trying_to_recover_targets[0] = working1;
    trying_to_recover_targets[1] = recovery_failed;
    recovery_failed_targets = 0;
    working2_targets = 0;
    before_change_targets = after_change;
    after_change_targets = 0;
    moving_labels[0] = move;
    moving_labels[1] = fail;
    failure_labels = 0;
    following_labels = follow;
    working1_labels = 0;
    trying_to_recover_labels[0] = recovered;
    trying_to_recover_labels[1] = change_components;
    recovery_failed_labels = 0;
    working2_labels = 0;
    before_change_labels = change;
    after_change_labels = 0;
    current[0] = moving;
    current[1] = 0;
    current[2] = working1;
    current[3] = before_change;
  }
  do
    :: atomic {
      if
	:: current[0] == moving ->
	   if
	     :: printf("process %d changed from %e to %e\n", 0, current[0], moving_targets[0]);
		current[0] = moving_targets[0]
	     :: printf("process %d changed from %e to %e\n", 0, current[0], moving_targets[1]);
		current[0] = moving_targets[1]
	   fi
	:: current[1] == following ->
	   printf("process %d changed from %e to %e\n", 1, current[1], following_targets);
	   current[1] = following_targets
	:: current[2] == working1 && current[0] == failure ->
	   printf("process %d changed from %e to %e\n", 2, current[2], working1_targets);
	   current[2] = working1_targets
	:: current[2] == trying_to_recover ->
	   if
	     :: printf("process %d changed from %e to %e\n", 2, current[2], trying_to_recover_targets[0])
		current[2] = trying_to_recover_targets[0]
	     :: printf("process %d changed from %e to %e\n", 2, current[2], trying_to_recover_targets[1])
		current[2] = trying_to_recover_targets[1]
	   fi
	:: current[2] == recovery_failed && recovery_failed_labels == change_components && (current[0] == moving || current[0] == failure) ->
	   current[0] = 0;
	   printf("process %d modified from %e to %e\n", 0, current[0], 0);
	   current[1] = following;
	   printf("process %d modified from %e to %e\n", 1, current[1], following);
	   current[2] = working2;
	   printf("process %d changed from %e to %e\n", 2, current[2], working2);
	:: current[3] == before_change && current[2] == recovery_failed ->
	   recovery_failed_targets = working2;
	   recovery_failed_labels = change_components
	   printf("process %d changed from %e to %e\n", 3, current[3], before_change_targets);
	   current[3] = before_change_targets
      fi
    }
  od
}

ltl prop1 { [] ((current[2] == recovery_failed) -> <> ((current[3] == after_change) && [] (current[1] == following))) }