import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createProject, updateProject } from '../api';

const AddProject = ({ editProject, projects = [], fetchProjects }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditing = Boolean(id); 
  const existingProject = projects.find((project) => project.id === parseInt(id));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    initial_clue: '',
    homescreen_display: 'Display Initial Clue',
    is_published: false,
    participant_scoring: 'Not Scored',
  });

  useEffect(() => {
    if (isEditing && existingProject) {
      setFormData(existingProject);
    }
  }, [isEditing, existingProject]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProject(id, formData);
        alert('Project updated successfully!');
      } else {
        await createProject(formData); 
        alert('Project created successfully!');
      }
      fetchProjects(); // Refresh the project list after submission
      navigate('/projects'); 
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
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="The name of project"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter project description"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Instructions</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Provide project instructions"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Initial Clue</label>
          <input
            type="text"
            name="initial_clue"
            value={formData.initial_clue}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter the initial clue"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Homescreen Display</label>
          <select
            name="homescreen_display"
            value={formData.homescreen_display}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
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
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="h-5 w-5 text-blue-500 focus:ring-2 focus:ring-blue-400 border-gray-300 rounded"
          />
          <label className="block text-lg font-semibold text-gray-700">Is Published</label>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">Participant Scoring</label>
          <select
            name="participant_scoring"
            value={formData.participant_scoring}
            onChange={handleInputChange}
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
