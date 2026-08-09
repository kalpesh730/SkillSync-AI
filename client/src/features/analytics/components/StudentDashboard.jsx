import React, { useEffect } from 'react';
import { useAnalyticsStore } from '../../../store/analyticsStore';
import { Card } from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Target, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { studentAnalytics, loadingStudent, error, fetchStudentAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchStudentAnalytics();
  }, [fetchStudentAnalytics]);

  if (loadingStudent) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
  if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;
  if (!studentAnalytics) return null;

  const { profile, applications } = studentAnalytics;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Target className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Profile Completeness</p>
              <h3 className="text-2xl font-bold">{profile.completeness}%</h3>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Applications</p>
              <h3 className="text-2xl font-bold">{applications.total}</h3>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Shortlisted / Interviews</p>
              <h3 className="text-2xl font-bold">{applications.shortlisted + applications.interviews}</h3>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Success Rate</p>
              <h3 className="text-2xl font-bold">{applications.successRate}%</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Profile Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Primary Resume</span>
              {profile.hasPrimaryResume ? (
                <span className="text-green-600 text-sm font-medium">Uploaded</span>
              ) : (
                <span className="text-red-500 text-sm font-medium">Missing</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Skills Added</span>
              <span className="text-gray-900 font-medium">{profile.skillCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Projects Added</span>
              <span className="text-gray-900 font-medium">{profile.projectCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Certifications</span>
              <span className="text-gray-900 font-medium">{profile.certificationCount}</span>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/student/profile" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              Update Profile &rarr;
            </Link>
          </div>
        </Card>

        <Card className="bg-white">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Application Funnel</h3>
          {applications.total === 0 ? (
            <div className="text-center py-6 text-gray-500">
              You haven't applied to any jobs yet.
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Applied/Screening', count: applications.byStatus['APPLIED'] + applications.byStatus['SCREENING'], color: 'bg-blue-500' },
                { label: 'Shortlisted', count: applications.shortlisted, color: 'bg-yellow-500' },
                { label: 'Interviews', count: applications.interviews, color: 'bg-purple-500' },
                { label: 'Selected', count: applications.selected, color: 'bg-green-500' },
                { label: 'Rejected', count: applications.rejected, color: 'bg-red-500' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{stat.label}</span>
                    <span className="font-medium">{stat.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${stat.color} h-2 rounded-full`} 
                      style={{ width: `${Math.max((stat.count / applications.total) * 100, 2)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6">
            <Link to="/applications" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              View Applications &rarr;
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
