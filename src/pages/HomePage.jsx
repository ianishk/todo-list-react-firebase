import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
const Homepage = () => {
  const navigate = useNavigate();
  return (
    <div className='mhomePage'>
      <h1>Welcome to todo-list application!</h1>
      <div className='homePage'>
        <div>
          <h2>Login</h2>
          <p>Already have an account? login now </p>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        </div>
        <h3>OR</h3>
        <div>
          <h2>Signup</h2>
          <p>New user? create a new account for free </p>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/signup", { replace: true });
            }}
          >
            Signup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
