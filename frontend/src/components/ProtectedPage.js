import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProtectedPage() {
  const [data, setData] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      return;
    }

    axios
      .get('http://localhost:5000/api/protected', {
        headers: { Authorization: token },
      })
      .then((response) => {
        setData(response.data.message);
      })
      .catch((error) => {
        setError('Failed to fetch protected content.');
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>Protected Page</h2>
      {error ? <p>{error}</p> : <p>{data}</p>}
    </div>
  );
}

export default ProtectedPage;
