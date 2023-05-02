import { auth } from '../../firebase'
import './header.css'
import { signOut } from 'firebase/auth'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'

const HeaderChat = () =>{
    
    const {currentUser} = useContext(AuthContext)
    
    return (
        <div className="header">
            <div className="header__chat-name">Yuri Chat</div>
            <div className="header__user-name">{currentUser.email?.split("@")[0]}</div>
            <div className="header__logout-btn" onClick={()=>signOut(auth)}>Logout</div>
        </div>
        )
}


export default HeaderChat