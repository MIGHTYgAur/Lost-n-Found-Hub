import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserClaims = () => {
  const { user, isLoggedIn } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const fetchUserClaims = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/claim/user/${user.id}`, {
          withCredentials: true,
        });
        setClaims(response.data);
      } catch (err) {
        console.error('Error fetching user claims:', err);
        setError('Failed to fetch claims. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserClaims();
  }, [isLoggedIn, user]);

  if (!isLoggedIn) {
    return <p className="text-center text-red-500">You must be logged in to view your claims.</p>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (claims.length === 0) {
    return <p className="text-center text-gray-500">You have not made any claims yet.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Claims</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {claims.map((claim) => (
          <div key={claim.id} className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img
                src={claim.foundItem.imageUrl}
                alt={claim.foundItem.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg truncate">{claim.foundItem.name}</h3>
              <p className="text-gray-600 text-sm mt-1">Location: {claim.foundItem.location}</p>
              <p className="text-gray-600 text-sm mt-1">Status: {claim.status}</p>
              <p className="text-gray-500 text-xs mt-2">
                Claimed on: {new Date(claim.claimDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserClaims;