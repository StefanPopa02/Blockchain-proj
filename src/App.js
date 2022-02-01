import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import TaskCreate from "./components/Dashboard/Manager/TaskCreate/TaskCreate";
import Login from "./components/Login/Login";
import Task from "./components/Task/Task";
import MyContext from "./context/MyContext";
import Home from "./components/Home/Home";

export default function App() {
  return (
    <MyContext>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Login />} />
          <Route path="dashboard/:actorType" element={<Dashboard />} />
          <Route path="dashboard/:actorType/:taskId" element={<Task />} />
          <Route
            path="dashboard/:actorType/taskCreate"
            element={<TaskCreate />}
          />
        </Routes>
      </Router>
    </MyContext>
  );
}
