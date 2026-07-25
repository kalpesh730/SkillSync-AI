import Student from '../models/Student.js';
import { NotFoundError, ConflictError } from '../errors/AppError.js';
import { APIFeatures } from '../utils/apiFeatures.js';
import { calculateProfileCompletion } from '../utils/profileCompletion.js';

export class StudentService {
  static async createInitialProfile(userId, tenantId, firstName, lastName, email) {
    const existing = await Student.findOne({ userId });
    if (existing) throw new ConflictError('Student profile already exists for this user.');

    const student = new Student({
      userId,
      tenantId,
      firstName,
      lastName,
      email,
    });
    
    student.profileCompletion = calculateProfileCompletion(student);
    await student.save();
    return student;
  }

  static async getProfileByUserId(userId) {
    const student = await Student.findOne({ userId }).populate('userId', 'email role isActive');
    if (!student) throw new NotFoundError('Student profile not found.');
    return student;
  }

  static async updateProfile(userId, updateData) {
    let student = await Student.findOne({ userId });
    if (!student) throw new NotFoundError('Student profile not found.');

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        student[key] = updateData[key];
      }
    });

    student.profileCompletion = calculateProfileCompletion(student);
    await student.save();
    return student;
  }

  static async getStudentById(studentId, tenantId) {
    const student = await Student.findOne({ _id: studentId, tenantId }).populate('userId', 'email role isActive');
    if (!student) throw new NotFoundError('Student not found.');
    return student;
  }

  static async getAllStudents(tenantId, queryString) {
    const features = new APIFeatures(Student.find({ tenantId }), queryString)
      .filter()
      .search(['firstName', 'lastName', 'usn', 'email'])
      .sort()
      .limitFields()
      .paginate();

    const students = await features.query;
    
    const countFeatures = new APIFeatures(Student.find({ tenantId }), queryString).filter().search(['firstName', 'lastName', 'usn', 'email']);
    const total = await countFeatures.query.countDocuments();
    
    return { students, total };
  }

  static async updateAvatar(userId, fileBase64) {
    const student = await Student.findOne({ userId });
    if (!student) throw new NotFoundError('Student profile not found.');

    student.profilePhoto = fileBase64;
    student.profileCompletion = calculateProfileCompletion(student);
    await student.save();
    
    return student;
  }
}
