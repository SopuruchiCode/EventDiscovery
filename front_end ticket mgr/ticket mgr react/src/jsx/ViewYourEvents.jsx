import { useEffect, useRef, useState } from 'react';
import {getWithAuth} from '../js/TokenStorage.js'
import { Eventcard } from './Eventcard.jsx'
import { Spinner } from '../Spinner.jsx';
import '../css/view_your_event.css'
const backend_url = import.meta.env.VITE_BACKEND_URL;


const ViewYourEvents = () => {
    const [events, setEvent] = useState([]);
    const [next_cursor_data, set_next_data] = useState({})
    const [has_more, setMore] = useState(null)
    const loaderRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const initialLoad = async () => {
        try{
            const res = await getWithAuth(backend_url + '/my_events/cursor?limit=6')
            const res_body = await res.json()
            const {data, next_cursor} = res_body
            setMore(res_body["has_more"])
            setEvent([...data])

            if (res_body["has_more"]) { set_next_data(next_cursor)}
        }catch(err){
            console.log(err)
        } 
    }

    const LoadMore = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try{
            if (has_more && next_cursor_data){
                const {date, time, _id} = next_cursor_data;
                try{
                    const res = await getWithAuth(backend_url + `/my_events/cursor?limit=6&last_date=${date}&last_time=${time}&last_id=${_id}`)

                    const res_body = await res.json() 
                    const {data, next_cursor} = res_body;
                    setMore(res_body["has_more"]);
                    if(res_body["has_more"]){set_next_data(next_cursor)}
                    setEvent(prev => [...prev, ...data])
                }catch(err){
                    console.log(err)
                }
            } 
        }
        finally{
            setIsLoading(false)
        }
    }
    
    useEffect(() => {
    initialLoad();

  }, []);

    useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
            if(entry.isIntersecting && has_more && next_cursor_data){
                LoadMore()
            }
        },
        {
            root: null,
            rootMargin: '150px',
            threshold: 0,
        }
    );
    if (loaderRef.current){
        observer.observe(loaderRef.current);
    }
    return () => observer.disconnect();
  },[has_more, next_cursor_data]);

  return (
    <>
        <div className='div-con'>  
            <div className='container'>
                {events.map((event) => (
                    <Eventcard eventModel={event} key={event._id} get_ticket={false}/>            
                ))}
                <div ref={loaderRef}></div>
            </div>
        </div>
        {has_more? 
        <Spinner/>: ""
        }
        
    </>
  )
}

export default ViewYourEvents