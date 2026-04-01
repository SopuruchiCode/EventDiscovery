import Tab from './tab'
import './home.css'
import { AuthContext } from './js/Contexts'
import { useContext } from 'react'

const Home = () => {
  const {user_info} = useContext(AuthContext);
  return (
    <>
      <div className='personalize'>
        
          {/* Welcome {user_info.username} */}
      </div>
      <div className='con-div'>
        <div className='tab-container'>
          <Tab title={"Create Event"} color={"#12860eff"} link={"/create-event"}/>
          <Tab title={"My Events"} color={"#3838dbff"} link={"/my-events"}/>
          <Tab title={"My Tickets"} color={"#b71919ff"} link={"/my-tickets"}/>
          {/* <Tab title={"Attendees"} color={"#8a1f89ff"}/> */}
          <Tab title={"View Events"} color={"#073b43"} link={"/events"}/>
        </div>
      </div>
    </>    
  )
}

export default Home