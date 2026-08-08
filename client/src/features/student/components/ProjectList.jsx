import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { useProjectStore } from '../../../store/projectStore';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import Modal from '../../../components/ui/Modal';
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Input from '../../../components/ui/Input';
import toast from 'react-hot-toast';

const PROJECT_TYPES = [
  'All',
  'Academic',
  'Personal',
  'Internship',
  'Freelance',
  'Research',
  'Open Source',
  'Other',
];

const ProjectList = () => {
  const { projects, isLoading, fetchProjects, createProject, updateProject, deleteProject } = useProjectStore();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterWorking, setFilterWorking] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, alphabetical

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAddClick = () => {
    setEditingProject(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    let res;
    if (editingProject) {
      res = await updateProject(editingProject._id, formData);
    } else {
      res = await createProject(formData);
    }
    
    if (res.success) {
      toast.success(editingProject ? 'Project updated successfully' : 'Project added successfully');
      setIsFormModalOpen(false);
    } else {
      toast.error(res.error || 'Operation failed');
    }
  };

  const handleConfirmDelete = async () => {
    const res = await deleteProject(deletingId);
    if (res.success) {
      toast.success('Project deleted successfully');
      setIsDeleteModalOpen(false);
    } else {
      toast.error(res.error || 'Failed to delete project');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('All');
    setFilterWorking(false);
    setSortBy('newest');
  };

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.technologies && p.technologies.some(t => t.toLowerCase().includes(query)))
      );
    }

    // Filter by type
    if (filterType !== 'All') {
      result = result.filter(p => p.projectType === filterType);
    }

    // Filter by currently working
    if (filterWorking) {
      result = result.filter(p => p.currentlyWorking === true);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return (a.title || '').localeCompare(b.title || '');
      }
      
      const dateA = new Date(a.endDate || a.startDate || a.createdAt).getTime();
      const dateB = new Date(b.endDate || b.startDate || b.createdAt).getTime();
      
      if (sortBy === 'oldest') {
        return dateA - dateB;
      }
      
      // Default newest
      return dateB - dateA;
    });

    return result;
  }, [projects, searchQuery, filterType, filterWorking, sortBy]);

  if (isLoading && projects.length === 0) {
    return <div className="py-8"><LoadingSpinner /></div>;
  }

  const hasActiveFilters = searchQuery !== '' || filterType !== 'All' || filterWorking || sortBy !== 'newest';

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-900">Projects</h2>
        <Button onClick={handleAddClick} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects by title, description, or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {PROJECT_TYPES.map(type => (
                  <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                id="filterWorking"
                type="checkbox"
                checked={filterWorking}
                onChange={(e) => setFilterWorking(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="filterWorking" className="ml-2 block text-sm text-gray-700">
                Only show active projects
              </label>
            </div>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <EmptyState 
          title="No Projects Added" 
          description="Showcase your skills by adding personal, academic, or professional projects."
          action={<Button onClick={handleAddClick} variant="primary" size="sm">Add Project</Button>}
        />
      ) : filteredAndSortedProjects.length === 0 ? (
        <EmptyState 
          title="No Matching Projects" 
          description="Try adjusting your search or filters to find what you're looking for."
          action={<Button onClick={clearFilters} variant="outline" size="sm">Clear Filters</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedProjects.map(project => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title={editingProject ? "Edit Project" : "Add Project"}
      >
        <div className="p-1">
          <ProjectForm 
            initialData={editingProject} 
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
            isLoading={isLoading}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProjectList;
