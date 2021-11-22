import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthParams } from "../context/AuthProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const authParams = AuthParams();
  const signOut = () => {
    authParams.signOut().then(navigate("/"));
  };
  const ifUser = () => {
    if (authParams.user) {
      return (
        <div className="navSec3">
          <p>{authParams.user.displayName}</p>
          <Button variant="contained" onClick={signOut} disableElevation>
            Logout
          </Button>
        </div>
      );
    }
  };
  return (
    <div className="navbar">
      <div className="navSec1">
        <Button
          variant="contained"
          onClick={() => {
            navigate("../");
          }}
          disableElevation
        >
          Back
        </Button>
      </div>
      <div className="navSec2">
        <h1>Todo list</h1>
      </div>
      {ifUser()}
    </div>
  );
};

export default Navbar;
