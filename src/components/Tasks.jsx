import React from "react";
import { Button } from "@mui/material";

const Tasks = (props) => {
  return (
    <div className='taskBar'>
      <div
        className={props.enteredTask.isChecked ? "checkedBox" : "uncheckedBox"}
        onClick={async () => {
          await props.toggleCheck(props.enteredTask.id);
        }}
      >
        <p>{props.enteredTask.value}</p>
      </div>
      <Button variant='outlined' onClick={async() => {
        await props.deleteTask(props.enteredTask.id)
      }}>delete</Button>
    </div>
  );
};

export default Tasks;
