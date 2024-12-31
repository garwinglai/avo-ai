import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../../firebase/firebaseConfig";

const usePasswordAuth = () => {
  const [user, setUser] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [errorLoggingIn, setErrorLoggingIn] = useState(false);

  const createUserWithPassword = async (email, password) => {
    setLoggingIn(true);
    setErrorLoggingIn(false);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      setUser(userCredential.user); // Updates the hook state
      return userCredential.user; // Return the user for immediate use
    } catch (error) {
      console.log("error", error);
      setErrorLoggingIn(error.code);
      throw error.code;
    } finally {
      setLoggingIn(false);
    }
  };

  const signInWithPassword = async (email, password) => {
    console.log("signing in with password");
    setLoggingIn(true);
    setErrorLoggingIn(false);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("userCredential", userCredential.user);

      setUser(userCredential.user);
      return userCredential.user;
    } catch (err) {
      console.log("err", err);
      setErrorLoggingIn(err.code);
      throw err.code;
    } finally {
      setLoggingIn(false);
    }
  };

  return {
    user,
    loggingIn,
    errorLoggingIn,
    createUserWithPassword,
    signInWithPassword,
  };
};

export default usePasswordAuth;
