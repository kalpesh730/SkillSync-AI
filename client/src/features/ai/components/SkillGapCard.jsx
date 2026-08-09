import React, { useEffect } from 'react';
import { useAIStore } from '../../../store/aiStore';
import { Card } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Button from '../../../components/ui/Button';
import { Target } from 'lucide-react';

const SkillGapCard = ({ jobId }) => {
  const { skillGap, loadingSkillGap, error, fetchSkillGap } = useAIStore();

  useEffect(() => {
    if (jobId) {
      fetchSkillGap(jobId);
    }
  }, [jobId, fetchSkillGap]);

  if (loadingSkillGap) {
    return (
      <Card className="flex justify-center items-center h-48">
        <LoadingSpinner />
        <span className="ml-3 text-gray-500">Analyzing Skill Gap...</span>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-100 flex flex-col items-center justify-center p-6">
        <p className="text-red-600 mb-4 text-center">{error}</p>
        <Button variant="outline" size="sm" onClick={() => fetchSkillGap(jobId)}>
          Retry Analysis
        </Button>
      </Card>
    );
  }

  if (!skillGap) return null;

  return (
    <Card className="bg-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary-600" />
          Skill Gap Analysis
        </h3>
        <Badge variant={skillGap.skillGapPercentage < 30 ? 'success' : skillGap.skillGapPercentage < 60 ? 'warning' : 'danger'}>
          {skillGap.skillGapPercentage}% Gap
        </Badge>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Priority Skills to Learn</h4>
          <div className="flex flex-wrap gap-2">
            {skillGap.prioritySkills.length > 0 ? (
              skillGap.prioritySkills.map((skill, idx) => (
                <Badge key={idx} variant="warning">{skill}</Badge>
              ))
            ) : (
              <span className="text-sm text-gray-500">You have all the core skills covered!</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Matched Skills</h4>
          <div className="flex flex-wrap gap-2">
            {skillGap.matchedSkills.length > 0 ? (
              skillGap.matchedSkills.map((skill, idx) => (
                <Badge key={idx} variant="success">{skill}</Badge>
              ))
            ) : (
              <span className="text-sm text-gray-500">None detected</span>
            )}
          </div>
        </div>

        {skillGap.recommendedLearningAreas.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Learning Recommendations</h4>
            <ul className="space-y-1">
              {skillGap.recommendedLearningAreas.map((rec, idx) => (
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

export default SkillGapCard;
