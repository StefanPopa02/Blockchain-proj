import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react/cjs/react.development";
import { GlobalContext } from "../../context/MyContext";
import { getTaskStatesString } from "../../TaskStates";
import {
  financeTaskWeb3,
  getAllTasksWeb3,
  withdrawFundsWeb3,
} from "../../web3/Web3Client";
import "./Task.css";
import TaskActions from "./TaskActions/TaskActions";
import { Card, Divider } from "antd";
import { getCategoriesString } from "../../Categories";

export default function Task() {
  let { taskId } = useParams();
  const [funding, _setFunding] = useState(-1);
  const { tasks, setTasks } = useContext(GlobalContext);
  const [ ready, setReady ] = useState(false);
  const { setSpinner } = useContext(GlobalContext);
  
  useEffect(()=>{
    if(ready){
        setSpinner(false);
    }else{
        setSpinner(true);
    }
}, [ready])
  useEffect(() => {
    const getAllTasks = async () => {
      const allTasks = await getAllTasksWeb3();
      setTasks(allTasks);
      setReady(true);
    };
    getAllTasks();
  }, []);

  let myTask = tasks.filter((task) => task.taskIndex === taskId);
  if (myTask.length > 0) {
    myTask = myTask[0];
    if (funding === -1) _setFunding(myTask.totalFunding);
  }
  const setFunding = (amount) => {
    setSpinner(true);
    financeTaskWeb3(myTask.taskIndex, String(amount)).then((result) => {
      if (result.status) {
        window.location.reload();
      }
    });
  };

  const withdraw = (amount) => {
    setSpinner(true);
    withdrawFundsWeb3(myTask.taskIndex, String(amount)).then((result) => {
      if (result.status) {
        window.location.reload();
      }
    });
  };

  return (
    <div className="container">
    <Card style={{width: 800, padding: 10}}>
    <div className="taskContainer">
      <h2 style={{textAlign: 'center'}}>{`Task number: ${taskId}`}</h2>
      <h2>{`Task Status: ${getTaskStatesString(
        parseInt(myTask.taskStatus)
      )}`}</h2>
      <Divider orientation="left">
        <h2>Description</h2>
      </Divider>
      <p>{myTask.description}</p>
      <Divider />
      <h2>{`Category: ${getCategoriesString(parseInt(myTask.category))}`}</h2>
      <h2>{`Funding goal: ${parseInt(myTask.RF) + parseInt(myTask.RE)}`}</h2>
      <h2>{`Current funds: ${funding}`}</h2>
      <h2>{`Reward Freelancer: ${myTask.RF}`}</h2>
      <h2>{`Reward Evaluator: ${myTask.RE}`}</h2>
      <hr></hr>

      <TaskActions
        selectedTask={myTask}
        setFunding={setFunding}
        goalReached={
          parseInt(funding) === parseInt(myTask.RF) + parseInt(myTask.RE)
        }
        withdraw={withdraw}
      />
    </div>
    </Card>
    </div>
  );
}
