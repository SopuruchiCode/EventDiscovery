import React from 'react'
import { Link } from 'react-router-dom';
import './Tab.css'

const Tab = ({title, color, link}) => {
  return (
    <div className='tab' style={{backgroundColor: color}}>
        <Link to={link}>{title}</Link>
    </div>
  )
}

export default Tab