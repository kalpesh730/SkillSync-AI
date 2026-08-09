import React, { useEffect } from 'react';
import { useAIStore } from '../../../store/aiStore';
import { Card } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Button from '../../../components/ui/Button';
import { Lightbulb, TrendingUp, BookOpen, Briefcase } from 'lucide-react';

const RecommendationCard = () => {
  const { recommendations, loadingRecommendations, error, fetchRecommendations } = useAIStore();

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (loadingRecommendations) {
    return (
      <Card className="flex justify-center items-center h-64">
        <LoadingSpinner />
        <span className="ml-3 text-gray-500">Generating Career Blueprint...</span>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-100 flex flex-col items-center justify-center p-6">
        <p className="text-red-600 mb-4 text-center">{error}</p>
        <Button variant="outline" size="sm" onClick={() => fetchRecommendations()}>
          Retry Generation
        </Button>
      </Card>
    );
  }

  if (!recommendations) return null;

  return (
    <Card className="bg-white border-primary-100">
      <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
        <Lightbulb className="w-6 h-6 mr-3 text-primary-500" />
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI Career Intelligence</h3>
          <p className="text-sm text-gray-500">Personalized strategic blueprint based on your entire profile</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
            Career Direction
          </h4>
          <p className="text-gray-700 bg-primary-50 p-4 rounded-lg text-sm border border-primary-100">
            {recommendations.careerDirection}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
              Priority Actions
            </h4>
            <ul className="space-y-2">
              {recommendations.priorityActions.map((action, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start bg-gray-50 p-2 rounded border border-gray-100">
                  <span className="font-bold text-primary-500 mr-2">{idx + 1}.</span> {action}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
              Target Job Types
            </h4>
            <div className="flex flex-wrap gap-2">
              {recommendations.recommendedJobTypes.map((type, idx) => (
                <Badge key={idx} variant="primary">{type}</Badge>
              ))}
            </div>
            
            <h4 className="text-sm font-semibold text-gray-700 mb-3 mt-6 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              High-Value Skills to Learn
            </h4>
            <div className="flex flex-wrap gap-2">
              {recommendations.recommendedSkills.map((skill, idx) => (
                <Badge key={idx} variant="warning">{skill}</Badge>
              ))}
            </div>
          </div>
        </div>

        {recommendations.resumeImprovements.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Resume Enhancements</h4>
            <ul className="space-y-1">
              {recommendations.resumeImprovements.map((imp, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start">
                  <span className="text-blue-500 mr-2">•</span> {imp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecommendationCard;
