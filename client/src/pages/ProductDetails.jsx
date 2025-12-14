import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [prodRes, bidsRes] = await Promise.all([
                axios.get(`/products/${id}`),
                axios.get(`/bids/product/${id}`)
            ]);
            setProduct(prodRes.data);
            setBids(bidsRes.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        if (!bidAmount) return;

        // Basic validation: Bid must be higher than base price
        // Note: Ideally backend should enforce higher than max bid.
        // For now, we trust the user/backend validation.

        try {
            await axios.post(`/bids/product/${id}`, { amount: parseFloat(bidAmount) });
            setBidAmount('');
            fetchData(); // Refresh bids
        } catch (err) {
            alert(err.response?.data?.message || 'Bid failed');
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!product) return <div className="text-center py-10 text-red-500">{error || 'Product not found'}</div>;

    const currentHighestBid = bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : product.base_price;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-1/2 bg-gray-200">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={`http://localhost:3000/${product.images[0]}`}
                            alt={product.title}
                            className="w-full h-96 object-center object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-96 text-gray-500">No Image Available</div>
                    )}
                </div>
                <div className="p-8 w-full">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{product.category}</div>
                    <h1 className="mt-1 text-4xl font-extrabold text-gray-900 leading-tight">{product.title}</h1>
                    <p className="mt-4 text-gray-600">{product.description}</p>

                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Base Price:</span>
                            <span className="text-2xl font-bold text-gray-900">₹{product.base_price}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-indigo-600 font-medium">Current Highest Bid:</span>
                            <span className="text-3xl font-bold text-indigo-600">₹{currentHighestBid}</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-900">Place a Bid</h3>
                        <form onSubmit={handleBidSubmit} className="mt-3 flex gap-4">
                            <input
                                type="number"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                placeholder={`Enter more than ₹${currentHighestBid}`}
                                min={currentHighestBid + 1}
                                required
                                className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Bid Now
                            </button>
                        </form>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Bid History ({bids.length})</h3>
                        <div className="flow-root">
                            <ul className="-my-5 divide-y divide-gray-200">
                                {bids.sort((a, b) => b.amount - a.amount).slice(0, 5).map((bid) => (
                                    <li key={bid.id} className="py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {bid.User ? bid.User.name : 'Unknown User'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(bid.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                                ₹{bid.amount}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                                {bids.length === 0 && <li className="py-4 text-gray-500 text-sm">No bids yet. Be the first!</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
