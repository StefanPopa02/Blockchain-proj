import React, { useContext } from "react";
import "./Manager.css";
import { Button, Table, Tag, Space, Divider } from "antd";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../../context/MyContext";
import { useEffect, useState } from "react/cjs/react.development";
import {
  deleteTaskWeb3,
  getAllTasksWeb3,
  getSelectedAccWeb3,
} from "../../../web3/Web3Client";
import { getCategoriesString } from "../../../Categories";
import TASK_STATUS, { getTaskStatesString } from "../../../TaskStates";

export default function Manager() {
  const [tasksToDisplay, setTasksToDisplay] = useState([]);
  const { tasks, setTasks } = useContext(GlobalContext);
  useEffect(() => {
    const getAllTasks = async () => {
      const allTasks = await getAllTasksWeb3();
      setTasks(allTasks);
      const tasksToDisplayTmp = [];
      const selectedAccWeb3 = await getSelectedAccWeb3();
      allTasks.forEach((task) => {
        if (task.managerAddr.toUpperCase() === selectedAccWeb3.toUpperCase()) {
          tasksToDisplayTmp.push({
            key: task.taskIndex,
            description: task.description,
            category: getCategoriesString(parseInt(task.category)),
            states: [getTaskStatesString(parseInt(task.taskStatus))],
          });
        }
      });
      console.log("tasksToDisplay", tasksToDisplayTmp);
      setTasksToDisplay(tasksToDisplayTmp);
    };
    getAllTasks();
  }, []);

  const onDeleteTask = (taskId) => {
    console.log("task id to delete", taskId);
    deleteTaskWeb3(taskId).then((result) => {
      if (result.status) {
        window.location.reload();
      }
    });
  };

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
            switch (state) {
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
          {record.states[0] === getTaskStatesString(TASK_STATUS.CREATED) && (
            <Button type="text" danger onClick={() => onDeleteTask(record.key)}>
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
      <h2>My tasks (manager)</h2>
      <Divider />
      {tasksToDisplay === null ? (
        <h3>You have no tasks</h3>
      ) : (
        <Table
          dataSource={tasksToDisplay}
          columns={columns}
          className="managerTable"
        />
      )}
      <Button type="primary" style={{ margin: 8 }}>
        <Link to="taskCreate">Create new task</Link>
      </Button>
    </div>
  );
}
