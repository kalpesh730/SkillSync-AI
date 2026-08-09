import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ResumeMetadataForm = ({ isOpen, onClose, resume, onSubmit }) => {
  const [formData, setFormData] = useState({
    originalFileName: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (resume) {
      setFormData({
        originalFileName: resume.originalFileName || ''
      });
      setErrors({});
    }
  }, [resume, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.originalFileName.trim()) {
      newErrors.originalFileName = 'File name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        originalFileName: formData.originalFileName
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Resume Metadata"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Resume Name"
          name="originalFileName"
          value={formData.originalFileName}
          onChange={(e) => setFormData({ ...formData, originalFileName: e.target.value })}
          error={errors.originalFileName}
          required
          placeholder="e.g., JohnDoe_Resume_2025.pdf"
        />
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ResumeMetadataForm;
