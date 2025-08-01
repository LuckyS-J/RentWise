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

export const addProperty = async (data: any, accessToken: string) => {
  const response = await fetch('http://localhost:8000/properties/api/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to add property');
  }

  return await response.json();
};

export const updateProperty = async (id: number, data: any, token: string) => {
  const response = await fetch(`http://localhost:8000/properties/api/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update property');
  }

  return await response.json();
};

export const deleteProperty = async (id: number, token: string) => {
  const response = await fetch(`http://localhost:8000/properties/api/${id}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete');
  }
  return response;
};