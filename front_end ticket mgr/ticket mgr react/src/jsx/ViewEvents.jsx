import React from 'react'
import { useEffect, useState } from 'react'
import { AuthContext } from '../js/Contexts.js'
import { Eventcard } from './Eventcard.jsx'
import '../css/view_your_event.css'
const backend_url = import.meta.env.VITE_BACKEND_URL;


const ViewEvents = () => {
    const [userEvents, updateUserEvents] = useState([]);
    const [renewAccessToken, updateRenewAccessToken] = useState(null);
    useEffect(()=>{
        const getData = async() => {
            try{
                const res = await fetch(backend_url + '/events',{
                });
                if(res.status === 401){
                    updateRenewAccessToken(true);
                }
                const data = await res.json();
                updateUserEvents([...data])
            }catch(err){
                console.log(err)
            } 
        }
        getData()
    }
    ,[renewAccessToken])
  return (
    <div className='div-con'>  
    <div className='container'>
        {userEvents.map((event, index) => (
            <Eventcard eventModel={event} key={index}/>            
        ))}
    </div>
    </div>
  )
}

export default ViewEvents