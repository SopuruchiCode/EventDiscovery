import { useState, useEffect } from "react";
import { AuthContext } from "./js/Contexts";
import { getWithAuth } from "./js/TokenStorage";
const backend_url = import.meta.env.VITE_BACKEND_URL;

import React from 'react'

const AuthProvider = ({children}) => {
  const [user_info, updateUser] = useState(null)
  console.log("i ran again", location.href)


  const updateUserInfo = (userData) =>{ 
    updateUser(userData);
    console.log("i was updated", location.href)
  }

  const logout_party = async () => {
        try{
            const res = await fetch(backend_url + `/auth/logout`, {
            credentials: 'include',
            method: "post"
        })
            const data = await res.json();
            console.log(data)
            updateUserInfo(null)
        }
        catch(err){
            console.log(err)
        }
        

        
    }

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getWithAuth(backend_url + `/user_data`);
        const data = await res.json();
        updateUserInfo({ ...data });

      } catch (err) {
        console.log(err)
      }                                   // future me, conside prop drilling, if u want to modularize this code block(getData)
    }
    if (!user_info) {
      console.log("geting data")
      getData();
    }

  }, [])
  
  return (
    <AuthContext.Provider value={{user_info, updateUserInfo, logout_party}}>

      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider