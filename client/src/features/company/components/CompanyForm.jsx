import React from 'react';
import { useForm } from 'react-hook-form';
import useCompanyStore from '../../../store/companyStore';
import Button from '../../../components/ui/Button';

// Must match server-side validation constants
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'];

const CompanyForm = ({ initialData, onSuccess, onCancel }) => {
  const { createCompany, updateCompany } = useCompanyStore();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData || {
      name: '',
      legalName: '',
      industry: '',
      companySize: '1-10',
      website: '',
      description: '',
      logoUrl: '',
      location: {
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
      contactInfo: {
        email: '',
        phone: '',
      }
    }
  });

  const onSubmit = async (data) => {
    try {
      if (initialData?._id) {
        await updateCompany(initialData._id, data);
      } else {
        await createCompany(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save company', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name *</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Legal Name</label>
          <input
            type="text"
            {...register('legalName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Industry *</label>
          <input
            type="text"
            {...register('industry', { required: 'Industry is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company Size *</label>
          <select
            {...register('companySize')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            {COMPANY_SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          {errors.companySize && <p className="mt-1 text-sm text-red-600">{errors.companySize.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="text"
            placeholder="https://"
            {...register('website')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Logo URL</label>
          <input
            type="text"
            placeholder="https://"
            {...register('logoUrl')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
          {errors.logoUrl && <p className="mt-1 text-sm text-red-600">{errors.logoUrl.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          rows={3}
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Location & Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">City *</label>
            <input
              type="text"
              {...register('location.city', { required: 'City is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {errors.location?.city && <p className="mt-1 text-sm text-red-600">{errors.location.city.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">State *</label>
            <input
              type="text"
              {...register('location.state', { required: 'State is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {errors.location?.state && <p className="mt-1 text-sm text-red-600">{errors.location.state.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Country *</label>
            <input
              type="text"
              {...register('location.country', { required: 'Country is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {errors.location?.country && <p className="mt-1 text-sm text-red-600">{errors.location.country.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              {...register('contactInfo.email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            {errors.contactInfo?.email && <p className="mt-1 text-sm text-red-600">{errors.contactInfo.email.message}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save Changes' : 'Create Company'}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
