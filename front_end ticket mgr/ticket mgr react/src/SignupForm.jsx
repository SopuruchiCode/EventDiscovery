import React from 'react'
import "./signup-form.css"
import { useState, useEffect } from 'react'
import {userSchema} from './js/schema.js'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import  Textcard  from './jsx/Textcard.jsx'
import * as yup from 'yup';

const backend_url = import.meta.env.VITE_BACKEND_URL;

const SignupForm = () => {
  const [success, setSuccess] = useState(false);
  async function submitForm (data){

    const formdata = new FormData();
    Object.entries(data).forEach(([key, value]) =>{
      if (value instanceof FileList){
        if (value > 0){
          formdata.append(key, value[0]);
        }
      }
      else{
        formdata.append(key, value);
      }
    })
    try{
      let res = await fetch(backend_url + '/auth/signup', {
        method: "post",
        body: formdata
      });
      
      const data = await res.json();
      if (data["success"]) {
        setSuccess(true);
      }
    }catch(err){
      console.log(err);
      
    }
  }
  const { register, handleSubmit, formState: { errors }} = useForm({
    resolver: yupResolver(userSchema),
  });
 
  return (
    <div id="info-div">

        {success ? <Textcard text="User created successfully"/> : 
        <form autoComplete="off" onSubmit={handleSubmit(submitForm)}>
            <h3>
              Create Account
            </h3>
            
            <input required placeholder="First name" name="first_name" id="firstname" autoComplete="off" {...register("first_name")}/>
            <span>{errors.first_name?.message}</span>
            <input required placeholder="Last Name" name="last_name" id="lastname" autoComplete="off" {...register("last_name")}/>
            <span> {errors.last_name?.message}</span>
            <input required placeholder="Username" name="username" id="username" autoComplete="new-username" {...register("username")}/>
            <span>{errors.username?.message}</span>
            <input required type="email" placeholder="Email" name="email" id="email" autoComplete="new-email" {...register("email")}/>
            <span>{errors.email?.message}</span>
            <input required type="password" placeholder="Password" name="password" id="password" autoComplete="new-password" {...register("password")}/>
            <span>{errors.password?.message}</span>
            <label htmlFor="profile_pic">
              Select Profile Picture
            </label>
            <input type="file" name="profile_pic" id="profile_pic" accept="image/*" {...register("profile_pic")}/>
            <span>{errors.image?.message}</span>

            {/* <label for="profile_pic" class="file-upload">
            <span>Select Profile Picture</span>
            </label>
            <input type="file" id="profile_pic" name="profile_pic" accept="image/*" hidden /> */}

            <button type="submit">Create Account</button>
        </form>
              }
    </div>
  )
}

export default SignupForm