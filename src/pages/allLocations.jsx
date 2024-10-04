// src/pages/AllLocations.jsx
import React, { useEffect, useState } from 'react';
import { getLocations } from '../api';
import QRCode from 'react-qr-code'; // Import the QRCode component

function AllLocations() {
  const [locations, setLocations] = useState([]);
  const [qrVisible, setQrVisible] = useState({}); // State to control visibility of QR codes

  // Fetch all locations from the API
  const fetchLocations = async () => {
    try {
      const response = await getLocations();
      setLocations(response);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Toggle QR code visibility
  const toggleQrVisibility = (id) => {
    setQrVisible(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h2 className="text-4xl font-bold text-blue-500 mb-6">All Locations</h2>

          {locations.length === 0 ? (
            <p className="text-lg text-gray-600">No locations found.</p>
          ) : (
            <ul className="space-y-4">
              {locations.map((location) => (
                <li key={location.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-800">{location.location_name}</h3>
                      <p className="text-gray-600">Trigger: {location.location_trigger}</p>
                      <p className="text-gray-600">Position: {location.location_position}</p>
                      <p className="text-gray-600">Points: {location.score_points}</p>
                      <p className="text-gray-600"><strong>Clue:</strong> {location.clue}</p>
                      
                      {/* Button to toggle QR code visibility */}
                      <button 
                        onClick={() => toggleQrVisibility(location.id)} 
                        className="mt-4 text-blue-600 underline">
                        {qrVisible[location.id] ? 'Hide QR Code' : 'Show QR Code'}
                      </button>

                      {/* QR Code for the location */}
                      {qrVisible[location.id] && (
                        <div className="mt-4">
                          <QRCode value={`http://yourapp.com/locations/${location.id}`} />
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllLocations;
