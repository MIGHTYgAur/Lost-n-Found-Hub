import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const FounderClaims = () => {
  const { user, isLoggedIn } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const fetchFounderClaims = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/claim/founder/${user.id}`, {
          withCredentials: true,
        });
        setClaims(response.data);
      } catch (err) {
        console.error('Error fetching founder claims:', err);
        setError('Failed to fetch claims. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFounderClaims();
  }, [isLoggedIn, user]);

  const handleStatusChange = async (claimId, status) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/claim/${claimId}`, { status }, {
        withCredentials: true,
      });
      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim.id === claimId ? { ...claim, status: response.data.status } : claim
        )
      );
    } catch (err) {
      console.error('Error updating claim status:', err);
      alert('Failed to update claim status. Please try again.');
    }
  };

  if (!isLoggedIn) {
    return <p className="text-center text-red-500">You must be logged in to view claims for your items.</p>;
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
    return <p className="text-center text-gray-500">No claims have been made for your items yet.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Claims for Your Items</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {claims.map((claim) => (
          <div key={claim.id} className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
            <div className="p-4">
              <h3 className="font-bold text-lg truncate">{claim.foundItem.name}</h3>
              <p className="text-gray-600 text-sm mt-1">Claimant: {claim.claimant.name}</p>
                <p className="text-gray-600 text-sm mt-1">details: {claim.details}</p>
              <p className="text-gray-600 text-sm mt-1">
                 Contact: {claim.contactInfo ? claim.contactInfo : 'Not available until approved'}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Claimed on: {new Date(claim.claimDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm mt-1">Status: {claim.status}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleStatusChange(claim.id, 'APPROVED')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={claim.status === 'APPROVED'}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(claim.id, 'REJECTED')}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={claim.status === 'REJECTED'}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FounderClaims;