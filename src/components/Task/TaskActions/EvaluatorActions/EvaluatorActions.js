import React, { useContext, useState } from "react";
import { Button } from "antd";
import { useEffect } from "react/cjs/react.development";
import TASK_STATUS from "../../../../TaskStates";
import { evaluateTaskWeb3 } from "../../../../web3/Web3Client";
import { GlobalContext } from "../../../../context/MyContext";

export default function EvaluatorActions({selectedTask}) {

  const { setSpinner } = useContext(GlobalContext);
  useEffect(()=>{

  }, [])
  const onAccept = () => {
    setSpinner(true);
    evaluateTaskWeb3(parseInt(selectedTask.taskIndex), 1).then((result)=>{
      if(result.status){
        window.location.reload();
      }
    })
  }

  const onDecline = () => {
    setSpinner(true);
    evaluateTaskWeb3(parseInt(selectedTask.taskIndex), 0).then((result)=>{
      if(result.status){
        window.location.reload();
      }
    })
  }

  return (
    <div>
      <h1 style={{textAlign: 'center'}}>Evaluator Actions</h1>
      {parseInt(selectedTask.taskStatus) !== TASK_STATUS.JUDGING &&
        parseInt(selectedTask.taskStatus) !== TASK_STATUS.DONE &&
        <h3>Task Doesn't Need Your Judging Yet!</h3>
      }
      {parseInt(selectedTask.taskStatus) === TASK_STATUS.JUDGING &&
          <Button type="primary" onClick={() => onAccept()}>
            Accept
          </Button>
      }
      {parseInt(selectedTask.taskStatus) === TASK_STATUS.JUDGING &&
          <Button type="primary" danger onClick={() => onDecline()}>
            Decline
          </Button>
      }
    </div>
  );
}
