import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProjects, getLocations } from '../api';

function Review() {
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(id);
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [visitedLocations, setVisitedLocations] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const fetchedLocations = await getLocations();
        const filteredLocations = fetchedLocations.filter(location => location.project_id === parseInt(selectedProjectId));

        setLocations(filteredLocations);
        const scoreSum = filteredLocations.reduce((acc, loc) => acc + loc.score_points, 0);
        setTotalScore(scoreSum);
        setVisitedLocations(filteredLocations.length);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };

    fetchLocations();
  }, [selectedProjectId]);

  const handleProjectChange = (event) => {
    setSelectedProjectId(event.target.value);
    setSelectedLocationId('');
  };

  const handleLocationChange = (event) => {
    setSelectedLocationId(event.target.value);
  };

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
            onChange={handleProjectChange}
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
            onChange={handleLocationChange}
            disabled={!locations.length}
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
                  dangerouslySetInnerHTML={{ __html: location.location_content }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Display Total Score and Visited Locations */}
        <div className="flex justify-center items-center space-x-6 mb-8">
          <div className="bg-purple-500 text-white py-2 px-6 rounded-lg shadow-lg">
            <h4 className="font-bold text-xl">Total Points Required</h4>
            <p>{totalScore}</p>
          </div>
          <div className="bg-purple-500 text-white py-2 px-6 rounded-lg shadow-lg">
            <h4 className="font-bold text-xl">Locations Visited</h4>
            <p>{visitedLocations} / {locations.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;
