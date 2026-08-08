import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PROJECT_TYPES = [
  'Academic',
  'Personal',
  'Internship',
  'Freelance',
  'Research',
  'Open Source',
  'Other',
];

const ProjectForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    projectType: 'Personal',
    role: '',
    teamSize: 1,
    startDate: '',
    endDate: '',
    currentlyWorking: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        technologies: initialData.technologies ? initialData.technologies.join(', ') : '',
        githubUrl: initialData.githubUrl || '',
        liveUrl: initialData.liveUrl || '',
        projectType: initialData.projectType || 'Personal',
        role: initialData.role || '',
        teamSize: initialData.teamSize || 1,
        startDate: initialData.startDate ? initialData.startDate.substring(0, 10) : '',
        endDate: initialData.endDate ? initialData.endDate.substring(0, 10) : '',
        currentlyWorking: initialData.currentlyWorking || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'teamSize') {
      setFormData(prev => ({ ...prev, [name]: value ? Number(value) : '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      technologies: formData.technologies 
        ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean) 
        : []
    };
    
    if (submitData.currentlyWorking) {
      submitData.endDate = '';
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Project Title" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. SkillSync" />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
          <select name="projectType" value={formData.projectType} onChange={handleChange} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            {PROJECT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows="3"
            placeholder="Describe your project, what it does, and your contribution."
          ></textarea>
        </div>

        <div className="col-span-2">
          <Input label="Technologies (comma separated)" name="technologies" value={formData.technologies} onChange={handleChange} placeholder="e.g. React, Node.js, MongoDB" />
        </div>

        <Input label="Role" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Full Stack Developer" />
        <Input label="Team Size" name="teamSize" type="number" min="1" value={formData.teamSize} onChange={handleChange} />

        <Input label="GitHub URL" name="githubUrl" type="url" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/..." />
        <Input label="Live Demo URL" name="liveUrl" type="url" value={formData.liveUrl} onChange={handleChange} placeholder="https://..." />

        <Input label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
        
        <div>
          <Input 
            label="End Date" 
            name="endDate" 
            type="date" 
            value={formData.endDate} 
            onChange={handleChange} 
            disabled={formData.currentlyWorking}
            className={formData.currentlyWorking ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
          />
          <div className="mt-2 flex items-center">
            <input
              id="currentlyWorking"
              name="currentlyWorking"
              type="checkbox"
              checked={formData.currentlyWorking}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="currentlyWorking" className="ml-2 block text-sm text-gray-900">
              I am currently working on this project
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : (initialData ? 'Update Project' : 'Add Project')}</Button>
      </div>
    </form>
  );
};

export default ProjectForm;
