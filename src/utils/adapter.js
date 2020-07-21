import axios from 'axios';

const AXIOS_TIMEOUT = 2e4; // wait 20 second

const ax = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: AXIOS_TIMEOUT,
});

export default ax;
