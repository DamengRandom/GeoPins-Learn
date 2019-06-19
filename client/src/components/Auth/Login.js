import React, { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Context from "../../context";
import { ME_QUERY } from "../../graphql/queries";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  console.log("Whats the Conetxt for Consumer? ", useContext(Context));

  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(`http://localhost:4000/graphql`, {
        headers: {
          authorization: idToken
        }
      });
      const data = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: data.me });
      // console.log('User', data);
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn() })
    }catch(error) {
      onFailure(error);
    }
  }

  const onFailure = error => {
    console.error("Login Error: ", error);
  }

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66, 133, 244)" }}>Welcome</Typography>
      <GoogleLogin
        clientId="349333974603-h7upv12kckjkaa4s43bhogm4ua0j6gjn.apps.googleusercontent.com"
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
        theme="dark"
        buttonText="Login with Google"
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
