import { ControllerResponse, ControllerResponseMetadata } from '../entities';

export const createControllerResponse = <T = null>(arg: {
  data: T;
  metadata?: ControllerResponseMetadata;
}): ControllerResponse<T> => {
  return {
    data: arg.data,
    metadata: { message: 'success', ...arg.metadata },
  };
};

export const formatErrorLog = (error: unknown) => {
  if (error instanceof Error) {
    return {
      errorStack: error.stack,
      errorName: error.name,
      errorMessage: error.message,
    };
  }
  return {
    errorStack: JSON.stringify(error),
    errorName: 'UnknownError',
    errorMessage: 'Unknown error',
  };
};
