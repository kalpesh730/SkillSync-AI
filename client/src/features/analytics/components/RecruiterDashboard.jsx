import React, { useEffect } from 'react';
import { useAnalyticsStore } from '../../../store/analyticsStore';
import { Card } from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Briefcase, Users, UserCheck, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  const { companyAnalytics, loadingCompany, error, fetchCompanyAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchCompanyAnalytics();
  }, [fetchCompanyAnalytics]);

  if (loadingCompany) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
  if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;
  if (!companyAnalytics) return null;

  const { jobs, applications } = companyAnalytics;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Jobs</p>
              <h3 className="text-2xl font-bold">{jobs.published}</h3>
              <p className="text-xs text-gray-400">of {jobs.total} total</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Applicants</p>
              <h3 className="text-2xl font-bold">{applications.total}</h3>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Shortlisted</p>
              <h3 className="text-2xl font-bold">{applications.shortlisted + applications.interviews}</h3>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <h3 className="text-2xl font-bold">{applications.conversionRate}%</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Hiring Funnel</h3>
          {applications.total === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No applications received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Applied', count: applications.byStatus['APPLIED'], color: 'bg-gray-400' },
                { label: 'Screening', count: applications.byStatus['SCREENING'], color: 'bg-blue-400' },
                { label: 'Shortlisted', count: applications.shortlisted, color: 'bg-yellow-400' },
                { label: 'Interviews', count: applications.interviews, color: 'bg-purple-400' },
                { label: 'Selected', count: applications.selected, color: 'bg-green-500' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{stat.label}</span>
                    <span className="font-medium">{stat.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`${stat.color} h-full rounded-full transition-all duration-500`} 
                      style={{ width: `${Math.max((stat.count / applications.total) * 100, 1)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              <span className="text-red-500 font-medium">{applications.rejected}</span> rejected
            </span>
            <Link to="/jobs" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              Manage Jobs &rarr;
            </Link>
          </div>
        </Card>

        <Card className="bg-white">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <Link to="/jobs" className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-md mr-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Post a New Job</h4>
                  <p className="text-sm text-gray-500">Create a new job listing to attract candidates.</p>
                </div>
              </div>
              <span className="text-gray-400">&rarr;</span>
            </Link>
            
            <Link to="/applications" className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-md mr-3">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Review Applications</h4>
                  <p className="text-sm text-gray-500">View and update candidate statuses.</p>
                </div>
              </div>
              <span className="text-gray-400">&rarr;</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
