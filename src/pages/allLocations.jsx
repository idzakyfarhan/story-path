/**
 * AllLocations component for displaying a list of all locations.
 * It fetches locations from the API and displays them with options to show/hide QR codes for each location.
 * 
 * @component
 * @example
 * return (
 *   <AllLocations />
 * )
 */

 import React, { useEffect, useState } from 'react';
 import { getLocations } from '../api';
 import QRCode from 'react-qr-code'; // Import the QRCode component
 
 /**
  * AllLocations component for displaying all locations with QR code functionality.
  * 
  * @returns {JSX.Element} The rendered component.
  */
 function AllLocations() {
   const [locations, setLocations] = useState([]); // State for storing locations fetched from the API
   const [qrVisible, setQrVisible] = useState({}); // State to control visibility of QR codes
 
   /**
    * Fetches all locations from the API and updates the state.
    * @async
    * @function fetchLocations
    * @returns {Promise<void>} Returns nothing.
    */
   const fetchLocations = async () => {
     try {
       const response = await getLocations(); // Fetch locations from the API
       setLocations(response); // Update locations state with fetched data
     } catch (error) {
       console.error('Failed to fetch locations:', error); // Logs error if fetching fails
     }
   };
 
   // Effect to fetch locations when the component mounts
   useEffect(() => {
     fetchLocations(); // Calls fetchLocations to get the locations
   }, []);
 
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
           <h2 className="text-4xl font-bold text-blue-500 mb-6">All Locations</h2>
 
           {locations.length === 0 ? (
             <p className="text-lg text-gray-600">No locations found.</p> // Message if no locations are available
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
                         {qrVisible[location.id] ? 'Hide QR Code' : 'Show QR Code'} // Toggle button text
                       </button>
 
                       {/* QR Code for the location */}
                       {qrVisible[location.id] && (
                         <div className="mt-4">
                           <QRCode value={`http://yourapp.com/locations/${location.id}`} /> {/* Displays QR Code */}
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
 