import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const educationSchema = z.object({
  body: z.object({
    institutionName: z.string().min(2, 'Institution name is required'),
    university: z.string().optional().or(z.literal('')),
    degree: z.string().min(2, 'Degree is required'),
    specialization: z.string().optional().or(z.literal('')),
    educationLevel: z.enum(['High School', 'Higher Secondary', 'Diploma', 'Bachelors', 'Masters', 'Doctorate', 'Other']),
    semester: z.number().min(1).max(10).optional().or(z.literal('')),
    cgpa: z.number().min(0, 'CGPA cannot be negative').max(10, 'CGPA cannot exceed 10').optional().or(z.literal('')),
    percentage: z.number().min(0, 'Percentage cannot be negative').max(100, 'Percentage cannot exceed 100').optional().or(z.literal('')),
    passingYear: z.number().min(1900).max(currentYear + 10).optional().or(z.literal('')),
    startYear: z.number().min(1900).max(currentYear).optional().or(z.literal('')),
    endYear: z.number().min(1900).max(currentYear + 10).optional().or(z.literal('')),
    status: z.enum(['Pursuing', 'Completed', 'Dropped']).default('Completed'),
  }).refine((data) => {
    if (data.startYear && data.endYear) {
      return data.startYear <= data.endYear;
    }
    return true;
  }, {
    message: "Start year cannot be greater than end year",
    path: ["endYear"],
  })
});

export const updateEducationSchema = educationSchema.deepPartial();
