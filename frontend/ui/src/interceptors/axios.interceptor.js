export const requestInterceptor = (request) => {   
    //  const auth = {
    //     username: "admin",
    //     password: "admin"
    // }
    // request.auth = auth
    request.credentials = true
    //console.log("🚀 ~ file: axios.interceptor.js:2 ~ requestInterceptor ~ request:", request)
    return request
  }

  export const responseInterceptor = (response) => {   
    //console.log("🚀 ~ file: axios.interceptor.js:2 ~ responseInterceptor ~ response:", response)
    return response
  }

export default requestInterceptor