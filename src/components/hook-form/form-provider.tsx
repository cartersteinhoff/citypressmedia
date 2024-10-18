import type { UseFormReturn } from 'react-hook-form';
import { FormProvider as RHFForm } from 'react-hook-form';
import React from 'react';

// ----------------------------------------------------------------------

export type FormProps = {
  onSubmit?: () => void;
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  style?: React.CSSProperties; // Optional style prop
};

export function Form({ children, onSubmit, methods, style }: FormProps) {
  return (
    <RHFForm {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off" style={style}>
        {children}
      </form>
    </RHFForm>
  );
}
