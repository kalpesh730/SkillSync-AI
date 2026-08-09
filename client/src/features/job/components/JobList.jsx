import React, { useEffect, useState } from 'react';
import useJobStore from '../../../store/jobStore';
import { useAuthStore } from '../../../store/authStore';
import JobCard from './JobCard';
import JobForm from './JobForm';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Button from '../../../components/ui/Button';
import { Plus } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';

const JobList = ({ companyId }) => {
  const { jobs, fetchCompanyJobs, fetchPublishedJobs, updateJobStatus, deleteJob, isLoading, error } = useJobStore();
  const { user } = useAuthStore();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingJobId, setDeletingJobId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmployment, setFilterEmployment] = useState('');
  const [filterWorkplace, setFilterWorkplace] = useState('');

  const isRecruiter = ['COLLEGE_ADMIN', 'PLACEMENT_OFFICER', 'COMPANY_HR', 'RECRUITER'].includes(user?.role);

  useEffect(() => {
    if (isRecruiter && companyId) {
      fetchCompanyJobs(companyId);
    } else {
      fetchPublishedJobs();
    }
  }, [fetchCompanyJobs, fetchPublishedJobs, isRecruiter, companyId]);

  const handleEdit = (job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingJob(null);
    setIsFormOpen(false);
  };

  const handleUpdateStatus = async (jobId, status) => {
    await updateJobStatus(jobId, status);
  };

  const handleDeleteConfirm = async () => {
    if (deletingJobId) {
      await deleteJob(deletingJobId);
      setDeletingJobId(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.companyId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmployment = filterEmployment ? job.employmentType === filterEmployment : true;
    const matchesWorkplace = filterWorkplace ? job.workplaceType === filterWorkplace : true;
    return matchesSearch && matchesEmployment && matchesWorkplace;
  });

  if (isLoading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isRecruiter ? 'Company Jobs' : 'Available Jobs'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isRecruiter ? 'Manage your job postings.' : 'Discover and apply to open positions.'}
          </p>
        </div>
        {isRecruiter && companyId && (
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Post Job
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search jobs or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <select
          value={filterEmployment}
          onChange={(e) => setFilterEmployment(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">All Employment Types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="FREELANCE">Freelance</option>
        </select>
        <select
          value={filterWorkplace}
          onChange={(e) => setFilterWorkplace(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">All Workplaces</option>
          <option value="ON_SITE">On-site</option>
          <option value="HYBRID">Hybrid</option>
          <option value="REMOTE">Remote</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      {filteredJobs.length === 0 && !isLoading ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No jobs found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard 
              key={job._id} 
              job={job} 
              canManage={isRecruiter && (!user.companyId || user.companyId === job.companyId?._id || user.companyId === job.companyId)}
              onEdit={handleEdit}
              onDelete={(id) => setDeletingJobId(id)}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}

      {isRecruiter && (
        <>
          <Modal
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            title={editingJob ? 'Edit Job' : 'Post New Job'}
            size="2xl"
          >
            <JobForm 
              initialData={editingJob} 
              companyId={companyId}
              onSuccess={handleCloseForm} 
              onCancel={handleCloseForm} 
            />
          </Modal>

          <ConfirmationDialog
            isOpen={!!deletingJobId}
            title="Delete Job"
            message="Are you sure you want to delete this job? This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeletingJobId(null)}
            variant="danger"
          />
        </>
      )}
    </div>
  );
};

export default JobList;
