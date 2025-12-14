import { useState, useEffect } from 'react';
import axios from '../api/axios';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [wonProducts, setWonProducts] = useState([]);
    const [soldProducts, setSoldProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [profRes, wonRes, soldRes] = await Promise.all([
                    axios.get('/user/profile'),
                    axios.get('/products/user/won'),
                    axios.get('/products/user/sold')
                ]);
                setProfile(profRes.data);
                setWonProducts(wonRes.data);
                setSoldProducts(soldRes.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!profile) return <div className="text-center py-10">No profile found</div>;

    const ProductList = ({ title, items, emptyMsg }) => (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
            </div>
            <ul className="divide-y divide-gray-200">
                {items.length > 0 ? items.map(product => (
                    <li key={product.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-indigo-600 truncate">{product.name}</div>
                            <div className="ml-2 flex-shrink-0 flex">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    ₹{product.sold_price || product.base_price}
                                </span>
                            </div>
                        </div>
                    </li>
                )) : <li className="px-4 py-4 text-gray-500 text-sm">{emptyMsg}</li>}
            </ul>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and preferences.</p>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Full name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.name}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.email}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.mobile}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.location}, {profile.pin_code}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Language</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 uppercase">{profile.language}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <ProductList title="Bids Won" items={wonProducts} emptyMsg="You haven't won any auctions yet." />
            <ProductList title="Items Sold" items={soldProducts} emptyMsg="You haven't sold any items yet." />
        </div>
    );
};

export default Profile;
