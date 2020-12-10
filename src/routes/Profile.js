import React, { useEffect, useState } from "react";
import { authService, dbService } from "../fbase";
import { useHistory } from "react-router-dom";

export default ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }
    const getMyTweets = async() => {
        const tweets = await dbService
            .collection("tweets")
            .where("creatorId", "==", userObj.uid) //filtering 내정보 가져옴 
            .orderBy("createdAt") // 최초 정렬 시도 -> 에러 -> index 미리 만들어 줘야 함 -> errorcode -> 링크 -> 인덱스 생성 가능
            .get(); 
        console.log(tweets.docs.map((doc) => doc.data()));
    };
    const onChange = (event) =>{
        const {target : {value}, } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async(event) =>{
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            //update 
            // console.log(userObj.updateProfile());
            await userObj.updateProfile({        //profile page에서 바로 업데이트 안됨 -> 바로 되게 하고 싶음 
                displayName : newDisplayName,
            });
            refreshUser();   // refreshUser를 해도 바로 변화가 발생하지 않음 => react 는 re rendering 작업이 뛰어난데 refresh User코드를 보면 .. App.js ->refresh User
        }
    };

    useEffect(() => {
        getMyTweets();
    }, [])
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input 
                    onChange={onChange} 
                    type="text" 
                    autoFocus 
                    placeholder="Display name" 
                    value={newDisplayName} 
                    className="formInput"
                />
                <input 
                    type="submit" 
                    value="Update Profile" 
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
};