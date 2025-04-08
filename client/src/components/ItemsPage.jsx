import { useState, useEffect } from 'react';
import axios from 'axios';
import ClaimModal from './claimForm';
import ItemCard from './ItemsCard';
import { useAuth } from '../context/AuthContext';

export default function ItemsPage() {
  const { user, isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('lost'); // 'lost', 'found', 'my-reports'
  const [error, setError] = useState(null);

  const [isClaimModal, setClaimModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClaimClick = (item) => {
    setSelectedItem(item);
    setClaimModalOpen(true);
  };

  const closeClaimModal = () => {
    setClaimModalOpen(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    const getItems = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (filter === 'my-reports') {
          if (!isLoggedIn || !user) {
            setError('You must be logged in to view your reports.');
            setItems([]);
            return;
          }

          // Fetch both lost and found items reported by the user
          const [lostItems, foundItems] = await Promise.all([
            axios.get(`http://localhost:5000/api/lost/user/${user.id}`, { withCredentials: true }),
            axios.get(`http://localhost:5000/api/found/user/${user.id}`, { withCredentials: true }),
          ]);

          response = [...lostItems.data, ...foundItems.data];
        } else {
          // Fetch items based on the selected filter (lost or found)
          const { data } = await axios.get(`http://localhost:5000/api/${filter}`, { withCredentials: true });
          response = data;
        }

        setItems(response);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to fetch items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, [filter, isLoggedIn, user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Lost & Found Items</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('lost')}
            className={`px-4 py-2 rounded ${filter === 'lost' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            Lost
          </button>
          <button
            onClick={() => setFilter('found')}
            className={`px-4 py-2 rounded ${filter === 'found' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Found
          </button>
          <button
            onClick={() => setFilter('my-reports')}
            className={`px-4 py-2 rounded ${filter === 'my-reports' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            My Reports
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-red-500">{error}</h3>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium">No items found</h3>
          <p className="text-gray-500 mt-2">Try changing your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} filter={filter} onClaim={handleClaimClick} />
          ))}
        </div>
      )}

      {selectedItem && (
        <ClaimModal
          isOpen={isClaimModal}
          onClose={closeClaimModal}
          itemName={selectedItem.name}
          itemId={selectedItem.id}
        />
      )}
    </div>
  );
}