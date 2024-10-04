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

function App() {
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Fetch locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocations();
        setLocations(response);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const addNewProject = async (newProject) => {
    try {
      const response = await createProject(newProject);
      setProjects([...projects, response]);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const editProject = async (updatedProject) => {
    try {
      const response = await updateProject(updatedProject.id, updatedProject);
      setProjects(
        projects.map((project) => (project.id === response.id ? response : project))
      );
    } catch (error) {
      console.error("Failed to edit project:", error);
    }
  };

  const addNewLocation = async (newLocation) => {
    try {
      const response = await createLocation(newLocation);
      setLocations([...locations, response]);
    } catch (error) {
      console.error("Failed to create location:", error);
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await deleteLocation(id);
      setLocations(locations.filter((location) => location.id !== id));
    } catch (error) {
      console.error("Failed to delete location:", error);
    }
  };

  const editLocation = async (updatedLocation) => {
    try {
      const response = await updateLocation(updatedLocation.id, updatedLocation);
      setLocations(
        locations.map((location) => (location.id === response.id ? response : location))
      );
    } catch (error) {
      console.error("Failed to edit location:", error);
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
