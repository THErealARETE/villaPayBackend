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
