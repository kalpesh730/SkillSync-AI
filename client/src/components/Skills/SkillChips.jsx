import React from 'react';

const PROFICIENCY_COLORS = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-blue-100 text-blue-800',
  Advanced: 'bg-purple-100 text-purple-800',
  Expert: 'bg-red-100 text-red-800',
};

const SkillChips = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span 
          key={skill._id}
          className={`px-3 py-1 rounded-full text-xs font-medium border ${PROFICIENCY_COLORS[skill.proficiency] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
          title={`${skill.category} • ${skill.yearsOfExperience} yrs`}
        >
          {skill.name}
        </span>
      ))}
    </div>
  );
};

export default SkillChips;
