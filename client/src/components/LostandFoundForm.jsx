import React, { useState } from 'react';
import axios from 'axios';
import { Calendar } from 'lucide-react';
import {useAuth} from '../context/AuthContext';

const ReportComponent = () => {

  const {user, isLoggedIn} = useAuth(); 
  const [reportType, setReportType] = useState('lost'); // 'lost' or 'found'
  const [formData, setFormData] = useState({
    itemName: '',
    location: '',
    description: '',
    category : '',
    image: null,
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.itemName) newErrors.itemName = 'Item name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (reportType === 'found' && !formData.image) newErrors.image = 'Image is required for found items';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('You must be logged in to submit a report.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const apiEndpoint = reportType === 'lost' ? 'api/lost' : 'api/found';
      const formDataToSend = new FormData();
      let dateObject = new Date(formData.date);

      dateObject = dateObject.toISOString().split('.')[0] + 'Z'; // Convert to UTC format (getting rid of milliseconds)

      console.log('Date object:', dateObject);
      // Append form data
      console.log('Form data:', formData);
      formDataToSend.append('name', formData.itemName);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category.toUpperCase());
      reportType === 'lost' ? formDataToSend.append('dateLost', dateObject) : formDataToSend.append('dateFound', dateObject);   // Convert date to ISO string
      formDataToSend.append('location', formData.location);
      formDataToSend.append('userId', user.id); // Attach the authenticated user's ID
      
      if (formData.image) {
        formDataToSend.append('image', formData.image); // Attach the image if provided
      }

      console.log('Form data to send:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(`http://localhost:5000/${apiEndpoint}`, formDataToSend, {
        withCredentials: true, // Include cookies for authentication
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Report submitted successfully:', response.data);
      alert(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} item report submitted successfully!`);
      setFormData({
        itemName: '',
        location: '',
        description: '',
        category: '',
        image: null,
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit the report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Report an Item</h1>
      
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
              reportType === 'lost' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => handleReportTypeChange('lost')}
          >
            Lost Item
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${
              reportType === 'found' 
                ? 'bg-green-600 text-white border-green-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => handleReportTypeChange('found')}
          >
            Found Item
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemName">
            Item Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="itemName"
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleInputChange}
            placeholder={`Name of the ${reportType} item`}
            required
          />
          {errors.itemName && <p className="text-red-500 text-xs italic">{errors.itemName}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Category
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="documents">Documents</option>
            <option value="others">Others</option>
          </select>
          {errors.category && <p className="text-red-500 text-xs italic">{errors.category}</p>}
        </div>


        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            {reportType === 'lost' ? 'Last Seen Location' : 'Found Location'}
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter location"
            required
          />
          {errors.location && <p className="text-red-500 text-xs italic">{errors.location}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder={`Describe the ${reportType} item in detail`}
            rows="4"
            required
          />
          {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Image Upload
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
              </div>
              <input 
                id="image" 
                name="image"
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          {formData.image ?(
            <p className="text-green-500 text-xs italic mt-2">Image selected: {formData.image.name}</p>
          ):
            <p className="text-red-500 text-xs italic">{errors.image}</p>
          }
        
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            {reportType === 'lost' ? 'Date Lost' : 'Date Found'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 pl-10 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              reportType === 'lost' 
                ? 'bg-blue-500 hover:bg-blue-700 text-white' 
                : 'bg-green-500 hover:bg-green-700 text-white'
            }`}
            type="submit"
          >
            Submit {reportType === 'lost' ? 'Lost' : 'Found'} Item Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportComponent;