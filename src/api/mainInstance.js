import axios from 'axios';

const mainInstance = axios.create({
  baseURL: 'http://localhost:3001'
})

const mainInstanceRetry = axios.create({
  baseURL: 'http://localhost:3001'
})

mainInstance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken) config.headers.Authorization = 'Bearer ' + accessToken;
      return config;
  },
  error => {
    Promise.reject(error)
});

mainInstanceRetry.interceptors.request.use(
  config => {
    const refreshToken = localStorage.getItem('refreshToken');
    if(refreshToken) { 
      config.headers.Authorization = 'Bearer ' + refreshToken 
      config.headers.withCredentials = true;
    }
      return config;
  },
  error => {
    Promise.reject(error)
});

mainInstance.interceptors.response.use((response) => {
  return response
}, async error => {
    const refreshToken = localStorage.getItem('refreshToken');
    if(refreshToken) {
      const originalRequest = error.config;
      if(error.response && (error.response.status === 401 || error.response.status === 403)) {
        return await mainInstanceRetry.get('/auth/refresh')
        .then(async (response) => {
          if(response.status === 200) {
            originalRequest.headers.Authorization = 'Bearer ' + response.data.accessToken;
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            return await axios(originalRequest);
          }
        })
        .catch((error) => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location = "/auth";
        })
      }
    }
    return Promise.reject(error);
  }
)

export default mainInstance;