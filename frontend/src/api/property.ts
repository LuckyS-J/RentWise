export const fetchProperties = async (accessToken: string) => {
  const response = await fetch('http://localhost:8000/properties/api/', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }

  return await response.json();
};