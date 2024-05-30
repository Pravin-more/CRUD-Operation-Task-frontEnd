"use client"
import React, { useEffect, useState } from 'react';
import { Table, Button, notification, Card } from 'antd';
import { useRouter } from 'next/navigation';
import './TableStyles.css';

const Tables = () => {
    const router = useRouter();
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/getUsersWithDetails");
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const userData = await response.json();
            console.log(userData)
            setData(userData);
        } catch (error) {
            console.error('Error fetching users:', error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    console.log("data***", data)

    const handleView = (id) => {
        router.push(`/table/${id}`);
    };

    const handleEdit = (id) => {
        router.push(`/register?id=${id}`);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/deleteUser/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'data deleted successfully',
                });
            }
            fetchData();

        } catch (error) {
            console.error('Error deleting user:', error.message);
            notification.error({
                message: 'Error',
                description: 'Error deleting user',
            });
        }
    };

    const columnsFirstTable = [
        {
            title: 'Index',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
            render: (text, record) => record.userName || record.name,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Mobile No',
            dataIndex: 'mobileNo',
            key: 'mobileNo',
        },
        {
            title: 'Image',
            dataIndex: 'photo',
            key: 'photo',
            render: (text, record) => <img src={record.photo} alt={record.userName} style={{ width: '50px', height: '50px' }} />,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button type="link" onClick={() => handleView(record.id)}>View</Button>
                    <Button type="link" onClick={() => handleEdit(record.id)}>Edit</Button>
                    <Button type="link" onClick={() => handleDelete(record.id)}>Delete</Button>
                </span>
            ),
        },
    ];

    const handleAdd = () => {
        router.push('/register');

    }

    return (
        <>
            <div className='container-table'>
                {/* <div className='handleAddBtn'>
                    <Button type="primary" onClick={handleAdd}>Create New User</Button>
                </div> */}
                <div className="table-container">
                    <Card className="table-card">
                        <div className='handleAddBtn'>
                            <h3>User Table</h3>
                            <Button type="primary" onClick={handleAdd}>Create New User</Button>
                        </div>
                        <Table
                            columns={columnsFirstTable}
                            dataSource={data}
                            rowKey="id"
                            pagination={false}
                            className="custom-table"
                        />
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Tables;
