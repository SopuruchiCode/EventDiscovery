import { object, string, number, date, mixed, } from 'yup';
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

export const userSchema = object({
  first_name: string().min(3,"Must be 3 characters long").required(),
  last_name: string().min(3, "Must be 3 characters long").required(),
  username: string().min(5, "Username must be 5 long").required(),
  email: string().email(),
  password: string().required(),
  profile_pic: mixed()
});

export const eventSchema = object({
  name: string().min(5, "Minimum of 5 characters").required(),
  venue: string().required(),
  cover_photo_file: mixed(),
  duration: number().positive("Should be positive").min(0),
  ticket_price: number().positive("Should be positive").min(0),
  capacity: number().positive().min(1),
  date: string().matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  time: string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format")

})

// export default userSchema;