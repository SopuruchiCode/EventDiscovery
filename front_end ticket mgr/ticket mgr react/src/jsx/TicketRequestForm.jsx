import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWithAuth } from '../js/TokenStorage';
import '../css/ticket-request-form.css'
const backend_url = import.meta.env.VITE_BACKEND_URL;
const DJANBANK = "DJANBANK"

export const TicketRequestForm = (ticket_request_model) => {
    const {e_id} = useParams();
    const [event, UpdateEvent] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try{
                const res = await getWithAuth(backend_url+`/get-event-data/${e_id}`);
                const data = await res.json();
                if (res.ok){
                    UpdateEvent(data);
                }                
            }catch(err){
                console.log(err)
            }
        }
        
        getData();
        }
    ,[]
    )
    const submitFunc = async(e) => {
        e.preventDefault()
        let data = {
            event_id: e_id,
            pmt_opt: document.getElementsByName("payment_opt")[0].value
        }
        
        const res = await getWithAuth(
            backend_url+`/payment/pmt_info`,{
                method: "post",
                body : JSON.stringify(data)
            }
        )
        const {new_url} = await res.json();
        // navigate(new_url);   didnt work as expected
        location.replace(new_url)



    }

  return (
    <>
        <div>
            <form onSubmit={submitFunc}>
                <h3>Ticket Request Form</h3>
                <div>
                    <label>Name</label>
                    <input type="text" placeholder="Event name" required value={event.name} disabled/>
                </div>

                <div>
                    <label>Location</label>
                    <input type="text" placeholder="Venue" required value={event.venue} disabled/>
                </div>

                <div >
                    <div>
                        <label>Date</label>
                        <input type="date" required value={event.date} disabled/>
                    </div>
                    <div>
                        <label>Time</label>
                        <input type="time" required value={event.time} disabled/>
                    </div>
                </div>
                <div>
                <label>Ticket Price</label>
                    <input type="text" required value={event.ticket_price} disabled/>
                </div>

                Payment Options
                <div>
                    <div>
                        <label>DJANBANK</label>
                        <input className="radio" type="radio" name="payment_opt" value={DJANBANK} required></input>
                    </div>
                    
                    <div>
                        <label>PLACEHOLDER</label>
                        <input className="radio" type="radio" name="payment_opt" value={"PLK"} required></input>
                    </div>
                </div>
                <div className='payment-div'>
                    <button> Pay </button>
                </div>
                 
            </form>
        </div>
    </>
  )
}
