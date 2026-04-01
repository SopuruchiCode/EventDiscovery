import { useEffect, useRef, useState } from 'react';
import { Eventcard } from './Eventcard.jsx'
import { Spinner } from '../Spinner.jsx';
const backend_url = import.meta.env.VITE_BACKEND_URL;


export default function InfiniteScroll() {
  const [events, setEvent] = useState([]);
  const [next_cursor_data, set_next_data] = useState({})
  const loaderRef = useRef(null);
  const [hasMore, setMore] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const initialLoad = async () => {
    try{
        const res = await fetch(backend_url + '/events/cursor?limit=6',{
        });
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
            if (hasMore && next_cursor_data){
                const {date, time, _id} = next_cursor_data;
                try{
                    const res = await fetch(backend_url + `/events/cursor?limit=6&last_date=${date}&last_time=${time}&last_id=${_id}`,{
                });
                const res_body = await res.json();
                const {data, next_cursor} = res_body;
                setMore(res_body["has_more"])
                setEvent(prev => [...prev, ...data])

                if (res_body["has_more"]) { set_next_data(next_cursor) }
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
            if(entry.isIntersecting && hasMore && next_cursor_data){
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
  },[hasMore, next_cursor_data]);

  return (
    <>
        <div className='div-con'>  
            <div className='container'>
                {events.map((event) => (
                    <Eventcard eventModel={event} key={event._id}/>            
                ))}
                
                <div ref={loaderRef}></div>
            </div>
        </div>
        {hasMore? 
        <Spinner/>: ""
        }
    </>
  )
}