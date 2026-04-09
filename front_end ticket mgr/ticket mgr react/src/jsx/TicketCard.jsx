import React from 'react'
import '../css/Eventcard.css'


const backend_url = import.meta.env.VITE_BACKEND_URL;

const randomColor = () => {
        // const colors = ["#12860eff", "#3838dbff", "#b71919ff", "#8a1f89ff", "#073b43"]
        const colors = [
  "#E10600", // bold red
  "#0057FF", // strong blue
  "#00A86B", // vivid green
  "#FF8C00", // deep orange
  "#6A0DAD", // rich purple
  "#00C2FF", // electric cyan
  "#7a6e32ff", // strong yellow
  "#D81B60", // hot pink
  "#1B1B1B", // near black
  "#0B3C5D"  // deep teal
];
        const randint = Math.floor(Math.random() * colors.length)
        // return colors[randint]
        return colors[9]

    
    }
    const randomImg = () => {
        const imgs = [
          "default_1.jpg", "default_2.jpg", "default_3.jpg"
];
        const randint = Math.floor(Math.random() * imgs.length)
        // return imgs[randint]
        return imgs[1]

    
    }
export const TicketCard = ({ticketModel}) => {
  return (
    <div className="body" style={{backgroundColor: randomColor()}}>
    <div className="card">
    <div className="card-cover">
      {/* <img src={backend_url + `/default_cover_photos/${randomImg()}`} alt="Event cover" /> */}
      <img src='https://res.cloudinary.com/dacapbrsq/image/upload/v1775493117/default_1_wqd064.jpg'/>

    </div>

    <div className="card-header">
      <h2>{ticketModel.event_name}</h2>
      <span>📍 {ticketModel.event_venue}</span>
      <div>
        Date: {ticketModel.event_date}
      </div>
      <div>
        Time: {ticketModel.event_time}
      </div>
      <div>
        Code: <span className='code'>{ticketModel.code}</span>
      </div>
      
    </div>
  </div>
</div>
  )
}
