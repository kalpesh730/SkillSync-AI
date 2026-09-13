import React, { useEffect } from 'react';
import { useAIStore } from '../../../store/aiStore';
import { Card } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Button from '../../../components/ui/Button';
import { Lightbulb, TrendingUp, BookOpen, Briefcase, FileText, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecommendationCard = () => {
  const { recommendations, loadingRecommendations, error, fetchRecommendations } = useAIStore();

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (loadingRecommendations) {
    return (
      <Card className="flex flex-col justify-center items-center h-64 p-6">
        <LoadingSpinner size="lg" />
        <span className="mt-4 text-sm text-gray-500 font-medium">Generating AI Career Blueprint...</span>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-rose-50 border-rose-100 flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
        <h4 className="font-semibold text-rose-800 text-base mb-1">Unable to Load Career Intelligence</h4>
        <p className="text-rose-600 text-sm mb-4 max-w-md">{error}</p>
        <Button variant="outline" size="sm" onClick={() => fetchRecommendations()}>
          Retry Generation
        </Button>
      </Card>
    );
  }

  if (!recommendations) return null;

  // Check if profile has insufficient data
  const isMinimalData = recommendations.careerDirection?.includes('Complete your profile');

  if (isMinimalData) {
    return (
      <Card className="bg-gradient-to-br from-white to-primary-50/30 border-primary-100 p-8">
        <div className="flex flex-col items-center text-center max-w-lg mx-auto">
          <div className="bg-primary-100 text-primary-600 p-3 rounded-2xl mb-4">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Career Intelligence</h3>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Complete your profile and upload a resume to receive personalized recommendations.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/student/profile/edit">
              <Button size="sm" className="flex items-center gap-1.5">
                Complete Profile <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/student/profile">
              <Button variant="outline" size="sm">
                Upload Resume
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-primary-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center">
          <div className="bg-primary-50 p-2.5 rounded-xl text-primary-600 mr-3">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Career Intelligence</h3>
            <p className="text-xs text-gray-500">Personalized strategic career blueprint based on your profile & skills</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchRecommendations()}
          className="text-xs text-gray-600 hover:text-primary-600"
        >
          Refresh Insights
        </Button>
      </div>

      {/* 1. Career Overview */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1.5 text-primary-600" />
          Career Overview
        </h4>
        <div className="bg-primary-50/70 border border-primary-100 p-4 rounded-xl text-sm text-gray-800 leading-relaxed">
          {recommendations.careerDirection}
        </div>
      </div>

      {/* Grid: Recommended Roles & Recommended Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Recommended Roles */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
            <Briefcase className="w-4 h-4 mr-1.5 text-blue-600" />
            Recommended Roles
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendations.recommendedJobTypes?.map((role, idx) => (
              <Badge key={idx} variant="primary" className="text-xs font-medium py-1 px-2.5">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        {/* 3. Recommended Skills */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
            <BookOpen className="w-4 h-4 mr-1.5 text-emerald-600" />
            Recommended Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendations.recommendedSkills?.map((skill, idx) => (
              <Badge key={idx} variant="warning" className="text-xs font-medium py-1 px-2.5">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Skill Gaps & Learning Suggestions */}
      {recommendations.recommendedProjects && recommendations.recommendedProjects.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
            <BookOpen className="w-4 h-4 mr-1.5 text-indigo-600" />
            Skill Gaps & Learning Suggestions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.recommendedProjects.map((project, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-3.5 rounded-xl text-xs text-gray-700 flex items-start gap-2.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{project}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Resume Suggestions */}
      {recommendations.resumeImprovements && recommendations.resumeImprovements.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center">
            <FileText className="w-4 h-4 mr-1.5 text-amber-600" />
            Resume Suggestions
          </h4>
          <ul className="space-y-2 bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
            {recommendations.resumeImprovements.map((tip, idx) => (
              <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Career Next Steps */}
      {recommendations.priorityActions && recommendations.priorityActions.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center">
            <ArrowRight className="w-4 h-4 mr-1.5 text-primary-600" />
            Career Next Steps
          </h4>
          <div className="space-y-2">
            {recommendations.priorityActions.map((step, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-3 rounded-lg flex items-center gap-3 text-xs text-gray-800 shadow-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 text-primary-700 font-bold text-xs shrink-0">
                  {idx + 1}
                </span>
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default RecommendationCard;
