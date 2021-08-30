import axios from 'axios';

const fetchClient = () => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Create instance
  let instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  });

  instance.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error.response.status === 403 || error.response.status === 401 || error.response.status === 422) {
      console.log("Not Authorized");
      localStorage.removeItem("token");
      window.location.reload();
    }
  });

  return instance;
};

export default fetchClient();