import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicationStore } from '../../../store/applicationStore';
import useJobStore from '../../../store/jobStore';
import ApplicationPipeline from '../components/ApplicationPipeline';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Button from '../../../components/ui/Button';
import { ArrowLeft, Users } from 'lucide-react';

const JobApplicationsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { applications, fetchJobApplications, loading, error } = useApplicationStore();
  const { currentJob, getJob, loading: jobLoading } = useJobStore();
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (jobId) {
      getJob(jobId);
      fetchJobApplications(jobId);
    }
  }, [jobId, getJob, fetchJobApplications]);

  if (loading || jobLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  const filteredApplications = applications.filter(app => {
    if (!searchTerm) return true;
    const name = `${app.studentId?.firstName} ${app.studentId?.lastName}`.toLowerCase();
    const email = app.studentId?.email?.toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center mb-2">
            <button 
              onClick={() => navigate('/jobs')} 
              className="mr-3 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-2 text-primary-600" />
              Applications
            </h1>
          </div>
          <p className="text-gray-500 mt-1 pl-8">
            {currentJob?.title} - {applications.length} Total Applicants
          </p>
        </div>
        
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <ApplicationPipeline applications={filteredApplications} />
    </div>
  );
};

export default JobApplicationsPage;
