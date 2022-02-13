import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import TaskCreate from "./components/Dashboard/Manager/TaskCreate/TaskCreate";
import Login from "./components/Login/Login";
import Task from "./components/Task/Task";
import MyContext from "./context/MyContext";
import Home from "./components/Home/Home";
import Layout from "./components/Layout/Layout";

export default function App() {
  return (
    <MyContext>
     <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />}/>
            <Route path="join" element={<Login />} />
            <Route path="dashboard/:actorType" element={<Dashboard />} />
            <Route path="dashboard/:actorType/:taskId" element={<Task />} />
            <Route
              path="dashboard/:actorType/taskCreate"
              element={<TaskCreate />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </MyContext>
  );
}
