import { useState } from 'react';
import { Search, MapPin, Package, Shield, LogIn, Menu, X } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import { NavLink } from 'react-router-dom';
export default function LostAndFoundLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const Navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}


      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Lost Something on Campus?</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Find your lost items or help return found belongings to their rightful owners.</p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mb-8">
            <NavLink to="/report" className="bg-white text-blue-600 px-6 py-3 rounded-md font-bold hover:bg-blue-100 transition flex items-center justify-center gap-2">
              <Package className="w-5 h-5" />
              <span>Report Item</span>
            </NavLink>
  
          </div>
          
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for an item..."
                className="w-full px-5 py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 p-2 rounded-md hover:bg-blue-600 transition">
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-blue-600 mb-2">150+</p>
              <p className="text-gray-600">Items Recovered</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-blue-600 mb-2">24h</p>
              <p className="text-gray-600">Average Recovery Time</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <p className="text-4xl font-bold text-blue-600 mb-2">95%</p>
              <p className="text-gray-600">Return Rate</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Report</h3>
              <p className="text-gray-600">Submit details about your lost item or something you've found.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Match</h3>
              <p className="text-gray-600">Our system matches lost items with found reports automatically.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Collect</h3>
              <p className="text-gray-600">Arrange to collect your item from our campus lost and found location.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Items Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Recently Found Items</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Blue Water Bottle", location: "Science Building", date: "Mar 28, 2025" },
              { name: "Silver Laptop", location: "Main Library", date: "Mar 27, 2025" },
              { name: "House Keys", location: "Student Center", date: "Mar 26, 2025" },
              { name: "Black Backpack", location: "Gym", date: "Mar 25, 2025" }
            ].map((item, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <img src="/api/placeholder/200/150" alt="placeholder" className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">Found at: {item.location}</p>
                  <p className="text-gray-500 text-sm">Date: {item.date}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transition">
              View All Items
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Campus FindIt</h3>
              <p className="text-gray-400">Helping students and staff recover their lost belongings since 2025.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#" className="hover:text-white transition">Report Item</a></li>
                <li><a href="#" className="hover:text-white transition">Browse Lost Items</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-400">Lost & Found Office<br />Student Center, Room 101<br />Open Mon-Fri, 9am-5pm</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
            <p>&copy; 2025 Campus FindIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}