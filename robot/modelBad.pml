#define	I	i % MAX_INDEX
#define J	(i / MAX_INDEX) % MAX_INDEX
#define K	((i / MAX_INDEX) / MAX_INDEX) % MAX_INDEX
#define L	(((i / MAX_INDEX) / MAX_INDEX) / MAX_INDEX) % MAX_INDEX
#define PROCID	((((i / MAX_INDEX) / MAX_INDEX) / MAX_INDEX) / MAX_INDEX) % MAX_INDEX
#define JPP	i = i + MAX_INDEX
#define KPP	i = i + MAX_INDEX * MAX_INDEX
#define LPP	i = i + MAX_INDEX * MAX_INDEX * MAX_INDEX
#define MAX_NO_OF_TRANSITIONS	4
#define NO_OF_STATES		12
#define NO_OF_PROCESSES		5
#define MAX_NO_OF_LABELS	9
#define MAX_INDEX		9

mtype = {  goto_task, visual_following_task, obstacle_avoider, change_manager, goal_manager, moving, following, working, obstacle_detected, failure, not_at_target, at_target, at_obstacle, changing, before_change, after_change, approaching_to_target, move, follow, detect_obstacle, avoid_obstacle, fail, at_target_l, take_photo, at_obstacle_l, change_start, change_components, change, t_0, t_1, t_2, t_3 }

inline choose_process() {
  if
    :: i = i - I + 3;
       procid0 = change_manager
    :: i = i - I + 4;
       procid0 = goal_manager
  fi
}

inline choose_target() {
  i = i - I;
  do
    :: ss[sid].targets[I + 1] != 0 -> i++
    :: break
  od
}

inline check_dl() {
  if
    :: b ->
       do
	 :: i = ((I + 1 == NO_OF_PROCESSES) -> 0 : i + 1);
	    if
	      :: (procids[I] == procid0) -> assert false
	      :: else -> break
					       fi
       od
    :: else -> break
  fi
}

inline evaluate() {
  b = (!(l == change_start) || ((current[3] == at_obstacle) && (current[2] == failure))) && (!(l == change) || (current[3] == changing));
}

inline eff() {
  atomic {
    if
      :: l == change_components ->
	 ss[0].targets[0] = 0;
	 ss[0].ls[0] = 0;
	 ss[1].targets[0] = following;
	 ss[1].ls[0] = follow;
      :: l == change ->
	 ss[5].ls[0] = follow;
	 ss[11].targets[2] = 0;
	 ss[11].ls[0] = follow;
      :: else -> skip
    fi
  }
}

inline to_sid() {
  if
    :: s == moving -> sid = 0
    :: s == following -> sid = 1
    :: s == working -> sid = 2
    :: s == obstacle_detected -> sid = 3
    :: s == failure -> sid = 4
    :: s == not_at_target -> sid = 5
    :: s == at_target -> sid = 6
    :: s == at_obstacle -> sid = 7
    :: s == changing -> sid = 8
    :: s == before_change -> sid = 9
    :: s == after_change -> sid = 10
    :: s == approaching_to_target -> sid = 11
  fi
}

inline first() {
  indices[0] = t_0;
  indices[1] = t_1;
  indices[2] = t_2;
  indices[3] = t_3;
  procids[0] = goto_task;
  procids[1] = visual_following_task;
  procids[2] = obstacle_avoider;
  procids[3] = change_manager;
  procids[4] = goal_manager;
  ls[0].elements[0] = move;
  ls[1].elements[0] = follow;
  ls[2].elements[0] = detect_obstacle;
  ls[2].elements[1] = avoid_obstacle;
  ls[2].elements[2] = fail;
  ls[3].elements[0] = move;
  ls[3].elements[1] = at_target_l;
  ls[3].elements[2] = take_photo;
  ls[3].elements[3] = at_obstacle_l;
  ls[3].elements[4] = avoid_obstacle;
  ls[3].elements[5] = change_start;
  ls[3].elements[6] = change_components;
  ls[3].elements[7] = follow;
  ls[4].elements[0] = change;
  ss[0].targets[0] = moving;
  ss[0].ls[0] = move;
  ss[2].targets[0] = obstacle_detected;
  ss[2].ls[0] = detect_obstacle;
  ss[2].targets[1] = failure;
  ss[2].ls[1] = fail;
  ss[3].targets[0] = working;
  ss[3].ls[0] = avoid_obstacle;
  ss[5].targets[0] = approaching_to_target;
  ss[5].ls[0] = move;
  ss[6].targets[0] = not_at_target;
  ss[6].ls[0] = take_photo;
  ss[7].targets[0] = not_at_target;
  ss[7].targets[1] = changing;
  ss[7].ls[0] = avoid_obstacle;
  ss[7].ls[1] = change_start;
  ss[8].targets[0] = not_at_target;
  ss[8].ls[0] = change_components;
  ss[9].targets[0] = after_change;
  ss[9].ls[0] = change;
  ss[11].targets[0] = approaching_to_target;
  ss[11].targets[1] = at_target;
  ss[11].targets[2] = at_obstacle;
  ss[11].ls[0] = move;
  ss[11].ls[1] = at_target_l;
  ss[11].ls[2] = at_obstacle_l;
  current[0] = moving;
  current[1] = following;
  current[2] = working;
  current[3] = not_at_target;
  current[4] = before_change;
}

#include "fw.pml"