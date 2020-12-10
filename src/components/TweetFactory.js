import React, { useState } from "react";
import { storageService, dbService } from "../fbase";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const TweetFactory = ({ userObj }) => {
    const [tweet, setTweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async(event) => {
        if (tweet === "") {
            return;
          }
        event.preventDefault();
        // await dbService.collection("tweets").add({ // tweet upload 
        //     text:tweet,
        //     createdAt:Date.now(),
        //     creatorId: userObj.uid,
        // })
        // setTweet("");
    
        // if img -> upload img -> get img url -> tweet + img url 
        // not img -> tweet 

        let attachmentUrl = "";
        if(attachment !== ""){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            // console.log(response);
            // console.log(response.ref.getDownloadURL());
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
            text: tweet, 
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("tweets").add(tweetObj);
        setTweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const { 
            target:{value}, 
        }=event;
        setTweet(value);
    };
    const onFileChange = (event) => {
        // console.log(event.target.files);
        const {target:{files}} = event; // event안에서 target 안으로 가서 file을 받아 옴 
        const theFile = files[0];
        // console.log(theFile);
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            // console.log(finishedEvent)
            const {currentTarget :{result}} = finishedEvent; // result 가져옴 
            setAttachment(result);  //attachemnt를 result로 바꾸기 
        }
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setAttachment("");

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input 
                    className="factoryInput__input"
                    value={tweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input 
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    )
}
export default TweetFactory