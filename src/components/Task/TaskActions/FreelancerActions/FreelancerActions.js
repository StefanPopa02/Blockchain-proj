import React, { useContext, useState } from "react";
import { Button } from "antd";
import { useEffect } from "react/cjs/react.development";
import { applyForTaskWeb3, checkEmptyAddr, getApplyingFreelancersEventForTasksWeb3, getApplyingFreelancersForTaskWeb3, getSelectedAccWeb3, nominateTaskReadyWeb3 } from "../../../../web3/Web3Client";
import TASK_STATUS from "../../../../TaskStates";
import { GlobalContext } from "../../../../context/MyContext";

export default function FreelancerActions({selectedTask}) {
  const [selectedAcc, setSelectedAcc] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const { setSpinner } = useContext(GlobalContext);
  useEffect(() => {
    const getApplyFreelancersFromEvent = async() => {
      const appFreelancersForTask = await getApplyingFreelancersForTaskWeb3(parseInt(selectedTask.taskIndex));
      setAlreadyApplied(appFreelancersForTask.some((addr) => addr.toUpperCase() === selectedAcc.toUpperCase()));
    }
    getApplyFreelancersFromEvent();

    const getSelectedAcc = async() => {
      const selectedAccWeb3 = await getSelectedAccWeb3();
      setSelectedAcc(selectedAccWeb3);
    }
    getSelectedAcc();
    
  }, [selectedTask])

  const onSubmitWork = () => {
    setSpinner(true);
    nominateTaskReadyWeb3(parseInt(selectedTask.taskIndex)).then((result)=>{
      if(result.status){
        window.location.reload();
      }
    })
  }

  const onApplyToTask = () => {
    setSpinner(true);
    applyForTaskWeb3(parseInt(selectedTask.taskIndex), selectedTask.RE).then((result)=>{
      if(result.status){
        window.location.reload();
      }
    })
  }

  return (
    <div>
      <h1 style={{textAlign: 'center'}}>FreelancerActions</h1>
      {parseInt(selectedTask.taskStatus) !== TASK_STATUS.DECLINED &&
        <div>
        {
          checkEmptyAddr(selectedTask.evaluatorAddr) ? 
          <h3>Task doesn't have an evaluator yet!</h3>
          : !alreadyApplied ?
          parseInt(selectedTask.taskStatus) === TASK_STATUS.CERTIFIED &&
            <Button type="primary" onClick={() => onApplyToTask()}>
              Apply for task
            </Button>
            :
            checkEmptyAddr(selectedTask.freelancerAddr) ?
            <h3>You already Applied for This TASK! Wait for manager to pick someone!</h3>
            :
           <h3></h3>
        }

        {
          parseInt(selectedTask.taskStatus) === TASK_STATUS.PROGRESS &&
          <Button type="primary" onClick={() => onSubmitWork()}>
            Submit work
          </Button>
        }
        </div>}
    </div>
  );
}
