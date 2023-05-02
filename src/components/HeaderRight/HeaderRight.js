import { useContext, useEffect, useState } from "react";
import "./headerRight.css";
import { ChatContext } from "../../context/ChatContext";
import { collection,  doc, getDoc, getDocs, 
    serverTimestamp,  updateDoc, 
     setDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";

const HeaderRight = ({isTyping,commonisType,memberCommon}) => {
        const {data}  = useContext(ChatContext)
        const [members,setMember] = useState(null)
        const {currentUser} = useContext(AuthContext)
        const [closeMemList,setCloseMemList] = useState(false) 
        const [currentUserNickname,setCurrentUserNickname] = useState(currentUser.email?.split('@')[0])
       
        const handleMembersList = async () => {
            setCloseMemList(false)
                try {
                  const memberList =  await getDocs((collection(db,'users')));
                 
                  setMember(
                    memberList.docs.map(e=>{
                    return  {
                        nickname:e.data().nickname,
                        uid:e.data().uid,
                    }}
                  ))
                  
                } catch(err) {
                    new Error(err)
                }
        }

        const handleSelectUser = async (user) => {
            const combinedId =
            currentUser.uid > user.uid
              ? currentUser.uid + user.uid
              : user.uid + currentUser.uid;
             try {
                
                const res = await getDoc(doc(db,"chats",combinedId))
                
                if (!res.exists()) {
                    await setDoc(doc(db,"chats",combinedId),{messages:[]} )

                    await updateDoc(doc(db, "userChats", currentUser.uid), {
                        [combinedId + ".userInfo"]: {
                          uid: user.uid,
                          nickname: user.nickname,
                          
                        },
                        [combinedId + ".date"]: serverTimestamp(),
                      });
              
                      await updateDoc(doc(db, "userChats", user.uid), {
                        [combinedId + ".userInfo"]: {
                          uid: currentUser.uid,
                          nickname: currentUser.email.split("@")[0],
                          
                        },
                        [combinedId + ".date"]: serverTimestamp(),
                      });
                      
                    
                } 
             }
              catch(err) {
                    console.log('Add chat error:',err)
              }
          
        }     
        const handleClickOutside = (e) => {
            if (
            !e.target.classList.contains("header-right__member-list") &&
            !e.target.classList.contains("header-right__btn")
            ) {
            setCloseMemList(true);
            }
            };
            useEffect(()=>{
                document.body.addEventListener('click',handleClickOutside)
            },[])
        

    return (
        <div className="header-right">
            <div className="header-right__title">
            <div className="header-right__name-chat">{data.user?.nickname}</div>
            {isTyping&&<span>{data.user.nickname} is typing...</span>}

            {commonisType&&data.chatId=='common'&&<span style={
              {display:memberCommon==currentUserNickname?'none':'block'}}>
              {memberCommon} is typing...
              </span>}
            </div>
            
            <div className="header-right__container">
            <div className="header-right__btn" 
            onClick={handleMembersList} 
            style={{display:data.user.nickname=='common chat'?'block':'none'}}>
            members list 
             </div>
            <div className="header-right__member-list" style={{display:closeMemList?'none':'block'}}>
                {members&&members.map(e=>{ 
                    return (<div className='member-list__item'
                             onClick={()=>handleSelectUser(e)}
                             key={e.uid}>
                        {e.nickname}
                    </div>)
                })}
            </div>
            </div>
        </div>
    )
}



export default HeaderRight