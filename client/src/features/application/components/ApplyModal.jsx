import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useApplicationStore } from '../../../store/applicationStore';
import { useResumeStore } from '../../../store/resumeStore';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const ApplyModal = ({ job, isOpen, onClose, onSuccess }) => {
  const { applyToJob, loading: applyLoading } = useApplicationStore();
  const { resumes, fetchResumes, loading: resumesLoading } = useResumeStore();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isOpen) {
      fetchResumes();
    }
  }, [isOpen, fetchResumes]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setError('');
    const result = await applyToJob({
      jobId: job._id,
      resumeId: data.resumeId,
      coverLetter: data.coverLetter,
    });

    if (result.success) {
      onSuccess?.();
      onClose();
    } else {
      setError(result.error || 'Failed to submit application');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            Apply to {job.companyId?.name}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h4 className="font-medium text-gray-900">{job.title}</h4>
            <p className="text-sm text-gray-500">{job.location?.city}, {job.location?.country}</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {resumesLoading ? (
            <div className="flex justify-center py-4"><LoadingSpinner /></div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-6 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-yellow-800 text-sm mb-2">You need to upload a resume before applying.</p>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/resumes'}>
                Go to Resumes
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Resume <span className="text-red-500">*</span></label>
                <select
                  {...register('resumeId', { required: 'Please select a resume' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  defaultValue={resumes.find(r => r.isPrimary)?._id || ''}
                >
                  <option value="">-- Select a Resume --</option>
                  {resumes.map(resume => (
                    <option key={resume._id} value={resume._id}>
                      {resume.name || resume.fileName} {resume.isPrimary ? '(Primary)' : ''}
                    </option>
                  ))}
                </select>
                {errors.resumeId && <p className="mt-1 text-sm text-red-600">{errors.resumeId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
                <textarea
                  {...register('coverLetter', { maxLength: { value: 2000, message: 'Max 2000 characters' } })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Introduce yourself and explain why you're a good fit for this role..."
                ></textarea>
                {errors.coverLetter && <p className="mt-1 text-sm text-red-600">{errors.coverLetter.message}</p>}
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onClose} disabled={applyLoading}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={applyLoading}>
                  {applyLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;
