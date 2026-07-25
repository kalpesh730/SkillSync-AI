import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useEducationStore } from '../../../store/educationStore';
import EducationCard from './EducationCard';
import EducationForm from './EducationForm';
import Modal from '../../../components/ui/Modal';
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const EducationList = () => {
  const { educationList, loading, fetchMyEducation, addEducation, updateEducation, deleteEducation } = useEducationStore();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMyEducation();
  }, [fetchMyEducation]);

  const handleAddClick = () => {
    setEditingEducation(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (education) => {
    setEditingEducation(education);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    let res;
    if (editingEducation) {
      res = await updateEducation(editingEducation._id, formData);
    } else {
      res = await addEducation(formData);
    }
    
    if (res.success) {
      toast.success(editingEducation ? 'Education updated' : 'Education added');
      setIsFormModalOpen(false);
    } else {
      toast.error(res.error || 'Operation failed');
    }
  };

  const handleConfirmDelete = async () => {
    const res = await deleteEducation(deletingId);
    if (res.success) {
      toast.success('Education deleted');
      setIsDeleteModalOpen(false);
    } else {
      toast.error(res.error || 'Failed to delete');
    }
  };

  if (loading && educationList.length === 0) {
    return <div className="py-8"><LoadingSpinner /></div>;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Education</h2>
        <Button onClick={handleAddClick} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {educationList.length === 0 ? (
        <EmptyState 
          title="No Education Records" 
          description="Add your educational background to stand out to employers."
          action={<Button onClick={handleAddClick} variant="primary" size="sm">Add Education</Button>}
        />
      ) : (
        <div className="space-y-4">
          {educationList.map(edu => (
            <EducationCard 
              key={edu._id} 
              education={edu} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title={editingEducation ? "Edit Education" : "Add Education"}
      >
        <div className="p-1">
          <EducationForm 
            initialData={editingEducation} 
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormModalOpen(false)}
            isLoading={loading}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Education Record"
        message="Are you sure you want to delete this education record? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={loading}
      />
    </div>
  );
};

export default EducationList;
