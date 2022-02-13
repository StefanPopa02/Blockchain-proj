import React, { useContext } from "react";
import { GlobalContext } from "../../../context/MyContext";
import { useEffect, useState } from "react/cjs/react.development";
import { getAllTasksWeb3, getSelectedAccWeb3 } from "../../../web3/Web3Client";
import { getCategoriesString } from "../../../Categories";
import { Table, Tag, Space } from "antd";
import { Link } from "react-router-dom";
import TASK_STATUS, { getTaskStatesString } from "../../../TaskStates";
import "./Freelancer.css";

export default function Freelancer() {
  const columns = [
    {
      title: "Number",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "State",
      key: "states",
      dataIndex: "states",
      render: (states) => (
        <>
          {states.map((state) => {
            let color = "geekblue";
            switch (parseInt(state)) {
              case TASK_STATUS.CREATED:
                color = "yellow";
                break;
              case TASK_STATUS.PROGRESS:
                color = "pink";
                break;
              case TASK_STATUS.DONE:
                color = "green";
                break;

              default:
                break;
            }
            return (
              <Tag color={color} key={state}>
                {state.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={record.key}>View</Link>
        </Space>
      ),
    },
  ];

  const [tasksAssigned, setTasksAssigned] = useState([]);
  const [tasksMarket, setTasksMarket] = useState([]);
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
      const tasksToDisplayTmp = [];
      const tasksMarketTmp = [];
      const selectedAccWeb3 = await getSelectedAccWeb3();
      allTasks.forEach((task) => {
        if (
          task.freelancerAddr.toUpperCase() === selectedAccWeb3.toUpperCase()
        ) {
          tasksToDisplayTmp.push({
            key: task.taskIndex,
            description: task.description,
            category: getCategoriesString(parseInt(task.category)),
            states: [getTaskStatesString(parseInt(task.taskStatus))],
          });
        }
        if (parseInt(task.taskStatus) === TASK_STATUS.CERTIFIED) {
          tasksMarketTmp.push({
            key: task.taskIndex,
            description: task.description,
            category: getCategoriesString(parseInt(task.category)),
            states: [getTaskStatesString(parseInt(task.taskStatus))],
          });
        }
      });
      setTasksAssigned(tasksToDisplayTmp);
      setTasksMarket(tasksMarketTmp);
      setReady(true);
    };
    getAllTasks();
  }, []);

  return (
    <div className="freelancerContainer">
      <h2>Market tasks</h2>
      {tasksMarket === null ? (
        <h3>There are no tasks yet.</h3>
      ) : (
        <Table
          dataSource={tasksMarket}
          columns={columns}
          className="freelancerTable"
        />
      )}
      <hr></hr>
      <h2>My tasks (freelancer)</h2>
      {tasksAssigned === null ? (
        <h3>You have no tasks yet.</h3>
      ) : (
        <Table
          dataSource={tasksAssigned}
          columns={columns}
          className="freelancerTable"
        />
      )}
    </div>
  );
}
