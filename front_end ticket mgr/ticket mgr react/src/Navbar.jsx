import {useContext } from 'react'
import './Navbar.css'
import { AuthContext } from './js/Contexts.js'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";




const Navbar = () => {
  const navigate = useNavigate();
  const {user_info, logout_party} = useContext(AuthContext);
  // useEffect(() => {
  //   const getData = async () => {
  //     try{
  //       const res = await getWithAuth(backend_url + `/user_data`);
  //       const data = await res.json();
  //       updateUserInfo({...data}); 
        
  //     }catch(err){
  //       console.log(err)
  //     }                                   // future me, conside prop drilling, if u want to modularize this code block(getData)
  //   }
  //   if(!user_info.username){
  //     console.log("ok")
  //     getData();
  //   }
  //   console.log(user_info.username)
  // }, [])

  const Logoutfunc = async() => {
    await logout_party()
    navigate("/")            
  }

  return (
    <div className='navbar'>
        <div className='logo-div'>
          <Link to='/'>
            LOGO
          </Link>

        </div>

        <div className='profile-section'>
            <div>
            
                <img />
                {user_info? `@`+user_info.username : ""}

            </div>
            {user_info?            
            <div onClick={Logoutfunc}>
                Logout
            </div>
            :
            <div>
               
              <div>
              <Link to='/auth/signup/'>
                Signup
              </Link>

            </div>
            <div>
              <Link to='/auth/login/'>
                Login
              </Link>
            </div>
              
            </div>
}
            
        </div>
    </div>
  )
}

export default Navbar