import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000, // 10 sec timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(config => {
  const loggedUserJSON = localStorage.getItem('loggedInUser');
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api