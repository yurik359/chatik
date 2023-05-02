import { useState,useEffect, useRef } from 'react'
import './InputMessage.css'
import { db } from '../../firebase';
import {collection,serverTimestamp,Timestamp,updateDoc,arrayUnion}from 'firebase/firestore'; 
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext';
import { doc, onSnapshot } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import HeaderRight from '../HeaderRight/HeaderRight';



const InputMessage = () => {
    const {currentUser} = useContext(AuthContext)
    const [value, setValue] = useState('');
    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);
    const [isTyping, setIsTyping] = useState(false);
    const [timerId, setTimerId] = useState(null);
    const timerRef = useRef(null);
    const [commonisType, setCommonIsType] = useState(false) 
    const [memberCommon,setMemberCommon]= useState('')
    
   const ref = useRef();
   const userChatsRef = collection(db,'userChats');
   const commonIsTying = collection(db,'commonChatIsTyping');

   const sendMessage = async () => {
    if ( value==''){
        console.log('пусто')
    } else {
        
        await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              value,
              senderId: currentUser.uid,
              date: Timestamp.now(),
            nickname:currentUser.email.split("@")[0]
            }),
          });
            
          await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
              value,
            },
            [data.chatId + ".date"]: serverTimestamp(),
          });
      
          await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
              value,
            },
            [data.chatId + ".date"]: serverTimestamp(),
          });
          
          if (data.user.uid=='common') {
            await updateDoc(doc(db, "commonChatIsTyping",'isTyping'), {
               isTyping: false,
               nickname:'',
          })
          
        } 
          await updateDoc(doc(db, "userChats",data.user.uid), {
            [data.chatId + ".isTyping"]: false,
        })
        setValue('');
    }
    
    
   
   }
   
   const handleTypingCancel = async () => {
    
    clearTimeout(timerRef.current);
    if (data.user.uid=='common') {
        await updateDoc(doc(db, "commonChatIsTyping",'isTyping'), {
            isTyping: true,
            nickname:currentUser.email.split("@")[0],
        })
    }
    await updateDoc(doc(db, "userChats",data.user.uid), {
        [data.chatId + ".isTyping"]: true,
    })
    const id = setTimeout(async () => {
      if (data.user.uid=='common') {
        await updateDoc(doc(db, "commonChatIsTyping",'isTyping'), {
          isTyping: false,
          nickname:'',
      })
      }
      
        await updateDoc(doc(db, "userChats",data.user.uid), {
            [data.chatId + ".isTyping"]: false,
        })
      setTimerId(null);
    }, 3000);
    timerRef.current = id;
    setTimerId(id);
  };
   
   const handleKeyDonw = async (e) => {
    if (e.key!=='Enter') {
        handleTypingCancel()
    }
    
    if (e.key==='Enter') {
        sendMessage()
    }
    
   }

   onSnapshot(userChatsRef,(snapshot) => {
    const usersArray = snapshot.docs.filter((doc) => doc.id==currentUser.uid);
    setIsTyping(usersArray[0]?.data()?.[data.chatId]?.isTyping)
  
   })

   onSnapshot(commonIsTying,(snapshot)=>{
   setCommonIsType(snapshot.docs[0].data().isTyping)
   setMemberCommon(snapshot.docs[0].data().nickname)
   
   })

   
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[messages])
 
   useEffect(() => {
     const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
       doc.exists() && setMessages(doc.data().messages);
     });
 
     return () => {
       unSub();
     };
   }, [data.chatId]);

   
    return (
      <div className="right-side">
        <div className="message-area"  >
        <HeaderRight isTyping={isTyping} commonisType={commonisType} memberCommon={memberCommon} />
        <div className="message-area__messages">
         {messages.map(m=>{
return (
                    <div className="message-container" key={uuid()} ref={ref} style={{
                    alignSelf: currentUser.uid == m.senderId? 'flex-end' :'flex-start'
                    }}>
                    <div className="message-time"></div>
                    <div className="message-name">{m.nickname}</div>
                    <div className="message-text">{m.value}</div>
                </div>
                )
         })}
            </div>
            </div>
        <div className="input-message">
            <input type="text" placeholder='Type something...' value={value} onKeyDown={handleKeyDonw} onChange={(e)=>setValue(e.target.value)} />
            <div className="input-message__btn" onClick={sendMessage}>SEND</div>
        </div>
        </div>
    )
}


export default InputMessage