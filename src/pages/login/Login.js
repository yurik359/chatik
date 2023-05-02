import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
const [err, setErr] = useState(false);
const navigate = useNavigate();
const { currentUser } = useContext(AuthContext);

const handleSubmit = async (e) => {
e.preventDefault();
const email = `${e.target[0].value}@example.com`;
const password = e.target[1].value;

try {
  await signInWithEmailAndPassword(auth, email, password);
  navigate("/");
} catch (err) {
  setErr(true);
}
}

return (
  <div className='form'>
  <form onSubmit={handleSubmit}>
  <div className="register__name"></div>
  <div className="form__name">Login</div>
  <input required type="text" placeholder='Nickname'/>
  <input required type="password" name="" id="" placeholder='Password' />
  <button>Log in</button>
  <div className='form__have-account'>
  You don't have an account? <Link to="/register"><span>Sign up</span></Link>
  </div>
  {err && <span>{err}</span>}
  </form>
  </div>
  );
  };
  
  export default Login;
