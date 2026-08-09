import React, { useEffect } from 'react';
import { useAnalyticsStore } from '../../../store/analyticsStore';
import { Card } from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { GraduationCap, Building2, Briefcase, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const CollegeAdminDashboard = () => {
  const { tenantAnalytics, loadingTenant, error, fetchTenantAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchTenantAnalytics();
  }, [fetchTenantAnalytics]);

  if (loadingTenant) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
  if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;
  if (!tenantAnalytics) return null;

  const { students, companies, applications } = tenantAnalytics;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Students</p>
              <h3 className="text-2xl font-bold">{students.total}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Partner Companies</p>
              <h3 className="text-2xl font-bold">{companies.total}</h3>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Jobs</p>
              <h3 className="text-2xl font-bold">{companies.activeJobs}</h3>
            </div>
          </div>
        </Card>

        <Card className="bg-white border-primary-200 shadow-sm shadow-primary-100">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 font-medium">Placement Rate</p>
              <h3 className="text-3xl font-bold text-primary-700">{students.placementRate}%</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Placement Overview</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Students Placed</span>
                <span className="font-bold text-gray-900">{students.placed} / {students.total}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-primary-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${students.placementRate}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{applications.total}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-500">Avg. Apps per Student</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{applications.avgPerStudent}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 col-span-2 flex justify-between items-center">
                <div>
                  <p className="text-sm text-green-700 font-medium">Total Selections</p>
                  <p className="text-2xl font-bold text-green-800">{applications.selected}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Quick Navigation</h3>
          <div className="space-y-3">
            <Link to="/companies" className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-900">Manage Companies</span>
                </div>
                <span className="text-gray-400">&rarr;</span>
              </div>
            </Link>
            
            <Link to="/jobs" className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-900">View All Jobs</span>
                </div>
                <span className="text-gray-400">&rarr;</span>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CollegeAdminDashboard;
