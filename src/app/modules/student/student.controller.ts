import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { studentServices } from './student.service';

const getAllStudent = catchAsync(async (req, res, next) => {
  const result = await studentServices.getALLStudentFromDB(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'students are retrieved successfully',
    data: result,
  });
});
// get a single data
const getStudent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await studentServices.getStudentFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Single student is retrieved successfully',
    data: result,
  });
});
const deleteStudent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await studentServices.deleteStudentFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Single student is deleted successfully',
    data: result,
  });
});
const updateStudent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await studentServices.updateStudentFromDB(id, student);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Single student is updated successfully',
    data: result,
  });
});

export const studentControllers = {
  getAllStudent,
  getStudent,
  deleteStudent,
  updateStudent,
};
