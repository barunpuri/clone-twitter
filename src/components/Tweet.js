import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Tweet = ({tweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);  // true / false : editing mode or not 
    const [newTweet, setNewTweet] = useState(tweetObj.text); // update text in editing mode 
    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you wnat to delete this tweet?");
        console.log(ok);
        if(ok) {
            //delete tweet
            await dbService.doc(`tweets/${tweetObj.id}`).delete(); // tweetdbj.id => database id를 가지고 삭제 
            if(tweetObj.attachmentUrl !== ""){
                await storageService.refFromURL(tweetObj.attachmentUrl).delete();
            }
        } 
    }
    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = async(event) =>{
        event.preventDefault();
        // console.log(tweetObj, newTweet);
        await dbService.doc(`tweets/${tweetObj.id}`).update({
            text:newTweet,
        });
        setEditing(false);
    };
    const onChange = (event) =>{
        const {
            target:{value}, 
        } = event;
        setNewTweet(value);
    };
    return (
        <div className="tweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit}  className="container tweetEdit">
                        <input type="text" placeholder="Edit your tweet" value={newTweet} required autoFocus onChange={onChange} className="formInput"/>
                        <input type="submit" value="UpdateTweet"  className="formBtn"/>
                    </form> 
                    <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                    </span>
                </>
            ):(
            <>
                <h4>{tweetObj.text}</h4>
                {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl}/>}
                {isOwner && (
                    <div className="tweet__actions">
                        <span onClick={onDeleteClick}>
                            <FontAwesomeIcon icon={faTrash} />
                        </span>
                        <span onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                    </div>
                )}
            </>
            )}
        </div>
    )
};

export default Tweet;