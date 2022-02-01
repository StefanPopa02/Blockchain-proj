import React from "react";
import "./ManagerActions.css";
import { Table, Space, Button } from "antd";
import { useEffect, useState } from "react/cjs/react.development";
import { checkEmptyAddr, chooseEvaluatorForTaskWeb3, chooseFreelancerForTaskWeb3, getAllEvaluatorsByAddrWeb3, getAllFreelancersByAddrWeb3, getApplyingFreelancersForTaskWeb3, getCreatedEvaluatorsFromEventsWeb3, getEvaluatorByAddr, getFreelancerByAddr, getMarketContract, reviewTaskWeb3 } from "../../../../web3/Web3Client";
import CATEGORIES, { getCategoriesString } from "../../../../Categories";
import TASK_STATUS from "../../../../TaskStates";

export default function ManagerActions({selectedTask}) {
  const [evaluatorsToDisplay, setEvaluatorsToDisplay] = useState([]);
  const [freelancersToDisplay, setFreelancersToDisplay] = useState([]);
  const [selectedEv, setSelectedEv] = useState({});
  const [selectedFr, setSelectedFr] = useState({});
  useEffect(() => {
    const getAllEvaluators = async () => {
      const evaluators = await getCreatedEvaluatorsFromEventsWeb3();
      const addresses = [];
      evaluators.forEach((ev) =>{
        addresses.push(ev.evaluatorAddr);
      })
      const evaluatorsToDisplayTmp = await getAllEvaluatorsByAddrWeb3(addresses);
      setEvaluatorsToDisplay(evaluatorsToDisplayTmp.filter(ev => ev.category === selectedTask.category))
    }

    const getSelectedEv = async() =>{
      let evaluatorTmp = await getEvaluatorByAddr(selectedTask.evaluatorAddr);
      setSelectedEv(evaluatorTmp);
    }

    if(selectedTask && !checkEmptyAddr(selectedTask.evaluatorAddr)){
      getSelectedEv();
    }else{
      getAllEvaluators();
    }

    const getAllFreelancers = async () => {
      const applyingFreelancers = await getApplyingFreelancersForTaskWeb3(selectedTask.taskIndex)
      const freelancersToDisplayTmp = await getAllFreelancersByAddrWeb3(applyingFreelancers);
      setFreelancersToDisplay(freelancersToDisplayTmp);
    }

    const getSelectedFr = async() =>{
      let freelancerTmp = await getFreelancerByAddr(selectedTask.freelancerAddr);
      setSelectedFr(freelancerTmp);
    }

    if(selectedTask && !checkEmptyAddr(selectedTask.freelancerAddr)){
      getSelectedFr();
      getAllFreelancers();
    }else{
      getAllFreelancers();
    }
  },[selectedTask, selectedEv.nume, selectedFr.nume])

  const setEvaluatorForTask = (evaluatorObj) =>{
    const evAddr = evaluatorObj.evaluatorAddr;
    const taskIndex = selectedTask.taskIndex;
    chooseEvaluatorForTaskWeb3(evAddr, taskIndex).then((result)=>{
      console.log("result ev for web3", result)
      if(result.status){
        window.location.reload();
      }
    })
  }

  const setFreelancerForTask = (freelancerObj) =>{
    console.log("selected freelancer", freelancerObj);
    const freelancerIndex = freelancerObj.freelancerIndex;
    const taskIndex = selectedTask.taskIndex;
    console.log("freelancer index", freelancerIndex);
    console.log("task index", taskIndex);
    chooseFreelancerForTaskWeb3(freelancerIndex, taskIndex).then((result)=>{
      if(result.status){
        window.location.reload();
      }
    })
  }

  const columnsFreelancers = [
    {
      title: "Number",
      dataIndex: "freelancerIndex",
      key: "freelancerIndex",
    },
    {
      title: "Name",
      dataIndex: "nume",
      key: "nume",
    },
    {
      title: "Reputation",
      dataIndex: "reputatie",
      key: "reputatie",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            color="primary"
            onClick={() => {
              setFreelancerForTask(record);
            }}
          >
            Select
          </Button>
        </Space>
      ),
    },
  ];

  const columnsEvaluators = [
    {
      title: "Name",
      dataIndex: "nume",
      key: "nume",
    },
    {
      title: "Reputation",
      dataIndex: "reputatie",
      key: "reputatie",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            color="primary"
            onClick={() => {
              setEvaluatorForTask(record);
            }}
          >
            Select
          </Button>
        </Space>
      ),
    },
  ];

  const dataSource = [
    {
      key: "1",
      name: "George",
      reputatie: 5,
      category: "Web",
      addrress: '0x12345'
    },
    {
      key: "2",
      name: "Ionut",
      reputatie: 6,
      category: "Web",
    },
  ];

  const onTaskDone = () =>{
    const taskIndex = selectedTask.taskIndex;
    reviewTaskWeb3(parseInt(taskIndex), 1).then((result) => {
      if(result.status){
        window.location.reload();
      }
    })
  }

  const onTaskJudge = () => {
    const taskIndex = selectedTask.taskIndex;
    reviewTaskWeb3(parseInt(taskIndex), 0).then((result) => {
      if(result.status){
        window.location.reload();
      }
    })
  }

  return (
    <div className="managerActionsContainer">
      <h1 style={{textAlign: 'center'}}>Manager actions</h1>
      {
        parseInt(selectedTask.taskStatus) === TASK_STATUS.READY &&
        <div>
          <h2>Task is ready! Please make a decision regarding the solution:</h2>
          <Button type="primary" onClick={() => onTaskDone()}>Done</Button>
          <Button type="primary" danger onClick={() => onTaskJudge()}>Judge</Button>
        </div>
      }
      {!checkEmptyAddr(selectedTask.evaluatorAddr)  ? 
      (
        <h3>You have selected evaluator{": " + selectedEv.nume}</h3>
      ): (
        parseInt(selectedTask.taskStatus) === TASK_STATUS.FINANCED &&
        <div>
          <h2>Available evaluators</h2>
          <Table dataSource={evaluatorsToDisplay} columns={columnsEvaluators} />
        </div>
      )
      }

      {!checkEmptyAddr(selectedTask.freelancerAddr) ? (
        <h3>You have selected freelancer{": " + selectedFr.nume}.</h3>
      ) : ( 
        !checkEmptyAddr(selectedTask.evaluatorAddr) &&
        <div>
          <h2>Applying freelancers</h2>
          <Table dataSource={freelancersToDisplay} columns={columnsFreelancers} />
        </div>
      )}
    </div>
  );
}
