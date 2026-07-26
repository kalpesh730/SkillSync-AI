import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { useSkillStore } from '../../store/skillStore.js';
import SkillCard from './SkillCard.jsx';
import SkillForm from './SkillForm.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'All', 'Programming Language', 'Framework', 'Database',
  'Cloud', 'AI/ML', 'Tool', 'Soft Skill', 'Language', 'Other'
];

const PROFICIENCIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

const SkillList = () => {
  const { skillList, loading, error, fetchMySkills, addSkill, updateSkill, deleteSkill, clearError } = useSkillStore();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Task 3.5 Filters and Search
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeProficiency, setActiveProficiency] = useState('All');
  const [sortBy, setSortBy] = useState('Newest'); // Alphabetical, Newest, Oldest

  useEffect(() => {
    fetchMySkills();
  }, [fetchMySkills]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const filteredAndSortedSkills = useMemo(() => {
    let result = [...skillList];

    // Filter by Search
    if (searchTerm.trim() !== '') {
      result = result.filter(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(skill => skill.category === activeCategory);
    }

    // Filter by Proficiency
    if (activeProficiency !== 'All') {
      result = result.filter(skill => skill.proficiency === activeProficiency);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'Alphabetical') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'Oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        // Default to Newest
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [skillList, searchTerm, activeCategory, activeProficiency, sortBy]);

  const handleAddSubmit = async (data) => {
    setIsSubmitting(true);
    const res = await addSkill(data);
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Skill added successfully');
      setIsFormOpen(false);
    }
  };

  const handleEditSubmit = async (data) => {
    setIsSubmitting(true);
    const res = await updateSkill(editingSkill._id, data);
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Skill updated successfully');
      setEditingSkill(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      const res = await deleteSkill(id);
      if (res.success) {
        toast.success('Skill deleted');
      }
    }
  };

  if (loading && skillList.length === 0) {
    return (
      <div className="p-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Skills & Competencies</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your technical and soft skills.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          <Plus size={18} />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search skills by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Filters & Sorting Controls */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            <select
              value={activeProficiency}
              onChange={(e) => setActiveProficiency(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
            >
              <option disabled>Proficiency</option>
              {PROFICIENCIES.map(prof => <option key={prof} value={prof}>{prof}</option>)}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[120px]"
            >
              <option disabled>Sort By</option>
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100 bg-gray-50 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredAndSortedSkills.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredAndSortedSkills.map((skill) => (
            <SkillCard 
              key={skill._id}
              skill={skill} 
              onEdit={setEditingSkill}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No skills found"
          description={skillList.length > 0 
            ? "No skills match your current search and filter criteria." 
            : "You haven't added any skills yet. Add your first skill to improve your profile."}
          action={
            skillList.length > 0 && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                  setActiveProficiency('All');
                }}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Clear all filters
              </button>
            )
          }
        />
      )}

      {/* Forms */}
      <SkillForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleAddSubmit}
        isLoading={isSubmitting}
      />
      
      <SkillForm 
        isOpen={!!editingSkill}
        initialData={editingSkill}
        onClose={() => setEditingSkill(null)} 
        onSubmit={handleEditSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default SkillList;
