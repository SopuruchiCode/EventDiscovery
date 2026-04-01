import '../css/Eventcard.css'
import { Link } from 'react-router-dom';

const backend_url = import.meta.env.VITE_BACKEND_URL;
export const Eventcard = ({eventModel, get_ticket=true}) => {
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
  return (
<div className="body" style={{backgroundColor: randomColor()}}>
  <div className="card">
    <div className="card-cover">
      <img src={backend_url + `/default_cover_photos/${randomImg()}`} alt="Event cover" />
    </div>

    <div className="card-header">
      <h2>{eventModel.name}</h2>
      <span>📍 {eventModel.venue}</span>
    </div>
  </div>

    <div className="card-body">
      <div className="info-row">
        <div>Date</div>
        <span>{eventModel.date}</span>
      </div>
      <div className="info-row">
        <div>Time</div>
        <span>{eventModel.time}</span>
      </div>
      <div className="info-row">
        <div>Duration</div>
        <span>{eventModel.duration} Hrs</span>
      </div>
      <div className="info-row">
        <div>Capacity</div>
        <span>{eventModel.capacity}</span>
      </div>

      <div className="info-row">
        <div>Ticket Price</div>
        <span>$ {eventModel.ticket_price}</span>
      </div>

      <div className="progress">
        <div className="progress-label">
          <span>Slots Filled</span>
          <span>{eventModel.slots_filled} / {eventModel.capacity}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    {get_ticket? 
    <div style={{textAlign:"center", margin: "2px"}}>
      <Link to={`/tickets/request-form/${eventModel._id}`}><button className='ticket-btn' > Get Ticket </button></Link>
    </div>
    : ""}
    </div>
</div>
  )
}
