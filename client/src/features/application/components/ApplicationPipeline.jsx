import React, { useState } from 'react';
import { useApplicationStore } from '../../../store/applicationStore';
import Button from '../../../components/ui/Button';

const PIPELINE_STAGES = [
  { id: 'APPLIED', label: 'Applied', color: 'bg-gray-100' },
  { id: 'SCREENING', label: 'Screening', color: 'bg-blue-100' },
  { id: 'SHORTLISTED', label: 'Shortlisted', color: 'bg-yellow-100' },
  { id: 'INTERVIEW', label: 'Interview', color: 'bg-indigo-100' },
  { id: 'SELECTED', label: 'Selected', color: 'bg-green-100' },
  { id: 'REJECTED', label: 'Rejected', color: 'bg-red-100' },
];

const ApplicationPipeline = ({ applications }) => {
  const { updateApplicationStatus, updateRecruiterNotes } = useApplicationStore();
  const [selectedApp, setSelectedApp] = useState(null);
  const [notes, setNotes] = useState('');

  const getApplicationsByStatus = (status) => {
    return applications.filter(app => app.status === status);
  };

  const handleStatusChange = async (appId, newStatus) => {
    await updateApplicationStatus(appId, newStatus);
    setSelectedApp(null); // Reset selection
  };

  const handleNotesSave = async () => {
    if (selectedApp) {
      await updateRecruiterNotes(selectedApp._id, notes);
      setSelectedApp(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Kanban Board */}
      <div className="flex flex-1 overflow-x-auto space-x-4 pb-4">
        {PIPELINE_STAGES.map(stage => (
          <div key={stage.id} className="min-w-[280px] bg-gray-50 rounded-lg flex flex-col">
            <div className={`px-4 py-3 rounded-t-lg font-semibold flex justify-between items-center ${stage.color}`}>
              <span>{stage.label}</span>
              <span className="bg-white text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {getApplicationsByStatus(stage.id).length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {getApplicationsByStatus(stage.id).map(app => (
                <div 
                  key={app._id} 
                  className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-pointer hover:border-primary-400"
                  onClick={() => {
                    setSelectedApp(app);
                    setNotes(app.recruiterNotes || '');
                  }}
                >
                  <h4 className="font-medium text-gray-900">
                    {app.studentId?.firstName} {app.studentId?.lastName}
                  </h4>
                  <p className="text-sm text-gray-500 mb-2 truncate">{app.studentId?.email}</p>
                  
                  {app.appliedAt && (
                    <p className="text-xs text-gray-400">
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal / Side Panel */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-left">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Applicant Details</h3>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900">
                  {selectedApp.studentId?.firstName} {selectedApp.studentId?.lastName}
                </h4>
                <p className="text-gray-500">{selectedApp.studentId?.email}</p>
              </div>

              {selectedApp.coverLetter && (
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Cover Letter</h5>
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 whitespace-pre-wrap">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              <div>
                <h5 className="font-semibold text-gray-700 mb-2">Move to Stage</h5>
                <select 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2 border"
                  value={selectedApp.status}
                  onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)}
                >
                  {PIPELINE_STAGES.map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.label}</option>
                  ))}
                  <option value="WITHDRAWN">Withdrawn</option>
                </select>
              </div>

              <div>
                <h5 className="font-semibold text-gray-700 mb-2">Recruiter Notes</h5>
                <textarea
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-3"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Private notes..."
                />
                <Button variant="primary" size="sm" className="mt-2" onClick={handleNotesSave}>
                  Save Notes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationPipeline;
