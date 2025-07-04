export const fetchPayments = async (accessToken: string) => {
  const response = await fetch('http://localhost:8000/properties/api/payments/', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch payments');
  }

  return await response.json();
};
