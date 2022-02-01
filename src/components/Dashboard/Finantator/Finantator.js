import React, { useContext } from "react";
import { GlobalContext } from "../../../context/MyContext";
import { useEffect, useState } from "react/cjs/react.development";
import { getAllTasksWeb3, getSelectedAccWeb3 } from "../../../web3/Web3Client";
import { getCategoriesString } from "../../../Categories";
import { Table, Tag, Space } from "antd";
import { Link } from "react-router-dom";
import TASK_STATUS, { getTaskStatesString } from "../../../TaskStates";
import "./Finantator.css";

export default function Finantator() {
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
        </Space>
      ),
    },
  ];

  const [tasksMarket, setTasksMarket] = useState([]);
  const { tasks, setTasks } = useContext(GlobalContext);
  useEffect(() => {
    const getAllTasks = async () => {
      const allTasks = await getAllTasksWeb3();
      setTasks(allTasks);
      const tasksMarketTmp = [];
      allTasks.forEach((task) => {
        tasksMarketTmp.push({
          key: task.taskIndex,
          description: task.description,
          category: getCategoriesString(parseInt(task.category)),
          states: [getTaskStatesString(parseInt(task.taskStatus))],
        });
      });
      setTasksMarket(tasksMarketTmp);
    };
    getAllTasks();
  }, []);

  return (
    <div className="finantatorContainer">
      <h2>Market tasks (finantator)</h2>
      {tasksMarket === null ? (
        <h3>There are no tasks yet.</h3>
      ) : (
        <Table
          dataSource={tasksMarket}
          columns={columns}
          className="finantatorTable"
        />
      )}
    </div>
  );
}
