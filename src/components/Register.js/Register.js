import { useState } from 'react';
import { auth,db } from '../../firebase.js';
import './register.css'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc,serverTimestamp} from "firebase/firestore";
import { NavLink, Navigate, useNavigate,Link } from 'react-router-dom';
const Register = () => {
    const navigate = useNavigate(); 
    const [err, setErr] =useState(false)
    
    const handleSubmit = async (e) =>{
      e.preventDefault()
      const email = `${e.target[0].value}@example.com`
      const password = e.target[1].value
      
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", res.user.uid), {
            uid:res.user.uid,
            nickname:e.target[0].value,
            password,

          });

        await setDoc(doc(db, "userChats", res.user.uid),{
            common: {
                date:serverTimestamp(),
                userInfo:{
                        uid:'common',
                        nickname: 'common chat'},
                lastMessage: {value:" "}
                
              },
              
        });
       
        
       navigate('/')
      }
      
       catch (err) {
        setErr(err.message)
       }
      
       
    }
 return (
<div className='form'>
  <form onSubmit={handleSubmit}>
    <div className="register__name"></div>
    <div className="form__name">Register</div>
    <input required type="text" placeholder='Nickname'/>
    <input required type="password" name="" id="" placeholder='Password' />
    <button>Sign up</button>
    <div className='form__have-account'>
      Are you already have account? <Link to="/login"><span>Log in</span></Link>
    </div>
    {err && <span>{err}</span>}
  </form>
</div>

 )
}


export default Register