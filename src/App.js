
import { useContext } from 'react';
import './App.css';
import Register from './components/Register.js/Register';
import Home from './pages/Home';
import { BrowserRouter,Routes,Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/login/Login';
const App = () => {
  const {currentUser} = useContext(AuthContext)
  
  const ProtectedRoute = ({children}) =>{
    if (!currentUser) {
      
      return <Navigate to="/login"/>
    }
    return children
  }
  return (
   
  <BrowserRouter>
  <Routes>
    <Route path="/">
       <Route index element = {<ProtectedRoute><Home/></ProtectedRoute>}/>
       <Route path="register"  element = {<Register/>}/>
       <Route path="login" element = {<Login/>}/>
    </Route>
  </Routes>
  </BrowserRouter>
  )
}

export default App;
