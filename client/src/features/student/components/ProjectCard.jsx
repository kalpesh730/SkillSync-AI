import React from 'react';
import { Edit2, Trash2, Code2, ExternalLink, Calendar, Code, User, Briefcase } from 'lucide-react';
import Button from '../../../components/ui/Button';

const ProjectCard = ({ project, onEdit, onDelete, editable = true }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              {project.projectType}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 mt-2 gap-4">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5" />
              {project.startDate ? new Date(project.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'N/A'} - 
              {project.currentlyWorking ? ' Present' : (project.endDate ? ` ${new Date(project.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}` : ' N/A')}
            </span>
            {project.role && (
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1.5" />
                {project.role}
              </span>
            )}
            {project.teamSize > 0 && (
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1.5" />
                Team of {project.teamSize}
              </span>
            )}
          </div>

          {project.description && (
            <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">
              {project.description}
            </p>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-4 flex items-start gap-2">
              <Code className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(project.githubUrl || project.liveUrl) && (
            <div className="mt-4 flex gap-4 text-sm font-medium">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                  <Code2 className="w-4 h-4 mr-1.5" />
                  Source Code
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
        
        {editable && (
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
            <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
              <Edit2 className="w-4 h-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(project._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
