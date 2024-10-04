/**
 * LocationList component for displaying a list of locations associated with a specific project.
 * It fetches locations from the API, allows deletion, and displays QR codes for each location.
 * 
 * @component
 * @example
 * return (
 *   <LocationList deleteLocation={deleteLocationFunction} />
 * )
 */

 import React, { useEffect, useState } from 'react';
 import { Link, useNavigate, useParams } from 'react-router-dom';
 import { getLocations } from '../api';
 import QRCode from 'react-qr-code';
 
 /**
  * LocationList component to manage and display locations for a specific project.
  * 
  * @param {Object} props - Component properties.
  * @param {Function} props.deleteLocation - Function to delete a location.
  * @returns {JSX.Element} The rendered component.
  */
 function LocationList({ deleteLocation }) {
   const { id: projectId } = useParams(); // Retrieves the project ID from URL parameters
   const [locations, setLocations] = useState([]); // State for storing locations
   const [qrVisible, setQrVisible] = useState({}); // State to control visibility of QR codes
   const navigate = useNavigate(); // Hook for navigation
 
   /**
    * Fetches locations from the API and filters them based on the project ID.
    * @async
    * @function fetchLocations
    * @returns {Promise<void>} Returns nothing.
    */
   const fetchLocations = async () => {
     try {
       const response = await getLocations(); // Fetch locations from the API
       const filteredLocations = response.filter(location => location.project_id === parseInt(projectId)); // Filters locations by project ID
       setLocations(filteredLocations); // Updates locations state with filtered data
     } catch (error) {
       console.error('Failed to fetch locations:', error); // Logs error if fetching fails
     }
   };
 
   // Effect to fetch locations when the project ID changes
   useEffect(() => {
     fetchLocations(); // Calls fetchLocations to get the locations
   }, [projectId]);
 
   /**
    * Handles the deletion of a location by ID and updates the state.
    * @async
    * @function handleDelete
    * @param {number} id - The ID of the location to be deleted.
    * @returns {Promise<void>} Returns nothing.
    */
   const handleDelete = async (id) => {
     try {
       await deleteLocation(id); // Delete location via API
       setLocations(locations.filter((location) => location.id !== id)); // Updates locations state
     } catch (error) {
       console.error('Failed to delete location:', error); // Logs error if deleting fails
     }
   };
 
   /**
    * Toggles the visibility of the QR code for a specific location.
    * @param {number} id - The ID of the location to toggle QR code visibility for.
    */
   const toggleQrVisibility = (id) => {
     setQrVisible(prevState => ({
       ...prevState,
       [id]: !prevState[id], // Toggles the QR code visibility state
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
             <p className="text-lg text-gray-600">No locations found for this project.</p> // Message if no locations are available
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
                         {qrVisible[location.id] ? 'Hide QR Code' : 'Show QR Code'} {/* Button text changes based on QR code visibility */}
                       </button>
 
                       {/* QR Code for the location */}
                       {qrVisible[location.id] && (
                         <div className="mt-4">
                           <QRCode value={`http://yourapp.com/locations/${location.id}`} /> {/* Displays QR Code */}
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
 