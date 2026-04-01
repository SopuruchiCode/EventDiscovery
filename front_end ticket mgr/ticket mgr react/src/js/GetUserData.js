// import { getAccessToken, setAccessToken } from './js/TokenStorage.js'

// export const getData = async () => {
//       const accessToken = await getAccessToken();
//       try{
//         const res = await fetch(backend_url + `/user_data`, {
//           headers: {
//             "Authorization": "Bearer " + accessToken
//         }
//         });
//         if (res.status === 401){
//           setAccessToken(null);
//           renewTokenFunc(true);
//         }
//         const data = await res.json();
//         updateUserInfo(data); 
//       }catch(err){
//         console.log(err)
//       }
// }