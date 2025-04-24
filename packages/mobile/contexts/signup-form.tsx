import { zodResolver } from '@hookform/resolvers/zod';
import { RelativePathString, usePathname, useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as z from 'zod';

import { CONFIRM_PASSWORD, EMAIL, PASSWORD } from '@/constants/common';
import {
  CODE,
  FIRST_NAME,
  LAST_NAME,
  MIN_PASSWORD_LENGTH,
  SIGNUP_STEPS,
  VERIFICATION_CODE_LENGTH,
} from '@/constants/signup';

const createStepValidator = (currentStep: number) => {
  return z
    .object({
      [EMAIL]:
        currentStep >= 0
          ? z.string().email('Invalid email address.').nonempty('Email address is required.')
          : z.string().optional(),
      [CODE]:
        currentStep >= 1
          ? z
              .string()
              .min(VERIFICATION_CODE_LENGTH, `Verification code must be ${VERIFICATION_CODE_LENGTH} digits`)
              .nonempty('Verification code is required')
          : z.string().optional(),
      [FIRST_NAME]: currentStep >= 2 ? z.string().nonempty('First name is required') : z.string().optional(),
      [LAST_NAME]: currentStep >= 2 ? z.string().nonempty('Last name is required') : z.string().optional(),
      [PASSWORD]:
        currentStep >= 3
          ? z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
          : z.string().optional(),
      [CONFIRM_PASSWORD]:
        currentStep >= 3
          ? z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
          : z.string().optional(),
    })
    .refine(
      (data) => {
        if (currentStep < 3) return true;

        return data[PASSWORD] === data[CONFIRM_PASSWORD];
      },
      {
        message: "Passwords don't match",
        path: [CONFIRM_PASSWORD], // This will show the error under confirm password field
      }
    );
};

export type SignupFormData = {
  [EMAIL]: string;
  [CODE]: string;
  [FIRST_NAME]: string;
  [LAST_NAME]: string;
  [PASSWORD]: string;
  [CONFIRM_PASSWORD]: string;
};

interface SignupFormContextProps {
  methods: ReturnType<typeof useForm<SignupFormData>>;
  currentStep: number;
  nextStep: (data: SignupFormData) => void;
  previousStep: () => void;
}

const SignupFormContext = createContext<SignupFormContextProps>({
  methods: {} as ReturnType<typeof useForm<SignupFormData>>,
  currentStep: 0,
  nextStep: (data: SignupFormData) => {},
  previousStep: () => {},
});

export const SignupFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const methods = useForm<SignupFormData>({
    resolver: (data, context, options) => {
      const stepValidator = createStepValidator(currentStep);
      return zodResolver(stepValidator)(data, context, options);
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      [EMAIL]: '',
      [CODE]: '',
      [FIRST_NAME]: '',
      [LAST_NAME]: '',
      [PASSWORD]: '',
      [CONFIRM_PASSWORD]: '',
    },
  });

  useEffect(() => {
    if (previousPathRef.current !== pathname) {
      let prevStepIndex = -1;
      let currentStepIndex = 0;

      for (const [key, value] of Object.entries(SIGNUP_STEPS)) {
        if (previousPathRef.current === value) prevStepIndex = Number(key);
        if (pathname === value) currentStepIndex = Number(key);
      }

      // We've moved back
      if (prevStepIndex > 0 && currentStepIndex >= 0 && currentStepIndex < prevStepIndex)
        setCurrentStep(currentStepIndex);

      previousPathRef.current = pathname;
    }
  }, [pathname]);

  const previousStep = () => {
    if (currentStep === 0) router.back();

    const prevStep = currentStep - 1;

    setCurrentStep(prevStep);

    router.back();
  };

  const nextStep = () => {
    const next = currentStep + 1;

    router.push(`/(signup)${SIGNUP_STEPS[next]}` as RelativePathString);

    setCurrentStep(next);
  };

  return (
    <SignupFormContext.Provider value={{ methods, currentStep, nextStep, previousStep }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </SignupFormContext.Provider>
  );
};

export const useSignupForm = () => useContext(SignupFormContext);
