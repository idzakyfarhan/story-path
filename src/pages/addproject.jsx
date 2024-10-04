/**
 * AddProject component for creating or editing a project.
 * It includes a form for entering project details and handles submission to create or update the project.
 * 
 * @component
 * @example
 * return (
 *   <AddProject />
 * )
 */

 import React, { useState, useEffect } from 'react';
 import { useParams, useNavigate } from 'react-router-dom';
 import { createProject, updateProject } from '../api';
 
 /**
  * AddProject component for adding or editing a project.
  * 
  * @param {Object} props - Component properties.
  * @param {boolean} props.editProject - Flag indicating if the component is in editing mode.
  * @param {Array} [props.projects=[]] - List of existing projects for editing.
  * @param {Function} props.fetchProjects - Function to fetch the updated list of projects after submission.
  * @returns {JSX.Element} The rendered component.
  */
 const AddProject = ({ editProject, projects = [], fetchProjects }) => {
   const { id } = useParams(); // Retrieves the project ID from the URL parameters
   const navigate = useNavigate(); // Hook for navigation
   const isEditing = Boolean(id); // Determines if the component is in editing mode
   const existingProject = projects.find((project) => project.id === parseInt(id)); // Finds existing project data
 
   const [formData, setFormData] = useState({
     title: '', // Title of the project
     description: '', // Description of the project
     instructions: '', // Instructions for the project
     initial_clue: '', // Initial clue for participants
     homescreen_display: 'Display Initial Clue', // Display option for homescreen
     is_published: false, // Publication status
     participant_scoring: 'Not Scored', // Scoring method for participants
   });
 
   /**
    * Effect to set form data if in editing mode with existing project data.
    */
   useEffect(() => {
     if (isEditing && existingProject) {
       setFormData(existingProject); // Sets form data to existing project details
     }
   }, [isEditing, existingProject]);
 
   /**
    * Handles input changes in the form fields.
    * @param {Object} e - The event object from the input change.
    */
   const handleInputChange = (e) => {
     const { name, value, type, checked } = e.target; // Destructures input attributes
     setFormData({
       ...formData,
       [name]: type === 'checkbox' ? checked : value, // Updates formData based on input type
     });
   };
 
   /**
    * Handles form submission for creating or updating a project.
    * @param {Object} e - The form submission event.
    */
   const handleSubmit = async (e) => {
     e.preventDefault(); // Prevents default form submission
     try {
       if (isEditing) {
         await updateProject(id, formData); // Updates existing project
         alert('Project updated successfully!');
       } else {
         await createProject(formData); // Creates a new project
         alert('Project created successfully!');
       }
       fetchProjects(); // Refreshes the project list after submission
       navigate('/projects'); // Navigates to the projects list page
     } catch (error) {
       console.error('Failed to create or update project:', error);
       alert('Failed to create or update project. Please check your data.');
     }
   };
 
   return (
     <div className="container mx-auto px-4 py-8 max-w-3xl">
       <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
         {isEditing ? 'Edit Project' : 'Add New Project'}
       </h1>
 
       <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
         <div>
           <label className="block text-lg font-semibold text-gray-700 mb-2">Title</label>
           <input
             type="text"
             name="title"
             value={formData.title}
             onChange={handleInputChange} // Updates title in formData
             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
             placeholder="The name of project"
             required // Makes this field mandatory
           />
         </div>
 
         <div>
           <label className="block text-lg font-semibold text-gray-700 mb-2">Description</label>
           <textarea
             name="description"
             value={formData.description}
             onChange={handleInputChange} // Updates description in formData
             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
             placeholder="Enter project description"
             rows="4"
             required // Makes this field mandatory
           ></textarea>
         </div>
 
         <div>
           <label className="block text-lg font-semibold text-gray-700 mb-2">Instructions</label>
           <textarea
             name="instructions"
             value={formData.instructions}
             onChange={handleInputChange} // Updates instructions in formData
             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
             placeholder="Provide project instructions"
             rows="4"
             required // Makes this field mandatory
           ></textarea>
         </div>
 
         <div>
           <label className="block text-lg font-semibold text-gray-700 mb-2">Initial Clue</label>
           <input
             type="text"
             name="initial_clue"
             value={formData.initial_clue}
             onChange={handleInputChange} // Updates initial clue in formData
             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
             placeholder="Enter the initial clue"
             required // Makes this field mandatory
           />
         </div>
 
         <div>
           <label className="block text-lg font-semibold text-gray-700 mb-2">Homescreen Display</label>
           <select
             name="homescreen_display"
             value={formData.homescreen_display}
             onChange={handleInputChange} // Updates homescreen display in formData
             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
             required // Makes this field mandatory
           >
             <option value="Display Initial Clue">Display Initial Clue</option>
             <option value="Display Initial Location">Display Initial Location</option>
           </select>
         </div>
 
         <div className="flex items-center space-x-3">
           <input
             type="checkbox"
             name="is_published"
             checked={formData.is_published}
             onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} // Updates publication status in formData
             className="h-5 w-5 text-blue-500 focus:ring-2 focus:ring-blue-400 border-gray-300 rounded"
           />
           <label className="block text-lg font-semibold text-gray-700">Is Published</label>
         </div>
 
         <div>
           <label className="block text-lg font-semibold text-gray-700 mb-2">Participant Scoring</label>
           <select
             name="participant_scoring"
             value={formData.participant_scoring}
             onChange={handleInputChange} // Updates participant scoring method in formData
             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
           >
             <option value="Not Scored">Not Scored</option>
             <option value="Time Based">Time Based</option>
             <option value="Points Based">Points Based</option>
           </select>
         </div>
 
         <button
           type="submit"
           className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
         >
           {isEditing ? 'Update Project' : 'Create Project'}
         </button>
       </form>
     </div>
   );
 };
 
 export default AddProject;
 