import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTimeLeft = (deadline) => {
        const now = new Date();
        const end = new Date(deadline);
        const diff = end - now;
        if (diff <= 0) return 'Expired';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        return `${days}d ${hours}h left`;
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Live Auctions</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                        <div className="h-48 bg-gray-200 relative">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={`http://localhost:3000/${product.images[0]}`}
                                    alt={product.title}
                                    className="w-full h-full object-center object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                            <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full uppercase tracking-wide">
                                {product.category}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-xl font-semibold text-gray-900 truncate">{product.title}</h3>
                                <span className="text-sm font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded">
                                    {calculateTimeLeft(product.dead_line)}
                                </span>
                            </div>
                            <p className="mt-2 text-gray-600 line-clamp-2">{product.description}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Base Price</p>
                                    <p className="text-lg font-bold text-indigo-600">₹{product.base_price}</p>
                                </div>
                                <Link
                                    to={`/product/${product.id}`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    View & Bid
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
