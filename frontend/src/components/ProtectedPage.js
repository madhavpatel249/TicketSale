import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProtectedPage() {
  const [data, setData] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in');
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:5000/api/protected', {
        headers: { Authorization: token }
      })
      .then(response => setData(response.data.message))
      .catch(error => {
        setError('Access denied');
        console.error(error);
      });
  }, [navigate]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Protected Content</h2>
      <p>{data}</p>
    </div>
  );
}

export default ProtectedPage;
