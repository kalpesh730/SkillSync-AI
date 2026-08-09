import React from 'react';
import { useAuthStore } from '../../../store/authStore';
import RecommendationCard from '../components/RecommendationCard';
import { Sparkles } from 'lucide-react';

const AIDashboardPage = () => {
  const { user } = useAuthStore();

  if (user?.role !== 'STUDENT') {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        AI features are currently exclusive to students.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-primary-600" />
            AI Career Intelligence
          </h1>
          <p className="text-gray-500 mt-1">Get personalized insights and career direction based on your profile.</p>
        </div>
      </div>

      <RecommendationCard />
      
      {/* Could list top matched jobs here in the future */}
    </div>
  );
};

export default AIDashboardPage;
