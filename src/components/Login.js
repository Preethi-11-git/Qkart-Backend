import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const history = useHistory();
  const[name,setname]=useState("");
  const[password,setpassword]=useState("");
  const[load,setLoad]=useState(false);
  const { enqueueSnackbar } = useSnackbar();
  let url=config.endpoint+"/auth/login";
  
  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    // console.log("came here");
    // console.log(formData.username);
    // console.log(formData.password);
    if(validateInput(formData))
    {
      setLoad(true);
    try
    {
     let response= await axios.post(url,formData);
     setLoad(false);
     enqueueSnackbar("Logged in successfully",{variant:"success",autoHideDuration:3000});
    //  console.log(response);
     persistLogin(response.data.token,response.data.username,response.data.balance)
     history.push("/", { from: "Login" })
    }
    catch(err)
    {
      setLoad(false);
      if(err.message =="Network Error")
       {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{variant: "error",autoHideDuration:3000})
      }
      else
      if(err.response.status == 400) 
      enqueueSnackbar(err.response.data.message,{variant:"error",autoHideDuration:3000});
      
    }

    }
  };


  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    if(data.username.length==0)
    {
    enqueueSnackbar("Username is a required field",{variant:"warning",autoHideDuration:3000})
    return false;
    }
    else if(data.password.length==0)
    {
    enqueueSnackbar("Password is a required field",{variant:"warning",autoHideDuration:3000})
    return false;
    }
   return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem('token',token);
    localStorage.setItem('username',username);
    localStorage.setItem('balance',balance);

  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
         id="username"
         label="Username"
        //  variant="outlined"
         name="username"
         onChange={(event)=>setname(event.target.value)}
         placeholder="Enter Username"
         fullWidth
          >
          </TextField>
          <TextField
          id="password"
          label="Password"
          name="password"
          variant="outlined"
          type="password"
          onChange={(event)=>setpassword(event.target.value)}
          helperText="Password must be atleast 6 characters length"
          placeholder="Enter a password with minimum 6 characters"
          fullWidth
          >
            </TextField>
            {load?
            (<Stack alignItems="center"> <CircularProgress /> </Stack> ):(<Button variant="contained" onClick={() => login({"username":name,"password":password})}>
            LOGIN TO QKART
          </Button>)
            } 
            <p>
              Don't have an account?
              <Link className="link" role="link" to="/register">Register now</Link>
            </p>
            </Stack>
            </Box>
      <Footer />
    </Box>
  );
};

export default Login;
