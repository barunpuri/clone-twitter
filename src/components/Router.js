import React from "react";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ({refreshUser, isLoggedIn, userObj}) => {
    return (
        <Router> 
            {isLoggedIn && <Navigation userObj={userObj} /> /* isLoggedIn 이면 Navigation도 존재해야 함 */ } 
            <Switch>
                <>
                    {isLoggedIn ? (
                        <div
                            style={{
                                maxWidth: 890,
                                width: "100%",
                                margin: "0 auto",
                                marginTop: 80,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Route exact path = "/">
                                <Home userObj={userObj} />
                            </Route>
                            <Route exact path = "/profile">
                                <Profile userObj={userObj} refreshUser={refreshUser}/>
                            </Route>
                            {/* <Redirect from ="*" to="/" /> 이 방법으로 하거나 profile 안에서 history 를 통해서 Redirect할 수 도 있음 */}
                        </div> 
                    ) : (
                        <>
                            <Route exact path = "/">
                                <Auth />
                            </Route>
                            {/* <Redirect from ="*" to="/" /> */}
                        </>
                    )}
                </>
            </Switch>
        </Router>
    )
}
export default AppRouter;