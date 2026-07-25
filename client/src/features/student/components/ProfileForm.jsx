import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ProfileForm = ({ profile, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phone: profile?.phone || '',
    usn: profile?.usn || '',
    rollNumber: profile?.rollNumber || '',
    branch: profile?.branch || '',
    semester: profile?.semester || '',
    section: profile?.section || '',
    gender: profile?.gender || '',
    dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
    address: {
      street: profile?.address?.street || '',
      city: profile?.address?.city || '',
      state: profile?.address?.state || '',
      zipCode: profile?.address?.zipCode || '',
      country: profile?.address?.country || '',
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: name === 'semester' ? (value ? parseInt(value) : '') : value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
        <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
        <Input label="Email Address" type="email" value={profile?.email || ''} disabled helpText="Email cannot be changed directly." />
        <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="USN" name="usn" value={formData.usn} onChange={handleChange} />
          <Input label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleChange} />
          <Input label="Branch / Department" name="branch" value={formData.branch} onChange={handleChange} />
          <Input label="Semester" name="semester" type="number" min="1" max="10" value={formData.semester} onChange={handleChange} />
          <Input label="Section" name="section" value={formData.section} onChange={handleChange} />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <Input label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input label="Street Address" name="address.street" value={formData.address.street} onChange={handleChange} />
          </div>
          <Input label="City" name="address.city" value={formData.address.city} onChange={handleChange} />
          <Input label="State/Province" name="address.state" value={formData.address.state} onChange={handleChange} />
          <Input label="Zip/Postal Code" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} />
          <Input label="Country" name="address.country" value={formData.address.country} onChange={handleChange} />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
