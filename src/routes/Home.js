import React, { useState, useEffect } from "react";
import { dbService } from "../fbase";
import Tweet from "../components/Tweet";
import TweetFactory from "../components/TweetFactory";

const Home = ({userObj}) => {  // user Obj : props 
    const [tweets, setTweets] = useState([]);
    // const getTweets = async() => {   //구식... ㅋㅋ
    //     const dbtweets = await dbService.collection("tweets").get(); // get : 다가져옴 => query snapshot을 가져옴 
    //     dbtweets.forEach( (document) => {
    //         const tweetObject = {
    //             ...document.data(),  // spread attribute ==> data의 내용물 가져옴 
    //             id: document.id,
    //         }
    //         setTweets(prev => [tweetObjext, ...prev]); //값대신 함수 전달 / 함수 return 가장 최근이 가장 위로, 현재 + 이전꺼 
    //     });  // foreach로 하나씩 보면서 data 가져옴 

    // }
    useEffect(() => {
        // getTweets();
        dbService.collection("tweets").onSnapshot((snapshot)=>{ // onSnapshot : db 변화 listener 변화 생기면 알려줌 //신식 
            // console.log("something happen");
            const tweetArray = snapshot.docs.map(doc => ({   // 만들어 
                id:doc.id, 
                ...doc.data(), 
            }));
            // console.log(tweetArray);
            setTweets(tweetArray);
        })
    }, []);
    return (
        <div className="container">
            <TweetFactory userObj={userObj}/>
            <div style={{ marginTop: 30 }}>
                {tweets.map((tweet) => (     // 
                    // <div key={tweet.id}>
                    //     <h4>{tweet.tweet}</h4>
                    // </div>
                    <Tweet // proc ..? 
                        key={tweet.id} 
                        tweetObj={tweet}  // tweet 의 모든 데이터
                        isOwner={tweet.creatorId === userObj.uid}  //dynamic proc   : true / false 
                    />
                ))}
            </div>
        </div>
    );
    
};

export default Home;