import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/profile', { withCredentials: true });
                setUser(res.data.user);
            } catch (error) {
                setMessage('Not authenticated');
            }
        };

        fetchProfile();
    }, []);

    return (
        <div>
            {user ? <h1>Welcome, {user.username}</h1> : <p>{message}</p>}
        </div>
    );
};

export default Profile;