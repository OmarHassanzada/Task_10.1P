import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Login.css';
import './SignOut.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { signInWithGooglePopup , createUserDocFromAuth } from "./utils/firebase";
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
  const navigate = useNavigate();

  const logGoogleUser = async () => {
    const { user } = await signInWithGooglePopup();
    const userDocRef = await createUserDocFromAuth(user);
    navigate('/');
  }

  const [errorMessage, setErrorMessage] = useState('');

  const [contact, setContact] = useState({
    username: "",
    password: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContact((prevValue) => ({
      ...prevValue,
      [name]: value
    }));
  }

  const handleLogin = async () => {
    try {
      console.log('Trying to Log in user:', contact.username);
      const usernamePassword = await firebase.auth().signInWithEmailAndPassword(contact.username, contact.password);
      console.log('User has signed in:', usernamePassword.user.email);
      navigate('/');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('The username you entered is INVALID');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('The password you entered is INVALID');
      } else {
        setErrorMessage('An error occurred while logging you in');
      }
    }
  }

  //this function handles the sign out using firebase
  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      navigate('/'); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // We us a State that will be used check whether the user is signed in or not
  const [HasUserSignedIn, UserSignedInStatus] = useState(false);

   // we use useffect for adding observer watching the status chnage when the user signs in
  useEffect(() => {
   
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        UserSignedInStatus(true);
      } else {
        UserSignedInStatus(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {HasUserSignedIn ? (
        <div className="SignOut-container">
          <h1>You have signed in already.</h1>
          <h3>Would you like to sign out?</h3>
          <signOutBtn onClick={handleSignOut}>
          <img src={require("./Images/signout.png")} alt="logo" width={25} height={25} style={{ float: "right" }} />
            Sign Out
          </signOutBtn>
        </div>
      ) : (

        <div className="signin-container">
        <h1>Log In</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <input
          name="username"
          type="text"
          placeholder="Email"
          value={contact.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={contact.password}
          onChange={handleChange}
        />
        <loginbutton type='submit' onClick={handleLogin}>
          Log In
        </loginbutton>

        <h5 style={{ color: "blue" }}>
          No Account? <Link to="/registration">Sign Up!</Link>
        </h5>

        <hr style={{ width: "80%", borderColor: "black" }} />
        <br />

        <button className="googleloginBtn" onClick={logGoogleUser}>
          <img src={require("./Images/google-logo.png")} alt="logo" width={25} height={25} style={{ float: "left" }} />
          Login In with Google
        </button>
        </div>
      )}
    </div>
  );
}

export default Login;
