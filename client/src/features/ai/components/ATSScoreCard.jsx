import React, { useEffect } from 'react';
import { useAIStore } from '../../../store/aiStore';
import { Card } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Button from '../../../components/ui/Button';

const ATSScoreCard = ({ jobId }) => {
  const { atsScore, loadingATS, error, fetchATSScore } = useAIStore();

  useEffect(() => {
    if (jobId) {
      fetchATSScore(jobId);
    }
  }, [jobId, fetchATSScore]);

  if (loadingATS) {
    return (
      <Card className="flex justify-center items-center h-48">
        <LoadingSpinner />
        <span className="ml-3 text-gray-500">Analyzing Resume...</span>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-100 flex flex-col items-center justify-center p-6">
        <p className="text-red-600 mb-4 text-center">{error}</p>
        <Button variant="outline" size="sm" onClick={() => fetchATSScore(jobId)}>
          Retry Analysis
        </Button>
      </Card>
    );
  }

  if (!atsScore) return null;

  return (
    <Card className="bg-gradient-to-br from-white to-primary-50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          ATS Resume Score
        </h3>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-extrabold text-primary-600">{atsScore.overallScore}%</span>
          <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">Match Rate</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
          <div className="text-xs text-gray-500 mb-1">Skills</div>
          <div className="font-bold text-gray-800">{atsScore.skillsScore}%</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
          <div className="text-xs text-gray-500 mb-1">Experience</div>
          <div className="font-bold text-gray-800">{atsScore.experienceScore}%</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
          <div className="text-xs text-gray-500 mb-1">Education</div>
          <div className="font-bold text-gray-800">{atsScore.educationScore}%</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
          <div className="text-xs text-gray-500 mb-1">Keywords</div>
          <div className="font-bold text-gray-800">{atsScore.keywordScore}%</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Missing Key Skills</h4>
          <div className="flex flex-wrap gap-2">
            {atsScore.missingSkills.length > 0 ? (
              atsScore.missingSkills.map((skill, idx) => (
                <Badge key={idx} variant="danger">{skill}</Badge>
              ))
            ) : (
              <span className="text-sm text-gray-500">None detected!</span>
            )}
          </div>
        </div>

        {atsScore.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">How to Improve</h4>
            <ul className="space-y-1">
              {atsScore.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start">
                  <span className="text-primary-500 mr-2">•</span> {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ATSScoreCard;
