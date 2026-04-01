import Textcard from "./Textcard";
import { useContext } from "react";
import { AuthContext } from '../js/Contexts.js'
import { useNavigate } from 'react-router-dom'


const backend_url = import.meta.env.VITE_BACKEND_URL;


const LogoutCard = () => {
    const navigate = useNavigate();
    const {user_info, updateUserInfo, logout} = useContext(AuthContext);
    
    logout();
    return ( 
        <Textcard text={"You have been logged out"}/>
    )
}

export default LogoutCard