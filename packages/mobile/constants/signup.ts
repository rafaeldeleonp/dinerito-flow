import { FetchingState, SignupSteps } from '@/types/signup';

export const CODE = 'code';
export const FIRST_NAME = 'firstName';
export const LAST_NAME = 'lastName';

export const MIN_PASSWORD_LENGTH = 8;
export const VERIFICATION_CODE_LENGTH = 6;

export const INITIAL_FETCHING_STATE: FetchingState = {
  isFetching: false,
  error: null,
};

export const SIGNUP_STEPS: { [key: number]: SignupSteps } = {
  0: SignupSteps.ENTER_EMAIL,
  1: SignupSteps.VERIFY_EMAIL,
  2: SignupSteps.PERSONAL_INFO,
  3: SignupSteps.PASSWORD,
  4: SignupSteps.ACCOUNT_CREATED,
};
