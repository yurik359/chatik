

import './chatList.css'
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import {ChatContext} from "../../context/ChatContext"
import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";


const ChatList = () => {
    const [chats, setChats] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);
    const [comLasMes,setComLasMes] = useState()

    const sortChatsByDate = (a, b) => {
      return b[1].date - a[1].date;
    };

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
       onSnapshot(doc(db, "userChats", 'common'), (doc) => {
        setComLasMes(doc.data().common.lastMessage.value);
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  
  const handleSelect = (u) => {
   
    dispatch({ type: "CHANGE_USER", payload: u });
  };
  

  const renderChatItem = ([key, chat]) => {
    const chatName = chat?.userInfo?.nickname;
    const lastMessage = chatName === "common chat" ? comLasMes : chat?.lastMessage?.value;
    const isTyping = chat?.isTyping;

    return (
      <div className="chat-item" key={key} onClick={() => handleSelect(chat)}>
        <div className="chat-item__name">{chatName}</div>
        <div className="chat-item__lastmes" style={{ display: isTyping ? "none" : "block" }}>
          {lastMessage}
        </div>
        <div style={{ display: isTyping ? "block" : "none" }}>{`${chatName} is typing...`}</div>
      </div>
    );
  };


    return (
         <div className="chat-list">
        {Object.entries(chats)?.sort(sortChatsByDate).map(renderChatItem)}
        </div>
      )
}


export default ChatList