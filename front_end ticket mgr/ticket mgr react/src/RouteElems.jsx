import { Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import SignupForm from './SignupForm.jsx'
import LoginForm from './jsx/LoginForm.jsx'
import EventCreationForm from './EventCreationForm.jsx'
import ViewYourEvents from './jsx/ViewYourEvents.jsx'
import ViewEvents from './jsx/ViewEvents.jsx'
import InfiniteScroll from './jsx/CustomInfiniteEventScroll.jsx'
import LogoutCard from './jsx/Logout.jsx'
import PersonalTicketScroll from './jsx/PersonalTicketScroll.jsx'
import { TicketRequestForm } from './jsx/TicketRequestForm.jsx'



import { useEffect, useState, useContext } from 'react'
import { getAccessToken, setAccessToken, getWithAuth } from './js/TokenStorage.js'
import './Navbar.css'
const backend_url = import.meta.env.VITE_BACKEND_URL;
import { AuthContext } from './js/Contexts.js'

import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoutes = () => {
  const { user_info } = useContext(AuthContext);
  return user_info? <Outlet /> : <Navigate to="/auth/login/" />
}

const RouteElems = () => {
  const { user_info, updateUserInfo } = useContext(AuthContext);



  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const res = await getWithAuth(backend_url + `/user_data`);
  //       const data = await res.json();
  //       updateUserInfo({ ...data });

  //     } catch (err) {
  //       console.log(err)
  //     }                                   // future me, conside prop drilling, if u want to modularize this code block(getData)
  //   }
  //   if (!user_info?.username) {
  //     getData();
  //   }

  // }, [])

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth/signup/' element={<SignupForm />} />
      <Route path='/auth/login/' element={<LoginForm />} />
      {/* <Route path='/auth/logout/' element={<LogoutCard />} /> */}

      <Route path='/events' element={<InfiniteScroll />} />
      <Route path='/events' element={<ViewEvents />} />


      <Route element={<ProtectedRoutes />}>
        <Route path='/create-event' element={<EventCreationForm />} />
        <Route path='/my-events' element={<ViewYourEvents />} />
        <Route path='/tickets/request-form/:e_id' element={<TicketRequestForm />} />
        <Route path='/my-tickets' element={<PersonalTicketScroll />} />

      </Route>
      <Route path='/play-test' element={
        <div>
          Thank you Jesus
        </div>
      } />
    </Routes>
  )
}

export default RouteElems
