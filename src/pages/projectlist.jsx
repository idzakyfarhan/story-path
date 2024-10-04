// ProjectList.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function ProjectList({ projects, deleteProject }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Projects</h2>
          <Link to="/add-project">
            <button className="mb-6 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-300 ease-in-out">
              Add Project
            </button>
          </Link>

          {projects.length === 0 ? (
            <p className="text-lg text-gray-600">No projects found.</p>
          ) : (
            <ul className="space-y-4">
              {projects.map((project) => (
                <li key={project.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                    <p className="text-gray-600">{project.description}</p>
                    <p className="text-gray-600"><strong>Instructions:</strong> {project.instructions}</p>
                    <p className="text-gray-600"><strong>Initial Clue:</strong> {project.initial_clue}</p>
                    <p className="text-gray-600"><strong>Homescreen Display:</strong> {project.homescreen_display}</p>
                    <p className="text-gray-600"><strong>Participant Scoring:</strong> {project.participant_scoring}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className={`text-sm font-medium px-4 py-2 rounded-lg shadow ${project.is_published ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} border border-${project.is_published ? 'green' : 'red'}-300`}>
                      {project.is_published ? 'Published' : 'Not Published'}
                    </span>

                    <div className="flex space-x-4 items-center">
                      <Link to={`/edit-project/${project.id}`}>
                        <button className="text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition duration-300 ease-in-out">Edit</button>
                      </Link>
                      
                      <Link to={`/projects/${project.id}/locations`}>
                        <button className="text-blue-500 border border-blue-300 px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition duration-300 ease-in-out">View Locations</button>
                      </Link>
                      
                      <button
                        className="text-red-500 border border-red-300 px-4 py-2 rounded-lg shadow hover:bg-red-100 transition duration-300 ease-in-out"
                        onClick={() => deleteProject(project.id)}
                      >
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

export default ProjectList;
