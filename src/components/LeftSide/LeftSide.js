
import './leftSide.css'
import HeaderChat from '../Header/HeaderChat.js'
import ChatList from '../ChatsList/ChatsList'
import FindUser from '../FindUser/FindUser'

const LeftSide = () =>{
    return (
        <div className="left-side">
        <HeaderChat/>
       <FindUser/>
        <ChatList/>
        </div>
    )
}


export default LeftSide