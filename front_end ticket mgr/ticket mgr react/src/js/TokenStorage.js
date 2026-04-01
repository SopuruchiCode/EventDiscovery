const backend_url = import.meta.env.VITE_BACKEND_URL;


let access_token = null;
let isLoggedIn = null;

let isRefreshing = false;
let refreshPromise = null;

//'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTI2ZmJhMDEyYjZhOTAxZjQwOWQ1M2UiLCJpYXQiOjE3NjQ2OTY3MzMsImV4cCI6MTc2NDY5NzAzMywidHlwZSI6ImFjY2VzcyIsInNjb3BlcyI6W119.tcE87l3jCS7IUVffKJHgml6EfzcwKIeU9FDld3E405A'

export function setAccessToken(token) {
    access_token = token;
}
// export function checkLoginState(){
//     return isLoggedIn
// }
// export function setLoginState(state) {
//     isLoggedIn = state
// }
export const getAccessToken = async () => {
    if (access_token === null){
        try{
            const res = await fetch(`${backend_url}/auth/renew-access-token`, {
                credentials: "include",
                method: "post",
            });
            if (res.status >= 400){
                //login again
                
                isLoggedIn = false;
                // alert("You need to login again");
                setAccessToken(null);
            };
            if(res.ok){
                const data = await res.json();
                if (data["access_token"]){
                    setAccessToken(data["access_token"]);

                    isLoggedIn = true;
                }
            }
        }
        catch(err){
            setAccessToken(null);
            console.log(err);
            return access_token            
        }
    }
    return access_token
}


export const getWithAuth = async (url, options = {}) => {
    let access_token = await getAccessToken();
    // if (!isLoggedIn){throw new Error("Session Expired")};
    if (!access_token){throw new Error("Session Expired")};

    const makeRequest = async (token) =>{
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        })
    }

    let response = await makeRequest(access_token)
    if (response.status !== 401){
        return response;
    }

    if (!isRefreshing){
        isRefreshing = true;
        setAccessToken(null);
        refreshPromise = getAccessToken().then((newToken) => {return newToken}).finally(() => {isRefreshing = false})

    }

    const newToken = await refreshPromise;

    if (!newToken){
        isLoggedIn = false;
        throw new Error("Session Expired")
    }

    return makeRequest(newToken)
}