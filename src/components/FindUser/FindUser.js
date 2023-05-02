import { useContext, useState } from 'react'
import './findUser.css'
import {
    collection,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
  } from "firebase/firestore";
  import { db } from "../../firebase";
  import { AuthContext } from "../../context/AuthContext";

const FindUser = () => {
  const [nickName,setNickName] = useState('');
  const [user,setUser] = useState(false)
  const [err, setErr]  = useState(false);
  const [noUser,setNoUser] = useState(false)

  const {currentUser} = useContext(AuthContext)

  const handleFind = async () => {
    try {
        const q = query(
            collection(db, "users"),
            where("nickname", "==", nickName)
        ); 
        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty) {
            setNoUser(true)
        } else {
            setNoUser(false)
        }
        querySnapshot.forEach((doc) => {
            setUser(doc.data());
        });
    } catch (err) {
        setErr(true);
    }
};
        
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
                console.log(err)
              }
              setUser(null)
              setNickName('')
        }        



    const handleKeyFind = (e) => {
      return  e.key === 'Enter' && handleFind();
    }

     return (
      <>
        <input
            className="find-user"
            value={nickName}
            onKeyDown={handleKeyFind}
            type="text"
            onChange={(e) => setNickName(e.target.value)}
            placeholder="Find a user"
        />
        {err && <div>Something went wrong</div>}
        {noUser && nickName !== '' && <div>User not found</div>}
        {user && (
            <div className="find-user__container" onClick={() => handleSelectUser(user)}>
                <div className="find-user__nickname">{user?.nickname}</div>
            </div>
        )}
    </>
    
    )
}


export default FindUser
