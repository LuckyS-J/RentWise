export const loginUser = async (username: string, password: string) => {
  const response = await fetch('http://localhost:8000/users/api/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return await response.json();
};