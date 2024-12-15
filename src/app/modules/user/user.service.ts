import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import config from '../../config/index';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generatedStudentId } from './user.utils';

const createStudentIntoDb = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);

  // set the role
  userData.role = 'Student';

  // find academic semester
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    if (!admissionSemester) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Semester Id not found');
    }
    userData.id = await generatedStudentId(admissionSemester);
    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); //user array

    // create a student
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create new User');
    }
    // set id ,_id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    // create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to create new Student',
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to create new Student');
  }
};
export const UserServices = {
  createStudentIntoDb,
};
