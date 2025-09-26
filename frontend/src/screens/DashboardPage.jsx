import React, { useState, useEffect, useCallback } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [newRestaurant, setNewRestaurant] = useState({ name: '', description: '', address: '' });
  const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: 0, category: 'Main' });
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await manifest.from('Restaurant').find({ 
        filter: { owner: user.id },
        include: ['owner']
      });
      setRestaurants(response.data);
      if (response.data.length > 0) {
        const firstRestaurantId = response.data[0].id;
        setSelectedRestaurantId(firstRestaurantId);
        loadMenuItems(firstRestaurantId);
      }
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  }, [manifest, user.id]);

  const loadMenuItems = async (restaurantId) => {
    try {
        const response = await manifest.from('MenuItem').find({ filter: { restaurant: restaurantId } });
        setMenuItems(prev => ({ ...prev, [restaurantId]: response.data }));
    } catch (error) {
        console.error(`Failed to load menu items for restaurant ${restaurantId}:`, error);
    }
  }

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const created = await manifest.from('Restaurant').create(newRestaurant);
      setRestaurants([created, ...restaurants]);
      setNewRestaurant({ name: '', description: '', address: '' });
    } catch (error) {
      console.error('Failed to create restaurant:', error);
      alert('Could not create restaurant.');
    }
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    if (!selectedRestaurantId) return;
    try {
      const created = await manifest.from('MenuItem').create({ ...newMenuItem, restaurant: selectedRestaurantId });
      setMenuItems(prev => ({
        ...prev,
        [selectedRestaurantId]: [...(prev[selectedRestaurantId] || []), created]
      }));
      setNewMenuItem({ name: '', description: '', price: 0, category: 'Main' });
    } catch (error) {
      console.error('Failed to create menu item:', error);
      alert('Could not create menu item.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FoodieApp Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {user.name} ({user.email})</p>
          </div>
          <div>
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 mr-3">Admin Panel</a>
            <button onClick={onLogout} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">Logout</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Restaurants List & Create Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Restaurant</h2>
              <form onSubmit={handleCreateRestaurant} className="space-y-4">
                <input type="text" placeholder="Restaurant Name" value={newRestaurant.name} onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                <textarea placeholder="Description" value={newRestaurant.description} onChange={(e) => setNewRestaurant({...newRestaurant, description: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                <input type="text" placeholder="Address" value={newRestaurant.address} onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-semibold">Add Restaurant</button>
              </form>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Restaurants</h2>
              {isLoading ? <p>Loading...</p> : restaurants.length === 0 ? <p className="text-gray-500">No restaurants yet.</p> : (
                <ul className="space-y-3">
                  {restaurants.map(r => (
                    <li key={r.id} onClick={() => { setSelectedRestaurantId(r.id); if(!menuItems[r.id]) loadMenuItems(r.id); }} className={`p-3 rounded-md cursor-pointer transition ${selectedRestaurantId === r.id ? 'bg-indigo-100 border-indigo-500 border-l-4' : 'hover:bg-gray-50'}`}>
                      <p className="font-semibold text-gray-900">{r.name}</p>
                      <p className="text-sm text-gray-600">{r.address}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right Column: Menu Items for Selected Restaurant */}
          <div className="lg:col-span-2 space-y-6">
            {selectedRestaurantId && (
              <>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Menu Item to "{restaurants.find(r=>r.id===selectedRestaurantId)?.name}"</h2>
                   <form onSubmit={handleCreateMenuItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Item Name" value={newMenuItem.name} onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md" required />
                        <input type="number" placeholder="Price" value={newMenuItem.price} onChange={(e) => setNewMenuItem({...newMenuItem, price: parseFloat(e.target.value)})} className="w-full p-2 border border-gray-300 rounded-md" step="0.01" min="0" required/>
                        <textarea placeholder="Description" value={newMenuItem.description} onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md md:col-span-2" />
                        <select value={newMenuItem.category} onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md">
                            <option>Appetizer</option>
                            <option>Main</option>
                            <option>Dessert</option>
                            <option>Beverage</option>
                        </select>
                        <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-semibold md:col-span-2">Add Item</button>
                    </form>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Menu</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(menuItems[selectedRestaurantId] || []).length > 0 ? (menuItems[selectedRestaurantId].map(item => (
                        <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-green-600 font-bold">${item.price.toFixed(2)}</p>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                          <p className="text-xs text-indigo-500 font-medium mt-2 uppercase">{item.category}</p>
                        </div>
                    ))) : <p className="text-gray-500 md:col-span-2">No menu items for this restaurant yet.</p>}
                  </div>
                </div>
              </>
            )}
            {!selectedRestaurantId && !isLoading && <div className="bg-white p-6 rounded-lg shadow text-center"><p className="text-gray-500">Select a restaurant to view its menu, or create one to get started.</p></div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;