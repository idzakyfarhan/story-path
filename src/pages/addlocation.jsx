/**
 * AddLocation component for adding or editing location details associated with a specific project.
 * It includes a form for entering location data and a map for selecting a geographical position.
 * 
 * @component
 * @example
 * return (
 *   <AddLocation />
 * )
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createLocation, getLocation, updateLocation, getProjects } from '../api';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerlogo from '../assets/marker.png';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * Custom marker icon for the map.
 */
const customMarkerIcon = L.icon({
  iconUrl: markerlogo,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

/**
 * AddLocation component.
 * @returns {JSX.Element} The rendered component.
 */
function AddLocation() {
  const { id } = useParams(); // Retrieves the location ID from the URL parameters
  const locationUrl = useLocation(); // Retrieves the current URL location object
  const navigate = useNavigate(); // Hook for navigation
  const isEditing = Boolean(id); // Determines if the component is in editing mode
  const searchParams = new URLSearchParams(locationUrl.search); // Parses query parameters from the URL
  const projectId = searchParams.get('project_id') || ''; // Retrieves the project ID from query parameters

  const [validProjectIds, setValidProjectIds] = useState([]); // State for valid project IDs
  const [location, setLocation] = useState({
    location_name: '',
    location_trigger: 'Location',
    location_position: '(-27.4920,153.0077)', // Default position
    score_points: 0,
    clue: '',
    project_id: projectId, // Associated project ID
    username: 's4877740', // Default username
    location_content: '',
    photo_url: '', // URL for location photo
  });

  /**
   * Fetches location data if in editing mode.
   */
  useEffect(() => {
    if (isEditing) {
      const fetchLocation = async () => {
        try {
          const data = await getLocation(id);
          if (data.length > 0) {
            setLocation(data[0]); // Sets location state to fetched data
          }
        } catch (error) {
          console.error('Failed to fetch location:', error);
        }
      };
      fetchLocation();
    }
  }, [id, isEditing]);

  /**
   * Fetches project IDs for validation.
   */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getProjects();
        const projectIds = projects.map(project => project.id.toString());
        setValidProjectIds(projectIds); // Sets valid project IDs
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, []);

  /**
   * Handles changes in form inputs.
   * @param {Object} e - The event object.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocation((prevLocation) => ({
      ...prevLocation,
      [name]: name === 'score_points' ? parseInt(value, 10) : value, // Parses score_points to an integer
    }));
  };

  /**
   * Handles changes in the rich text editor.
   * @param {string} value - The new content of the editor.
   */
  const handleEditorChange = (value) => {
    setLocation((prevLocation) => ({
      ...prevLocation,
      location_content: value, // Updates location content
    }));
  };

  /**
   * Handles file input changes and sets photo URL.
   * @param {Object} event - The file input change event.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocation((prevLocation) => ({
        ...prevLocation,
        photo_url: reader.result, // Saves the Base64 string of the image
      }));
    };
    if (file) {
      reader.readAsDataURL(file); // Reads the file as a Base64 URL
    }
  };

  /**
   * Validates the position format (latitude, longitude).
   * @param {string} position - The location position string.
   * @returns {boolean} True if valid format, false otherwise.
   */
  const validatePosition = (position) => {
    const regex = /^\(-?\d+(\.\d+)?,-?\d+(\.\d+)?\)$/; // Regex for matching (lat,long) format
    return regex.test(position);
  };

  /**
   * Handles form submission for creating or updating a location.
   * @param {Object} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!validatePosition(location.location_position)) {
      alert("The Location format must be in (lat,long). For Example: (37.7749,-122.4194)");
      return;
    }

    if (!validProjectIds.includes(location.project_id.toString())) {
      alert(`Invalid project ID: ${location.project_id}. Please make sure the project ID exists in the project table.`);
      return;
    }

    try {
      if (isEditing) {
        await updateLocation(id, location); // Updates existing location
        alert('Location updated successfully!');
      } else {
        await createLocation(location); // Creates new location
        alert('Location created successfully!');
      }
      navigate(`/projects/${projectId}/locations`); // Redirects to the locations page
    } catch (error) {
      console.error('Failed to create or update location:', error);
      alert("Failed to create or update location. Please check your data.");
    }
  };

  /**
   * Handles the cancel button click, navigating back to the locations page.
   */
  const handleCancel = () => {
    navigate(`/projects/${projectId}/locations`);
  };

  /**
   * Map component for selecting a location.
   * @param {Object} props - Props containing setPosition function.
   * @returns {null} No rendered output.
   */
  const LocationPicker = ({ setPosition }) => {
    useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng; // Gets latitude and longitude from map click event
        setPosition(`(${lat},${lng})`); // Sets the selected position
      },
    });
    return null;
  };

  /**
   * Parses the location position string into latitude and longitude.
   * @param {string} position - The location position string.
   * @returns {Object} Object containing latitude and longitude.
   */
  const parseLocation = (position) => {
    const coords = position.match(/-?\d+(\.\d+)?/g); // Matches latitude and longitude
    return coords ? { lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) } : { lat: -27.4920, lng: 153.0077 }; // Default coordinates
  };

  const { lat, lng } = parseLocation(location.location_position); // Parses the current position for the map

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-4xl font-bold text-blue-500 mb-10">{isEditing ? `Edit Location for Project ${projectId}` : `Add New Location for Project ${projectId}`}</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Location Name */}
          <div className="flex flex-col">
            <label htmlFor="location_name" className="block text-left text-sm font-medium text-gray-700">Location Name</label>
            <input
              type="text"
              name="location_name"
              id="location_name"
              value={location.location_name}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm p-2"
              placeholder="The name of this location."
              required
            />
          </div>

          {/* Location Trigger */}
          <div className="flex flex-col">
            <label htmlFor="location_trigger" className="block text-left text-sm font-medium text-gray-700">Location Trigger</label>
            <select
              name="location_trigger"
              id="location_trigger"
              value={location.location_trigger}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm p-2"
              required
            >
              <option>Location</option>
              <option>QR Code</option>
              <option>Both</option>
            </select>
          </div>

          {/* Location Position */}
          <div className="flex flex-col">
            <label htmlFor="location_position" className="block text-left text-sm font-medium text-gray-700">Location Position (lat, long)</label>
            <input
              type="text"
              name="location_position"
              id="location_position"
              value={location.location_position}
              readOnly
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm p-2"
              placeholder="Enter the latitude and longitude for this location. Example: (37.7749,-122.4194)"
              required
            />
          </div>

          {/* Points for Reaching Location */}
          <div className="flex flex-col">
            <label htmlFor="score_points" className="block text-left text-sm font-medium text-gray-700">Points for Reaching Location</label>
            <input
              type="number"
              name="score_points"
              id="score_points"
              value={location.score_points}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm p-2"
              placeholder="Enter the number of points."
              required
            />
          </div>

          {/* Clue */}
          <div className="flex flex-col">
            <label htmlFor="clue" className="block text-left text-sm font-medium text-gray-700">Clue</label>
            <input
              type="text"
              name="clue"
              id="clue"
              value={location.clue}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm p-2"
              placeholder="Enter the clue that leads to the next location."
            />
          </div>

          {/* Location Content (WYSIWYG Editor) */}
          <div className="flex flex-col">
            <label htmlFor="location_content" className="block text-left text-sm font-medium text-gray-700">Location Content</label>
            <ReactQuill
              value={location.location_content}
              onChange={handleEditorChange}
              modules={{
                toolbar: [
                  [{ header: '1' }, { header: '2' }, { font: [] }],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['bold', 'italic', 'underline'],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
              className="bg-white border border-gray-300 rounded-md shadow-sm"
              placeholder="Provide additional content that will be displayed when participants reach this location."
            />
          </div>

          {/* Map for picking location */}
          <div className="flex flex-col mb-8">
            <label className="block text-left text-sm font-medium text-gray-700">Pick Location on Map</label>
            <MapContainer center={[-27.4920, 153.0077]} zoom={12} style={{ height: '400px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationPicker setPosition={(position) => setLocation((prev) => ({ ...prev, location_position: position }))} />
              <Marker position={[lat, lng]} icon={customMarkerIcon} />
            </MapContainer>
          </div>

          {/* Save Location Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            {isEditing ? 'Update Location' : 'Save Location'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-500 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-red-600 ml-2 transition duration-300 ease-in-out"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddLocation;
