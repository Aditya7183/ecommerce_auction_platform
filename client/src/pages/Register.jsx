import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        location: '',
        pincode: '',
        mobile: '',
        language: 'en'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/register', formData);
            localStorage.setItem('token', response.data.token);
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <div className="grid grid-cols-1 gap-4">
                        <input name="name" type="text" placeholder="Full Name" required className="input-field p-2 border rounded w-full" onChange={handleChange} />
                        <input name="email" type="email" placeholder="Email" required className="input-field p-2 border rounded w-full" onChange={handleChange} />
                        <input name="password" type="password" placeholder="Password" required className="input-field p-2 border rounded w-full" onChange={handleChange} />
                        <input name="mobile" type="tel" placeholder="Mobile" required className="input-field p-2 border rounded w-full" onChange={handleChange} />
                        <div className="grid grid-cols-2 gap-2">
                            <input name="location" type="text" placeholder="Location" required className="input-field p-2 border rounded w-full" onChange={handleChange} />
                            <input name="pincode" type="text" placeholder="Pincode" required className="input-field p-2 border rounded w-full" onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
