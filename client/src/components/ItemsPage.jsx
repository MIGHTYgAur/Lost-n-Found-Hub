import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ItemCard from './ItemsCard'; // Assuming you have an ItemCard component to display each item

// Sample data to simulate API response
const sampleItems = [
  {
    id: 1,
    name: "Blue Smartphone",
    description: "Found a blue smartphone with cracked screen near the central library. Has a photo of a dog as wallpaper.",
    category: "Electronics",
    dateFound: "2025-04-01T10:30:00Z",
    location: "Central Library",
    photoUrl: "/api/placeholder/400/300",
    type: "found"
  },
  {
    id: 2,
    name: "Gold Watch",
    description: "Lost my grandfather's gold watch somewhere in the park. It has an inscription on the back.",
    category: "Accessories",
    dateFound: "2025-04-02T14:15:00Z",
    location: "City Park",
    photoUrl: "/api/placeholder/400/300",
    type: "lost"
  },
  {
    id: 3,
    name: "Student ID Card",
    description: "Found a student ID card for Sarah Johnson near the science building.",
    category: "Documents",
    dateFound: "2025-04-03T09:45:00Z",
    location: "Science Building",
    photoUrl: "/api/placeholder/400/300",
    type: "found"
  },
  {
    id: 4,
    name: "Laptop Bag",
    description: "Lost a black laptop bag containing a MacBook and charger in the university cafeteria.",
    category: "Electronics",
    dateFound: "2025-04-01T12:00:00Z",
    location: "University Cafeteria",
    photoUrl: "/api/placeholder/400/300",
    type: "lost"
  },
  {
    id: 5,
    name: "House Keys",
    description: "Found a set of house keys with a red keychain near the bus stop on Main Street.",
    category: "Keys",
    dateFound: "2025-04-04T16:30:00Z",
    location: "Main Street Bus Stop",
    photoUrl: "/api/placeholder/400/300",
    type: "found"
  },
  {
    id: 6,
    name: "Prescription Glasses",
    description: "Lost my prescription glasses with black frames somewhere in the library or on the way there.",
    category: "Accessories",
    dateFound: "2025-04-02T11:20:00Z",
    location: "Library Area",
    photoUrl: "/api/placeholder/400/300",
    type: "lost"
  }
];


// Mock API call function
const fetchItems = async (filter) => {
 try{
    const response = await axios.get(`http://localhost:5000/api/${filter}`,{}, {
        withCredentials: true,
    })
    return response.data;
}
catch(error){
    console.error("Error fetching items:", error);
    return sampleItems; // Return sample data in case of error

};
}

// Main component
export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('lost');      //  'lost', 'found'

  useEffect(() => {
    const getItems = async () => {
      setLoading(true);
      try {
        const data = await fetchItems(filter);
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, [filter]);

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
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium">No items found</h3>
          <p className="text-gray-500 mt-2">Try changing your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} filter={filter}/>
          ))}
        </div>
      )}
    </div>
  );
}