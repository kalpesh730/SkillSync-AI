import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const CertificationForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    issuingOrganization: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    skills: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        issuingOrganization: initialData.issuingOrganization || '',
        issueDate: initialData.issueDate ? initialData.issueDate.substring(0, 10) : '',
        expiryDate: initialData.expiryDate ? initialData.expiryDate.substring(0, 10) : '',
        credentialId: initialData.credentialId || '',
        credentialUrl: initialData.credentialUrl || '',
        description: initialData.description || '',
        skills: initialData.skills ? initialData.skills.join(', ') : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      skills: formData.skills 
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) 
        : []
    };
    
    if (!submitData.expiryDate) {
      submitData.expiryDate = '';
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <Input label="Certification Name" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. AWS Certified Solutions Architect" />
        </div>
        
        <div className="col-span-2 md:col-span-1">
          <Input label="Issuing Organization" name="issuingOrganization" value={formData.issuingOrganization} onChange={handleChange} required placeholder="e.g. Amazon Web Services" />
        </div>

        <Input label="Issue Date" name="issueDate" type="date" value={formData.issueDate} onChange={handleChange} required />
        <Input label="Expiry Date (if applicable)" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} />

        <Input label="Credential ID" name="credentialId" value={formData.credentialId} onChange={handleChange} placeholder="e.g. ABC123XYZ" />
        <Input label="Credential URL" name="credentialUrl" type="url" value={formData.credentialUrl} onChange={handleChange} placeholder="https://..." />

        <div className="col-span-2">
          <Input label="Skills Acquired (comma separated)" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. Cloud Computing, Architecture" />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows="3"
            placeholder="Additional details about this certification."
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : (initialData ? 'Update Certification' : 'Add Certification')}</Button>
      </div>
    </form>
  );
};

export default CertificationForm;
