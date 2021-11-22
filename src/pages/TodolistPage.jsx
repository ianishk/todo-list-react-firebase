import React, { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { AuthParams } from "../context/AuthProvider";
import { db } from "../firebaseConfig";
import Tasks from "../components/Tasks";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import Select from '@mui/material/Select';



const TodolistPage = () => {
  const [tasks, settasks] = useState([]);
  const [taskInput, settaskInput] = useState("");
  const [filter, setfilter] = useState('');
  const authParams = AuthParams();
  let ftasks = [];
  if (filter === "all" || filter === '' || filter === 'reverse') {
    for (let i = 0; i < tasks.length; i++) {
      ftasks.push(tasks[i]);
    }
    if(filter === 'reverse'){
      ftasks = ftasks.reverse()
    }
  }
  if (filter === "checked") {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].isChecked) {
        ftasks.push(tasks[i]);
      }
    }
  }
  if (filter === "unChecked") {
    for (let i = 0; i < tasks.length; i++) {
      if (!tasks[i].isChecked) {
        ftasks.push(tasks[i]);
      }
    }
  }

  const deleteTask = async (id) => {
    const refTask = [];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id !== id) {
        refTask.push(tasks[i]);
      }
    }
    const docRef = doc(db, "users", `${authParams.user.email}`);
    await setDoc(
      docRef,
      {
        tasks: [...refTask],
      },
      { merge: true }
    );
  };

  const toggleCheck = async (id) => {
    const refTask = [...tasks];
    for (let i = 0; i < refTask.length; i++) {
      if (refTask[i].id === id) {
        refTask[i].isChecked = !refTask[i].isChecked;
        break;
      }
    }
    const docRef = doc(db, "users", `${authParams.user.email}`);
    await setDoc(
      docRef,
      {
        tasks: [...refTask],
      },
      { merge: true }
    );
  };

  const addTask = async () => {
    const d = new Date();
    let text = d.toString();

    const taskObj = {
      id: text,
      value: taskInput,
      isChecked: false,
    };
    const docRef = doc(db, "users", `${authParams.user.email}`);
    await setDoc(
      docRef,
      {
        tasks: [...tasks, taskObj],
      },
      { merge: true }
    );
  };

  useEffect(() => {
    const docRef = doc(db, "users", `${authParams.user.email}`);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.data()) {
        if (doc.data().tasks) {
          settasks(doc.data().tasks);
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, [authParams]);

  return (
    <div className='task-body'>
      <h2>Add Task</h2>
      <TextField size="small" style={{width: '50%', marginRight: '1rem'}} id="outlined-basic" label="Enter task"  value={taskInput}
        onChange={(e) => {
          settaskInput(e.target.value);
        }} />
      
      <Button variant='outlined' onClick={addTask} >add</Button>
      <h2>Your Tasks</h2>
      
      <Box style={{width: '30%', textAlign: 'left'}}>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">filter</InputLabel>
        <Select 
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filter}
          label="Filter"
          onChange={(e) => {setfilter(e.target.value)}}
        >
          <MenuItem value={'all'}>all</MenuItem>
          <MenuItem value={'reverse'}>reverse</MenuItem>
          <MenuItem value={'checked'}>checked</MenuItem>
          <MenuItem value={'unChecked'}>unchecked</MenuItem>
        </Select>
        </FormControl>
      </Box>
    
      {ftasks.map((task) => {
        return (
          <Tasks
            key={task.id}
            enteredTask={task}
            toggleCheck={toggleCheck}
            deleteTask={deleteTask}
          />
        );
      })}
    </div>
  );
};

export default TodolistPage;
