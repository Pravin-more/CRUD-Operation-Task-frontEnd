"use client"
import React, { useEffect, useState } from 'react';
import { Card, Image, Button } from 'antd';
import { useRouter } from 'next/navigation';
import './DetailStyles.css';

const Detail = ({ params }) => {
    console.log(params);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/${params.detail}`);
                if (!response.ok) {
                    throw new Error('User not found');
                }
                const userData = await response.json();
                console.log(userData)
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error.message);
            }
        };

        fetchUser();
    }, [params.detail]);

    const handleBack = () => {
        setUser(null);
        router.back();
    };

    return (
        <div className="detail-container">
            {user ? (
                <Card title="User Detail" bordered={false} className="detail-card">
                    <div className="detail-item">
                        <h4>Name:</h4>
                        <p>{user.name}</p>
                    </div>
                    <div className="detail-item">
                        <h4>Email:</h4>
                        <p>{user.details.email}</p>
                    </div>
                    <div className="detail-item">
                        <h4>Mobile no:</h4>
                        <p>{user.details.mobile_no}</p>
                    </div>
                    <div className="detail-item">
                        <h4>Address:</h4>
                        <p>{user.address}</p>
                    </div>
                    <div className="detail-item">
                        <h4>Photo:</h4>
                        <Image
                            width={200}
                            src={user.photo}
                            alt={user.name}
                        />
                    </div>
                    <div className="detail-item">
                        <Button type="primary" onClick={handleBack}>Back</Button>
                    </div>
                </Card>
            ) : (
                <p>Loading...</p>
            )}

        </div>
    );
};

export default Detail;
