import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../ui/Modal';

const CATEGORIES = [
  'Programming Language', 'Framework', 'Library', 'Database',
  'Cloud', 'DevOps', 'AI/ML', 'Tool', 'Soft Skill', 'Language', 'Other'
];

const PROFICIENCIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const SkillForm = ({ isOpen, onClose, initialData, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          ...initialData,
          lastUsed: initialData.lastUsed ? new Date(initialData.lastUsed).toISOString().split('T')[0] : ''
        });
      } else {
        reset({
          name: '',
          category: 'Programming Language',
          proficiency: 'Beginner',
          yearsOfExperience: 0,
          lastUsed: ''
        });
      }
    }
  }, [isOpen, initialData, reset]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Skill' : 'Add New Skill'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name *</label>
          <input 
            {...register('name', { required: 'Skill name is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. React, Python"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select 
              {...register('category', { required: 'Category is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency *</label>
            <select 
              {...register('proficiency', { required: 'Proficiency is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PROFICIENCIES.map(prof => <option key={prof} value={prof}>{prof}</option>)}
            </select>
            {errors.proficiency && <p className="text-red-500 text-xs mt-1">{errors.proficiency.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
            <input 
              type="number"
              step="0.5"
              min="0"
              {...register('yearsOfExperience', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Used (Optional)</label>
            <input 
              type="date"
              max={new Date().toISOString().split('T')[0]}
              {...register('lastUsed')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t mt-4">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center min-w-[80px]"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SkillForm;
