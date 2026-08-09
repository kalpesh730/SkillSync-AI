import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import useJobStore from '../../../store/jobStore';
import Button from '../../../components/ui/Button';

const EMPLOYMENT_TYPE = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'];
const WORKPLACE_TYPE = ['ON_SITE', 'HYBRID', 'REMOTE'];

const JobForm = ({ initialData, companyId, onSuccess, onCancel }) => {
  const { createJob, updateJob } = useJobStore();
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData ? {
      ...initialData,
      requiredSkills: initialData.requiredSkills?.join(', '),
    } : {
      title: '',
      description: '',
      employmentType: 'FULL_TIME',
      workplaceType: 'ON_SITE',
      location: { city: '', state: '', country: '' },
      experienceRange: { min: 0, max: 0 },
      salaryRange: { min: 0, max: 0, currency: 'USD' },
      openings: 1,
      requiredSkills: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        companyId,
        requiredSkills: data.requiredSkills ? data.requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      if (initialData?._id) {
        await updateJob(initialData._id, payload);
      } else {
        await createJob(payload);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save job', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title *</label>
          <input
            type="text"
            {...register('title', { required: 'Job title is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea
            rows={5}
            {...register('description', { required: 'Description is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employment Type *</label>
            <select
              {...register('employmentType')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {EMPLOYMENT_TYPE.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Workplace Type *</label>
            <select
              {...register('workplaceType')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {WORKPLACE_TYPE.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              {...register('location.city')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              {...register('location.state')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              {...register('location.country')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Min Experience</label>
              <input
                type="number"
                {...register('experienceRange.min', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Max Experience</label>
              <input
                type="number"
                {...register('experienceRange.max', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Min Salary</label>
              <input
                type="number"
                {...register('salaryRange.min', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Max Salary</label>
              <input
                type="number"
                {...register('salaryRange.max', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Required Skills (Comma separated)</label>
          <input
            type="text"
            placeholder="e.g. React, Node.js, TypeScript"
            {...register('requiredSkills')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save Changes' : 'Post Job'}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
