import axios from 'axios';

const baseURL = 'http://localhost:8000/api/'; // lub Twój adres backendu

export default axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});