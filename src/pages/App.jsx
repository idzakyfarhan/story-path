/**
 * App component serves as the main entry point of the application.
 * It sets up the router, fetches projects and locations, and renders the corresponding components based on the current route.
 * 
 * @component
 * @example
 * return (
 *   <App />
 * )
 */

 import React, { useEffect, useState } from 'react';
 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import '../App.css';
 import Navbar from '../components/navbar';
 import ProjectList from './projectlist';
 import LocationList from './locationlist';
 import AddProject from './addproject';
 import LandingPage from './landingpage';
 import Footer from '../components/Footer';
 import AddLocation from './addlocation';
 import Review from './review'; 
 import AllLocations from './AllLocations'; // Import the new AllLocations page
 
 // Import necessary API functions
 import {
   createProject,
   deleteProject,
   updateProject,
   createLocation,
   deleteLocation,
   updateLocation,
   getProjects,
   getLocations,
 } from '../api';
 
 /**
  * App component to manage routing and state for projects and locations.
  * 
  * @returns {JSX.Element} The rendered component.
  */
 function App() {
   const [projects, setProjects] = useState([]); // State for storing projects
   const [locations, setLocations] = useState([]); // State for storing locations
 
   /**
    * Effect to fetch projects on component mount.
    * @async
    * @function fetchProjects
    * @returns {Promise<void>} Returns nothing.
    */
   useEffect(() => {
     const fetchProjects = async () => {
       try {
         const response = await getProjects(); // Fetch projects from the API
         setProjects(response); // Update projects state with fetched data
       } catch (error) {
         console.error("Failed to fetch projects:", error); // Logs error if fetching fails
       }
     };
     fetchProjects(); // Calls fetchProjects to get the projects
   }, []);
 
   /**
    * Effect to fetch locations on component mount.
    * @async
    * @function fetchLocations
    * @returns {Promise<void>} Returns nothing.
    */
   useEffect(() => {
     const fetchLocations = async () => {
       try {
         const response = await getLocations(); // Fetch locations from the API
         setLocations(response); // Update locations state with fetched data
       } catch (error) {
         console.error("Failed to fetch locations:", error); // Logs error if fetching fails
       }
     };
     fetchLocations(); // Calls fetchLocations to get the locations
   }, []);
 
   /**
    * Adds a new project and updates the state.
    * @async
    * @function addNewProject
    * @param {Object} newProject - The project data to be added.
    * @returns {Promise<void>} Returns nothing.
    */
   const addNewProject = async (newProject) => {
     try {
       const response = await createProject(newProject); // Create project via API
       setProjects([...projects, response]); // Update projects state
     } catch (error) {
       console.error("Failed to create project:", error); // Logs error if creating fails
     }
   };
 
   /**
    * Deletes a project by ID and updates the state.
    * @async
    * @function handleDeleteProject
    * @param {number} id - The ID of the project to be deleted.
    * @returns {Promise<void>} Returns nothing.
    */
   const handleDeleteProject = async (id) => {
     try {
       await deleteProject(id); // Delete project via API
       setProjects(projects.filter((project) => project.id !== id)); // Updates projects state
     } catch (error) {
       console.error("Failed to delete project:", error); // Logs error if deleting fails
     }
   };
 
   /**
    * Edits an existing project and updates the state.
    * @async
    * @function editProject
    * @param {Object} updatedProject - The updated project data.
    * @returns {Promise<void>} Returns nothing.
    */
   const editProject = async (updatedProject) => {
     try {
       const response = await updateProject(updatedProject.id, updatedProject); // Update project via API
       setProjects(
         projects.map((project) => (project.id === response.id ? response : project))
       ); // Updates projects state
     } catch (error) {
       console.error("Failed to edit project:", error); // Logs error if editing fails
     }
   };
 
   /**
    * Adds a new location and updates the state.
    * @async
    * @function addNewLocation
    * @param {Object} newLocation - The location data to be added.
    * @returns {Promise<void>} Returns nothing.
    */
   const addNewLocation = async (newLocation) => {
     try {
       const response = await createLocation(newLocation); // Create location via API
       setLocations([...locations, response]); // Updates locations state
     } catch (error) {
       console.error("Failed to create location:", error); // Logs error if creating fails
     }
   };
 
   /**
    * Deletes a location by ID and updates the state.
    * @async
    * @function handleDeleteLocation
    * @param {number} id - The ID of the location to be deleted.
    * @returns {Promise<void>} Returns nothing.
    */
   const handleDeleteLocation = async (id) => {
     try {
       await deleteLocation(id); // Delete location via API
       setLocations(locations.filter((location) => location.id !== id)); // Updates locations state
     } catch (error) {
       console.error("Failed to delete location:", error); // Logs error if deleting fails
     }
   };
 
   /**
    * Edits an existing location and updates the state.
    * @async
    * @function editLocation
    * @param {Object} updatedLocation - The updated location data.
    * @returns {Promise<void>} Returns nothing.
    */
   const editLocation = async (updatedLocation) => {
     try {
       const response = await updateLocation(updatedLocation.id, updatedLocation); // Update location via API
       setLocations(
         locations.map((location) => (location.id === response.id ? response : location))
       ); // Updates locations state
     } catch (error) {
       console.error("Failed to edit location:", error); // Logs error if editing fails
     }
   };
 
   return (
     <Router>
       <Navbar projects={projects} /> {/* Pass projects to Navbar */}
       <Routes>
         <Route path="/" element={<LandingPage />} />
         <Route path="/projects" element={<ProjectList projects={projects} deleteProject={handleDeleteProject} />} />
         <Route path="/projects/:id/locations" element={<LocationList locations={locations} deleteLocation={handleDeleteLocation} />} />
         <Route path="/add-project" element={<AddProject addNewProject={addNewProject} />} />
         <Route path="/edit-project/:id" element={<AddProject editProject={editProject} projects={projects} />} />
         <Route path="/add-location" element={<AddLocation addNewLocation={addNewLocation} />} />
         <Route path="/edit-location/:id" element={<AddLocation editLocation={editLocation} locations={locations} />} />
         <Route path="/review/:id" element={<Review />} />
         <Route path="/all-locations" element={<AllLocations />} /> {/* New Route */}
       </Routes>
       <Footer />
     </Router>
   );
 }
 
 export default App;
 