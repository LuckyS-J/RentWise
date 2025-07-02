import axios from 'axios';

const baseURL = 'http://localhost:8000/api/';

export default axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});