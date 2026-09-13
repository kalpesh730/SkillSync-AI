import React, { useEffect } from 'react';
import { useAnalyticsStore } from '../../../store/analyticsStore';
import { useAuthStore } from '../../../store/authStore';
import { Card } from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { Briefcase, Users, UserCheck, BarChart2, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  const { companyAnalytics, loadingCompany, error, fetchCompanyAnalytics } = useAnalyticsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.companyId) {
      fetchCompanyAnalytics();
    }
  }, [fetchCompanyAnalytics, user?.companyId]);

  const isUnassociated = !user?.companyId || (error && error.toLowerCase().includes('not associated with a company'));

  if (loadingCompany) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;

  if (isUnassociated) {
    const isCompanyHR = user?.role === 'COMPANY_HR';
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center max-w-2xl mx-auto my-6">
        <div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-5 text-amber-600">
          <Building2 className="w-7 h-7" />
        </div>

        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-800 border border-amber-200 mb-3">
          Company setup required
        </div>

        <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          Company setup required
        </h3>

        <p className="text-gray-600 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
          Your recruiter account is not currently associated with a company.
          {isCompanyHR
            ? ' As a Company HR representative, you can register and establish your company profile within the placement ecosystem to begin posting jobs and reviewing applicants.'
            : ' Please coordinate with your organization’s Company HR administrator or your college placement team to connect your recruiter account.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/companies"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            {isCompanyHR ? '[Complete Company Setup]' : 'View Partner Companies'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            to="/support"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-all"
          >
            Contact Placement Office
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
          Once your company association is completed, hiring analytics, applicant funnels, and pipeline metrics will automatically become available here.
        </div>
      </div>
    );
  }

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
