import { Link, Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-bold text-indigo-600">AuctionPlatform</span>
                            </Link>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
                                <Link to="/" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                                <Link to="/my-bids" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">My Bids</Link>
                                <Link to="/profile" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
                                <Link to="/create-product" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Sell Item</Link>
                                <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
