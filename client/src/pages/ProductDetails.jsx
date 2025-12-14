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
    const [showStopModal, setShowStopModal] = useState(false);

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

    const currentHighestBid = bids.length > 0 ? Math.max(...bids.map(b => b.bidded_amount)) : product.base_price;

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwner = product && currentUser && product.user_id === currentUser.id;
    const isExpired = product && new Date(product.deadline) < new Date();

    const handleStopAuction = async (action) => {
        if (!confirm(`Are you sure you want to ${action} this auction?`)) return;
        try {
            await axios.post(`/products/${id}/stop`, { action }); // action: 'sell' or 'delete'
            if (action === 'delete') {
                alert('Auction deleted');
                window.location.href = '/';
            } else {
                alert('Auction stopped and sold!');
                fetchData(); // Refresh to show ended state
            }
            setShowStopModal(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
            {/* Stop Auction Modal */}
            {showStopModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold mb-4 text-gray-900">Stop Auction</h3>
                        <p className="mb-6 text-gray-600">Choose an action:</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleStopAuction('sell')}
                                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium"
                            >
                                Sell to Highest Bidder
                            </button>
                            <button
                                onClick={() => handleStopAuction('delete')}
                                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 font-medium"
                            >
                                Delete Auction
                            </button>
                            <button
                                onClick={() => setShowStopModal(false)}
                                className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 mt-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-1/2 bg-gray-200 flex flex-col">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={`http://localhost:3000/${product.images[0]}`}
                            alt={product.title}
                            className="w-full h-auto max-h-[600px] object-contain bg-gray-100"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-96 text-gray-500">No Image Available</div>
                    )}

                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-4">Seller Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 block">Name</span>
                                <span className="font-medium text-gray-900">{product.seller_name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Location</span>
                                <span className="font-medium text-gray-900">{product.seller_location}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-gray-500 block">Contact</span>
                                <span className="font-medium text-gray-900">{product.seller_mobile}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-8 w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{product.category}</div>
                            <h1 className="mt-1 text-4xl font-extrabold text-gray-900 leading-tight">{product.title}</h1>
                        </div>
                        {isOwner && !isExpired && (
                            <button
                                onClick={() => setShowStopModal(true)}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow"
                            >
                                STOP Auction
                            </button>
                        )}
                    </div>

                    <p className="mt-4 text-gray-600">{product.description}</p>

                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Base Price:</span>
                            <span className="text-2xl font-bold text-gray-900">₹{product.base_price}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-gray-600">Product Age:</span>
                            <span className="text-lg font-medium text-gray-900">{product.product_age || 'N/A'}</span>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <span className="text-indigo-600 font-medium">Current Highest Bid:</span>
                            <span className="text-3xl font-bold text-indigo-600">₹{currentHighestBid}</span>
                        </div>
                    </div>

                    {isExpired ? (
                        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-yellow-800">Auction Ended</h3>
                                    <div className="mt-2 text-yellow-700">
                                        <p>
                                            Winner: {bids.length > 0 ? (bids.sort((a, b) => b.bidded_amount - a.bidded_amount)[0].bidder_name) : 'No Bids'}
                                        </p>
                                        {bids.length > 0 && <p className="font-bold">Sold for ₹{currentHighestBid}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
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
                    )}

                    <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Bid History ({bids.length})</h3>
                        <div className="flow-root">
                            <ul className="-my-5 divide-y divide-gray-200">
                                {bids.sort((a, b) => b.bidded_amount - a.bidded_amount).slice(0, 5).map((bid) => (
                                    <li key={bid.id} className="py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {bid.bidder_name || 'Unknown User'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(bid.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                                ₹{bid.bidded_amount}
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
