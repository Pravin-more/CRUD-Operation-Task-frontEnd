'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import styles from './Register.module.css';
import { Button, notification } from 'antd';
import { useRouter } from 'next/navigation';

const Register = ({ searchParams }) => {
    // console.log("Register", searchParams.id)
    const [selectedId, setSelectedId] = useState();

    const router = useRouter();
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        mobileNo: '',
        address: '',
        photo: null,
        botCheck: '',
        loadTime: '',
    });

    useEffect(() => {
        const id = searchParams.id;
        setSelectedId(id || '');
        setFormData(prevFormData => ({
            ...prevFormData,
            loadTime: new Date().toISOString(), // Set form load time
        }));
        if (id) {
            // Fetch data for update if selectedId is available
            fetchDataForUpdate(id);
        }
    }, [searchParams.id]);

    const fetchDataForUpdate = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user data for update');
            }
            const userData = await response.json();
            console.log(userData)
            setFormData({
                userName: userData.name,
                email: userData.details.email,
                mobileNo: userData.details.mobile_no,
                address: userData.address,
                photo: userData.photo,
                botCheck: '',
                loadTime: new Date().toISOString(), // Set form load time
            });
        } catch (error) {
            console.error('Error fetching user data for update:', error.message);
        }
    };

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo') {
            setFormData({ ...formData, photo: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        setErrors({ ...errors, [name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.userName) {
            newErrors.userName = 'User name is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email is not valid';
        }
        if (!formData.mobileNo) {
            newErrors.mobileNo = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobileNo)) {
            newErrors.mobileNo = 'Mobile number must be exactly 10 digits';
        }
        if (!formData.address) {
            newErrors.address = 'Address is required';
        }
        if (!formData.photo) {
            newErrors.photo = 'Photo is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        const data = new FormData();
        data.append('userName', formData.userName);
        data.append('email', formData.email);
        data.append('mobileNo', formData.mobileNo);
        data.append('address', formData.address);
        data.append('photo', formData.photo);
        data.append('botCheck', formData.botCheck);
        data.append('loadTime', formData.loadTime);

        let response;
        if (selectedId && searchParams.id) {
            data.append('id', selectedId);

            response = await fetch(`http://localhost:5000/api/updateUser/${selectedId}`, {
                method: 'PUT',
                body: data,
            });

        } else {
            response = await fetch('http://localhost:5000/api/saveUser', {
                method: 'POST',
                body: data,
            });
        }

        if (response.status === 200) {
            // console.log('Form submitted successfully', response);
            notification.success({
                message: 'Success',
                description: 'Form submitted successfully',
            });
            router.push("/table")
            setFormData({
                userName: '',
                email: '',
                mobileNo: '',
                address: '',
                photo: null,
                botCheck: '',
                loadTime: '',
            })
        } else {
            console.error('Form submission failed');
            notification.error({
                message: 'Error',
                description: 'Form submission failed',
            });
        }
    };
    const handleBack = () => {
        router.push('/table');

    }
    return (
        <>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <h3>Registration form</h3>
                </div>
                <div className={styles.formGroup}>
                    <label>User Name</label>
                    <input type="text" name="userName" value={formData.userName} onChange={handleChange} className={styles.input} />
                    {errors.userName && <p className={styles.error}>{errors.userName}</p>}
                </div>
                <div className={styles.formGroup}>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} />
                    {errors.email && <p className={styles.error}>{errors.email}</p>}
                </div>
                <div className={styles.formGroup}>
                    <label>Mobile No</label>
                    <input type="number" name="mobileNo" value={formData.mobileNo} onChange={handleChange} className={styles.input} />
                    {errors.mobileNo && <p className={styles.error}>{errors.mobileNo}</p>}
                </div>
                <div className={styles.formGroup}>
                    <label>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className={styles.input} />
                    {errors.address && <p className={styles.error}>{errors.address}</p>}
                </div>
                <div className={styles.formGroup}>
                    <label>Photo</label>
                    <input type="file" name="photo" onChange={handleChange} className={styles.fileInput} />
                    {errors.photo && <p className={styles.error}>{errors.photo}</p>}
                </div>
                <div className={styles.formGroup} style={{ display: 'none' }}>
                    <label>Do not fill this field</label>
                    <input
                        type="checkbox"
                        name="botCheck"
                        value={formData.botCheck}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup} style={{ display: 'none' }}>
                    <label>Form Load Time</label>
                    <input
                        type="hidden"
                        name="loadTime"
                        value={formData.loadTime}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
            <div className={styles.BackButton}>
                <Button type="primary" onClick={handleBack}>Back</Button>
            </div>
        </>
    );
};

export default Register;
