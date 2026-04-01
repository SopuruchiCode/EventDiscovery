import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { eventSchema } from './js/schema';
import { getAccessToken, setAccessToken} from './js/TokenStorage.js';
import Textcard from './jsx/Textcard.jsx';
import './css/event-creation-form.css'
const backend_url = import.meta.env.VITE_BACKEND_URL;

const EventCreationForm = () => {
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
  async function submitForm (data){
    const accessToken = await getAccessToken();
    const formdata = new FormData();
    Object.entries(data).forEach(([key, value]) =>{
      if (value instanceof FileList){
        if (value.length > 0){
          formdata.append(key, value[0]);
          
        }
      }
      else{
        formdata.append(key, value);
      }
    })

    try{
      let res = await fetch(backend_url + '/create_event', {
        method: "post",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        body: formdata
      });
      
      const data = await res.json();
      if (data["success"]) {
        setSuccess(true);
      }
      if (data["detail"] === 'Access token has exired') {
        setAccessToken(null);
        alert("Session has expired please try again");
      }
    }catch(err){
      console.log(err);
      
    }
  }
  const { register, handleSubmit, formState: { errors }} = useForm({
    resolver: yupResolver(eventSchema),
  });
  return (
    <div>
      {success ? <Textcard text="Event created successfully"/>:
        <form onSubmit={handleSubmit(submitForm)}>
          <h3> Event Creation Form </h3>
            <div>
                <label>Name</label>
                <input type="text" placeholder="Event name" name="name" required
                  {...register("name")}  />
                <span>{errors.name?.message}</span>
            </div>

            <div>
                <label>Cover Photo</label>
                <input type="file" name="cover_photo_file" 
                {...register("cover_photo_file")}/>
                <span>{errors.cover_photo_file?.message}</span>
            </div>

            

            <div>
                <label>Location</label>
                <input type="text" placeholder="Venue" name="venue" required
                {...register("venue")}  />
                <span>{errors.venue?.message}</span>
            </div>

            <div>
                    <label>Ticket Price</label>
                    <input type="number" placeholder="$" name="ticket_price" required step={0.01} inputMode='decimal'
                    {...register("ticket_price")}/>
                    <span>{errors.ticket_price?.message}</span>
                </div>

            <div >
                <div>
                    <label>Date</label>
                    <input type="date" name="date" required
                    {...register("date")}/>
                    <span>{errors.date?.message}</span>
                </div>
                <div>
                    <label>Time</label>
                    <input type="time" name="time" required {...register("time")} />
                    <span>{errors.time?.message}</span>
                </div>
            </div>

            
                <div>
                    <label>Duration (hours)</label>
                    <input type="number" placeholder="e.g. 2" name="duration" required
                    {...register("duration")}/>
                    <span>{errors.duration?.message}</span>
                </div>
                <div>
                    <label>Capacity</label>
                    <input type="number" placeholder="e.g. 50" name="capacity" required
                    {...register("capacity")}/>
                    <span>{errors.capacity?.message}</span>
                </div>
            

            <div className='submit-div'>
                <button type="submit" id="btn">
                    Create Event
                </button>
            </div>
        </form>
      }
    </div>
  )
}

export default EventCreationForm