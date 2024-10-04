/**
 * Review component for displaying project and location details.
 * It allows users to select a project and location to review, showing the total score and visited locations.
 * 
 * @component
 * @example
 * return (
 *   <Review />
 * )
 */

 import React, { useState, useEffect } from 'react';
 import { useParams } from 'react-router-dom';
 import { getProjects, getLocations } from '../api';
 
 /**
  * Review component to manage and display the review of projects and locations.
  * 
  * @returns {JSX.Element} The rendered component.
  */
 function Review() {
   const { id } = useParams(); // Retrieves the project ID from URL parameters
   const [projects, setProjects] = useState([]); // State for storing projects
   const [selectedProjectId, setSelectedProjectId] = useState(id); // State for storing the selected project ID
   const [locations, setLocations] = useState([]); // State for storing locations
   const [selectedLocationId, setSelectedLocationId] = useState(''); // State for storing the selected location ID
   const [totalScore, setTotalScore] = useState(0); // State for storing the total score
   const [visitedLocations, setVisitedLocations] = useState(0); // State for storing the count of visited locations
 
   /**
    * Fetches projects from the API on component mount.
    * @async
    * @function fetchProjects
    * @returns {Promise<void>} Returns nothing.
    */
   useEffect(() => {
     const fetchProjects = async () => {
       try {
         const fetchedProjects = await getProjects(); // Fetch projects from the API
         setProjects(fetchedProjects); // Update projects state with fetched data
       } catch (error) {
         console.error('Failed to fetch projects:', error); // Logs error if fetching fails
       }
     };
 
     fetchProjects(); // Calls fetchProjects to get the projects
   }, []);
 
   /**
    * Fetches locations related to the selected project when the selectedProjectId changes.
    * @async
    * @function fetchLocations
    * @returns {Promise<void>} Returns nothing.
    */
   useEffect(() => {
     const fetchLocations = async () => {
       try {
         const fetchedLocations = await getLocations(); // Fetch locations from the API
         const filteredLocations = fetchedLocations.filter(location => location.project_id === parseInt(selectedProjectId)); // Filters locations by project ID
 
         setLocations(filteredLocations); // Updates locations state with filtered data
         const scoreSum = filteredLocations.reduce((acc, loc) => acc + loc.score_points, 0); // Calculates total score
         setTotalScore(scoreSum); // Updates total score
         setVisitedLocations(filteredLocations.length); // Updates count of visited locations
       } catch (error) {
         console.error('Failed to fetch locations:', error); // Logs error if fetching fails
       }
     };
 
     fetchLocations(); // Calls fetchLocations to get the locations
   }, [selectedProjectId]); // Dependency on selectedProjectId
 
   /**
    * Handles project selection change.
    * @param {Object} event - The change event from the project selection dropdown.
    */
   const handleProjectChange = (event) => {
     setSelectedProjectId(event.target.value); // Updates selected project ID
     setSelectedLocationId(''); // Resets selected location ID
   };
 
   /**
    * Handles location selection change.
    * @param {Object} event - The change event from the location selection dropdown.
    */
   const handleLocationChange = (event) => {
     setSelectedLocationId(event.target.value); // Updates selected location ID
   };
 
   // Display a loading message if projects are still being fetched
   if (projects.length === 0) {
     return <p className="text-center text-gray-600">Loading projects...</p>;
   }
 
   return (
     <div className="min-h-screen bg-gray-50 px-4 py-8">
       <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
         <h2 className="text-5xl font-bold text-purple-700 mb-10 text-center">The Review</h2>
 
         {/* Dropdown for Project Selection */}
         <div className="mb-6">
           <label htmlFor="project" className="block text-lg font-medium text-gray-700">Select Project:</label>
           <select
             id="project"
             value={selectedProjectId}
             onChange={handleProjectChange} // Handles project selection change
             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 p-2"
           >
             {projects.map((project) => (
               <option key={project.id} value={project.id}>
                 {project.title}
               </option>
             ))}
           </select>
         </div>
 
         {/* Dropdown for Location Selection */}
         <div className="mb-6">
           <label htmlFor="location" className="block text-lg font-medium text-gray-700">Select Location:</label>
           <select
             id="location"
             value={selectedLocationId}
             onChange={handleLocationChange} // Handles location selection change
             disabled={!locations.length} // Disables if no locations available
             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 p-2"
           >
             <option value="">Select a location</option>
             {locations.map((location) => (
               <option key={location.id} value={location.id}>
                 {location.location_name}
               </option>
             ))}
           </select>
         </div>
 
         {/* Display Selected Location Details */}
         {selectedLocationId && (
           <div className="mb-6">
             {locations.filter(location => location.id === parseInt(selectedLocationId)).map(location => (
               <div key={location.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                 <h5 className="text-lg font-semibold text-gray-700">{location.location_name}</h5>
                 <p className="text-gray-600">Points: {location.score_points} / {totalScore}</p>
                 <p className="text-gray-600">Clue: {location.clue}</p>
 
                 {/* Display the HTML content including images */}
                 <div
                   className="mt-2"
                   dangerouslySetInnerHTML={{ __html: location.location_content }} // Displays HTML content safely
                 />
               </div>
             ))}
           </div>
         )}
 
         {/* Display Total Score and Visited Locations */}
         <div className="flex justify-center items-center space-x-6 mb-8">
           <div className="bg-purple-500 text-white py-2 px-6 rounded-lg shadow-lg">
             <h4 className="font-bold text-xl">Total Points Required</h4>
             <p>{totalScore}</p> {/* Displays total score */}
           </div>
           <div className="bg-purple-500 text-white py-2 px-6 rounded-lg shadow-lg">
             <h4 className="font-bold text-xl">Locations Visited</h4>
             <p>{visitedLocations} / {locations.length}</p> {/* Displays count of visited locations */}
           </div>
         </div>
       </div>
     </div>
   );
 }
 
 export default Review;
 