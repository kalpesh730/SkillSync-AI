import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const EducationForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    institutionName: '',
    university: '',
    degree: '',
    specialization: '',
    educationLevel: 'Bachelors',
    semester: '',
    cgpa: '',
    percentage: '',
    passingYear: '',
    startYear: '',
    endYear: '',
    status: 'Completed',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        institutionName: initialData.institutionName || '',
        university: initialData.university || '',
        degree: initialData.degree || '',
        specialization: initialData.specialization || '',
        educationLevel: initialData.educationLevel || 'Bachelors',
        semester: initialData.semester || '',
        cgpa: initialData.cgpa || '',
        percentage: initialData.percentage || '',
        passingYear: initialData.passingYear || '',
        startYear: initialData.startYear || '',
        endYear: initialData.endYear || '',
        status: initialData.status || 'Completed',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Auto-convert numeric fields
    const numericFields = ['semester', 'cgpa', 'percentage', 'passingYear', 'startYear', 'endYear'];
    const finalValue = numericFields.includes(name) && value !== '' ? Number(value) : value;
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Institution Name" name="institutionName" value={formData.institutionName} onChange={handleChange} required />
        <Input label="University/Board (Optional)" name="university" value={formData.university} onChange={handleChange} />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
          <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="High School">High School (10th)</option>
            <option value="Higher Secondary">Higher Secondary (12th)</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelors">Bachelors Degree</option>
            <option value="Masters">Masters Degree</option>
            <option value="Doctorate">Doctorate</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Input label="Degree / Course" name="degree" value={formData.degree} onChange={handleChange} required placeholder="e.g. B.Tech, BSc" />
        <Input label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Computer Science" />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="Pursuing">Pursuing</option>
            <option value="Completed">Completed</option>
            <option value="Dropped">Dropped</option>
          </select>
        </div>

        <Input label="Start Year" name="startYear" type="number" min="1900" max={new Date().getFullYear()} value={formData.startYear} onChange={handleChange} />
        <Input label="End Year" name="endYear" type="number" min="1900" max={new Date().getFullYear() + 10} value={formData.endYear} onChange={handleChange} />
        
        {formData.status === 'Pursuing' && (
          <Input label="Current Semester" name="semester" type="number" min="1" max="10" value={formData.semester} onChange={handleChange} />
        )}
        
        <Input label="CGPA (out of 10)" name="cgpa" type="number" step="0.01" min="0" max="10" value={formData.cgpa} onChange={handleChange} />
        <Input label="Percentage" name="percentage" type="number" step="0.01" min="0" max="100" value={formData.percentage} onChange={handleChange} />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : (initialData ? 'Update Education' : 'Add Education')}</Button>
      </div>
    </form>
  );
};

export default EducationForm;
