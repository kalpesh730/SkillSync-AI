/**
 * Calculates the percentage of profile completion based on populated fields.
 * @param {Object} student - The student document object.
 * @returns {Number} - Percentage between 0 and 100.
 */
export const calculateProfileCompletion = (student) => {
  if (!student) return 0;

  // Define the critical fields that contribute to profile completion
  const fieldsToCheck = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'usn',
    'rollNumber',
    'branch',
    'semester',
    'gender',
    'dateOfBirth',
    'address', // For objects, we can check if it exists and has at least one key
    'profilePhoto',
  ];

  let filledFields = 0;

  fieldsToCheck.forEach((field) => {
    const value = student[field];
    if (value !== undefined && value !== null && value !== '') {
      if (field === 'address') {
        if (typeof value === 'object' && Object.values(value).some((v) => v !== '' && v !== null)) {
          filledFields++;
        }
      } else {
        filledFields++;
      }
    }
  });

  const completionPercentage = Math.round((filledFields / fieldsToCheck.length) * 100);
  return completionPercentage;
};
