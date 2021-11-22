import React, { useState } from "react";
import { AuthParams } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";

const Loginpage = () => {
  const navigate = useNavigate();
  const authParams = AuthParams();
  const [error, seterror] = useState('');
  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const emailHandler = (e) => {
    const newEmail = e.target.value;
    setValues({
      ...values,
      email: newEmail,
    });
  };

  const passwordHandler = (e) => {
    const newPassword = e.target.value;
    setValues({
      ...values,
      password: newPassword,
    });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const signInWithGoogle = () => {
    authParams.signInWithGoogle().then(() => {
      navigate("/todo-list");
    });
  };

  const loginHandler = () => {
    authParams.logIn(values.email, values.password).then((res) => {
      navigate("/todo-list");
    }).catch((err) => {
      seterror('Error: '+ err.split('/')[1].split(')')[0])
    });
  };
  return (
    <div>
      <div className="loginpage">
        <h1>Login to your account.</h1>
        <Button style={{margin: '1rem !important'}}
          variant="contained"
          color="primary"
          className="formBtn"
          onClick={signInWithGoogle}
        >
          Sign in using google
        </Button>
        <h3>OR</h3>
        <h3>{error}</h3>
        <form action="">
          <TextField
            fullWidth
            value={values.email}
            onChange={emailHandler}
            label="Email address"
            color="primary"
          ></TextField>
          <br />
          <br />

          <TextField
            fullWidth
            id="outlined-adornment-password"
            type={values.showPassword ? "text" : "password"}
            value={values.password}
            onChange={passwordHandler}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            label="Password"
          />
          <br />
          <Button
            style={{margin: '1rem !important'}}
            variant="contained"
            color="primary"
            className="formBtn"
            onClick={loginHandler}
          >
            Login
          </Button>
          <p>
            Don't have an account? <Link to="/signup">Create one</Link>{" "}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Loginpage;
