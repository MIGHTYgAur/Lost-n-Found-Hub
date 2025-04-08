import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth
const ClaimFormModal = ({ isOpen, onClose, itemId, itemName }) => {
    const [secretDetails, setSecretDetails] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth(); 

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      
      try {
        // Simulate API call to submit claim
        const userId = user.id;
        console.log(userId, itemId, secretDetails, contactInfo);
        const response = await axios.post('http://localhost:5000/api/claim', {
            itemId,
            userId,
            secretDetails,
            contactInfo
            }, {
            withCredentials: true,  
        });
        if (response.status !== 201) {
            throw new Error('Failed to submit claim');
        }
        // Reset form
        setSecretDetails('');
        setContactInfo('');
        // Close modal with success message
        alert('Claim submitted successfully! The owner will review your claim and contact you if approved.');
        onClose();
        
      } catch (error) {
        console.error('Error submitting claim:', error);
        alert('Failed to submit claim. Please try again.');
      } finally {
        setSubmitting(false);
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-full overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Claim Item: {itemName}</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              To claim this item, please provide identifying details that only the true owner would know, 
              along with your contact information.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="secretDetails">
                  Secret Details (Only the owner would know)
                </label>
                <textarea
                  id="secretDetails"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="4"
                  value={secretDetails}
                  onChange={(e) => setSecretDetails(e.target.value)}
                  placeholder="Describe specific details about the item that only you as the owner would know..."
                  required
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactInfo">
                  Contact Information
                </label>
                <textarea
                  id="contactInfo"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Your name, email, phone number, and preferred contact method..."
                  required
                ></textarea>
              </div>
              
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default ClaimFormModal;