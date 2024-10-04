import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getLocations } from '../api';
import QRCode from 'react-qr-code';

function LocationList({ deleteLocation }) {
  const { id: projectId } = useParams();
  const [locations, setLocations] = useState([]);
  const [qrVisible, setQrVisible] = useState({}); // State to control visibility of QR codes
  const navigate = useNavigate();

  // Fetch locations from the API
  const fetchLocations = async () => {
    try {
      const response = await getLocations();
      const filteredLocations = response.filter(location => location.project_id === parseInt(projectId));
      setLocations(filteredLocations);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [projectId]);

  // Handle delete location
  const handleDelete = async (id) => {
    try {
      await deleteLocation(id);
      setLocations(locations.filter((location) => location.id !== id));
    } catch (error) {
      console.error('Failed to delete location:', error);
    }
  };

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
          <h2 className="text-4xl font-bold text-blue-500 mb-6">The Locations List for Project {projectId}</h2>
          <div className="flex justify-center mb-6">
            <Link to={`/add-location?project_id=${projectId}`}>
              <button className="mb-6 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-300 ease-in-out">
                Add Location
              </button>
            </Link>
          </div>

          {locations.length === 0 ? (
            <p className="text-lg text-gray-600">No locations found for this project.</p>
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
                    <div className="text-right flex space-x-2">
                      <button className="text-gray-500 border border-gray-300 px-3 py-1 rounded-lg shadow hover:bg-gray-100" onClick={() => navigate(`/edit-location/${location.id}?project_id=${projectId}`)}>
                        Edit
                      </button>
                      <button className="text-red-500 border border-red-300 px-3 py-1 rounded-lg shadow hover:bg-red-100" onClick={() => handleDelete(location.id)}>
                        Delete
                      </button>
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

export default LocationList;
