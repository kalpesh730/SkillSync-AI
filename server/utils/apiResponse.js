import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const success = (res, data, message = MESSAGES.SUCCESS) => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data,
  });
};

export const created = (res, data, message = 'Resource created successfully.') => {
  return res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message,
    data,
  });
};

export const updated = (res, data, message = 'Resource updated successfully.') => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data,
  });
};

export const deleted = (res, message = 'Resource deleted successfully.') => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data: null,
  });
};

export const paginated = (res, data, metadata, message = MESSAGES.SUCCESS) => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data,
    metadata,
  });
};
