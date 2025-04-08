const ItemCard = ({ item, filter }) => {
    const dateField = filter === 'lost' ? item.dateLost : item.dateFound; // date field based on filter
    return (
      <div className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
        {/* Image Section */}
        <div className="h-48 overflow-hidden">
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
        </div>
  
        {/* Content Section */}
        <div className="p-4 flex flex-col justify-between h-56">
          {/* Title */}
          <h3 className="font-bold text-lg truncate">{item.name}</h3>
  
          {/* Location */}
          <p className="text-gray-600 text-sm flex items-center mt-1">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
            </svg>
            {item.location}
          </p>
  
          {/* Description */}
          <p className="text-gray-700 mt-2 text-sm line-clamp-2">
            {item.description}
          </p>
  
          {/* Footer Section */}
          <div className="mt-4 flex justify-between items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${
              filter === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {filter === 'lost' ? 'Lost' : 'Found'}
            </span>
            <span className="text-gray-500 text-xs">
              {new Date(dateField).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  export default ItemCard;