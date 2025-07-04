import axios from 'axios'

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:8000/users/api/token/', {
      username,
      password,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || 'Login failed. Please try again.'
    );
  }
};