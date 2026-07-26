import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const PROFICIENCY_COLORS = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-blue-100 text-blue-800',
  Advanced: 'bg-purple-100 text-purple-800',
  Expert: 'bg-red-100 text-red-800',
};

const SkillCard = ({ skill, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center">
      <div className="flex-1">
        <h4 className="text-lg font-semibold text-gray-800 mb-1">{skill.name}</h4>
        <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
          <span className="font-medium text-gray-700">{skill.category}</span>
          <span>•</span>
          <span>{skill.yearsOfExperience || 0} {skill.yearsOfExperience === 1 ? 'year' : 'years'} exp</span>
          {skill.lastUsed && (
            <>
              <span>•</span>
              <span>Last Used: {new Date(skill.lastUsed).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PROFICIENCY_COLORS[skill.proficiency] || 'bg-gray-100 text-gray-800'}`}>
          {skill.proficiency}
        </span>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(skill)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit Skill"
          >
            <Pencil size={16} />
          </button>
          <button 
            onClick={() => onDelete(skill._id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete Skill"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
