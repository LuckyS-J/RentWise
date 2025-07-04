export const fetchLeases = async (accessToken: string) => {
  const response = await fetch('http://localhost:8000/properties/api/leases/', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch leases');
  }

  return await response.json();
};
