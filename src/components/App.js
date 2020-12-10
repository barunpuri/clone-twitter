import React, { useState, useEffect } from "react"
import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
  const [init, setInit] = useState(false);            
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
  //listen change user
    authService.onAuthStateChanged((user) => { // login / logout 하면 발생 , app 초기화 할때 발생 
      if(user){ // user 정보 있으면 
        
        //option 1 
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        }); // user 정보 update 
        
        /* //option 2
        setUserObj(user); */

      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    // setUserObj(authService.currentUser); // firebase 의 authService -> current User정보를 가져옴 : 매우 큼 => rendering하는데 결정 장애가 옴 
    const user = authService.currentUser;

    //option 1
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });

    /* //option 2 
    setUserObj(Object.assign({}, user)); // empty object -> user object  */
  }
  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..." }
      <footer>&copy; {new Date().getFullYear()} copy-twitter </footer>
    </> 
    );
}

export default App;
