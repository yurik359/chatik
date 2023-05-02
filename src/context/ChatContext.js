import {
    createContext,
    useContext,
    useReducer,
  } from "react";
  import { AuthContext } from "./AuthContext";
  
  export const ChatContext = createContext();
  
  export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const INITIAL_STATE = {
      chatId: "null",
      user: {},
      isTyping:false,
    };
  
    const chatReducer = (state, action) => {
      switch (action.type) {
        case "CHANGE_USER":
            
          return {
            user: action.payload.userInfo,
            chatId: action.payload.userInfo.uid=='common'?action.payload.userInfo.uid :
              currentUser.uid > action.payload.userInfo.uid
                ? currentUser.uid + action.payload.userInfo.uid
                : action.payload.userInfo.uid + currentUser.uid,
                isTyping:action.payload.isTyping,
          }
          
  
        default:
          return state;
      }
    };
  
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  
    return (
      <ChatContext.Provider value={{ data:state, dispatch }}>
        {children}
      </ChatContext.Provider>
    );
  };