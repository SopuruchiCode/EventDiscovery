import { useNavigate } from 'react-router-dom'
import "../signup-form.css"
import { useContext } from 'react'
import { AuthContext } from '../js/Contexts.js'
// import { setLoginState } from '../js/TokenStorage'

const LoginForm = () => {
  const {user_info, updateUserInfo} = useContext(AuthContext);
  
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  async function submitFunc(event) {
    event.preventDefault();
    const formElem = document.querySelector("#login-form");
    const formData = new FormData(formElem);
    try{
        const res = await fetch(backend_url + `/auth/login`, {
            method: "post",
            body: formData,
            credentials: "include"

        });
        if (res.status >= 400 || res.statusText === "Invalid Credentials"){
          alert("Account not found!")
        }

        if(res.ok){
            const data = await res.json();
            if (data["success"]){
              alert("Login successful");    ///Remember the access token in react state stuff
              // setLoginState(true);
              updateUserInfo({...data["user_data"]})

              navigate(`/`);
            }
        }
    }catch(err){
        console.log(err);
    }
  }

  return (
    <div>
        <form id="login-form" autoComplete="off" onSubmit={submitFunc}>
            <h3>
              Login
            </h3>
            
            <input required placeholder="Username" name="username" id="username" autoComplete="new-username"/>

            <input required type="password" placeholder="Password" name="password" id="password" autoComplete="new-password"/>
        
            <button type="submit">Login</button>
        </form>
    </div>
  )
}

export default LoginForm