import React from "react";
import Manager from "./Manager/Manager";
import Freelancer from "./Freelancer/Freelancer";
import Finantator from "./Finantator/Finantator";
import Evaluator from "./Evaluator/Evaluator";
import { useParams } from "react-router-dom";
import ACTOR_TYPES from "../../ActorTypes";

export default function Dashboard() {
  let { actorType } = useParams();
  
  switch (parseInt(actorType)) {
    case ACTOR_TYPES.MANAGER:
      return <Manager />;
    case ACTOR_TYPES.FREELANCER:
      return <Freelancer />;
    case ACTOR_TYPES.FINANTATOR:
      return <Finantator />;
    case ACTOR_TYPES.EVALUATOR:
      return <Evaluator />;
    default:
      return <h2>Dashboard</h2>;
  }
}
