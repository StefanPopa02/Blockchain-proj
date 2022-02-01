import React from "react";
import EvaluatorActions from "./EvaluatorActions/EvaluatorActions";
import FinantatorActions from "./FinantatorActions/FinantatorActions";
import FreelancerActions from "./FreelancerActions/FreelancerActions";
import ManagerActions from "./ManagerActions/ManagerActions";
import ACTOR_TYPES from "../../../ActorTypes";
import { useParams } from "react-router-dom";

export default function TaskActions({
  setFunding,
  goalReached,
  withdraw,
  selectedTask,
  ...rest
}) {
  let { actorType } = useParams();
  switch (parseInt(actorType)) {
    case ACTOR_TYPES.MANAGER:
      return <ManagerActions selectedTask = { selectedTask }/>;
    case ACTOR_TYPES.FREELANCER:
      return <FreelancerActions selectedTask = { selectedTask }/>;
    case ACTOR_TYPES.FINANTATOR:
      return (
        <FinantatorActions
          setFunding={setFunding}
          goalReached={goalReached}
          withdraw={withdraw}
          selectedTask = { selectedTask }
        />
      );
    case ACTOR_TYPES.EVALUATOR:
      return <EvaluatorActions selectedTask = { selectedTask }/>;
    default:
      return <h2>Dashboard</h2>;
  }
}
