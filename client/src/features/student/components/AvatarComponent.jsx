import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const AvatarComponent = ({ profilePhoto, firstName, lastName, onUpload, editable = false }) => {
  const fileInputRef = useRef(null);

  const getInitials = () => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}` || '?';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative inline-block">
      {profilePhoto ? (
        <img
          src={profilePhoto}
          alt={`${firstName} ${lastName}`}
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-sm">
          {getInitials()}
        </div>
      )}
      
      {editable && (
        <button
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
          title="Upload Photo"
        >
          <Camera className="w-4 h-4 text-gray-600" />
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />
    </div>
  );
};

export default AvatarComponent;
