import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";


const AuthContext = createContext();

const provider = new GoogleAuthProvider();

export const AuthParams = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setuser] = useState({});

  const signIn = (userEmail, userPass) => {
    console.log('1')
    const promise = new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(auth, userEmail, userPass)
        .then(async (res) => {
          const docRef = doc(db, "users", `${res.user.email}`);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            await setDoc(docRef, {
              displayName: res.user.displayName || res.user.email.split('@')[0],
              email: res.user.email,
            });
          }
          resolve();
        })
        .catch((err) => {
          reject(err.message);
        });
    });
    return promise;
  };

  const logIn = (userEmail, userPass) => {
    const promise = new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, userEmail, userPass)
        .then((res) => {
          if(res.user){
            resolve('success');
          }
          else{
            resolve('err');
          }
        })
        .catch((error) => {
          reject(error.message);
        });
    });
    return promise;
  };

  const signInWithGoogle = () => {
    const promise = new Promise((resolve, reject) => {
      signInWithPopup(auth, provider)
        .then(async (res) => {
          const docRef = doc(db, "users", `${res.user.email}`);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            await setDoc(docRef, {
              displayName: res.user.displayName,
              email: res.user.email,
            });
          }
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
    return promise;
  };

  const signOutPromise = () => {
    const promise = new Promise((resolve, reject) => {
      signOut(auth)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
    return promise;
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user){
        if(user.displayName){
          setuser(user);
        }else{
          setuser({...user, displayName: user.email.split('@')[0]});
        }
      }else{
        setuser(user);
      }
    });
  }, []);

  const authParams = {
    user: user,
    signInWithGoogle: signInWithGoogle,
    signIn: signIn,
    logIn: logIn,
    signOut: signOutPromise,
  };

  return (
    <AuthContext.Provider value={authParams}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
