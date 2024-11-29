'use client';

import React from 'react';
import { Input } from '@/components/ui/shadcn/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { UseFormReturn, Path } from 'react-hook-form';
import * as z from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormInputFieldProps<TSchema extends z.ZodType<any, any>> = {
  name: Path<z.infer<TSchema>>;
  label: string;
  placeholder: string;
  type: string;
  form: UseFormReturn<z.infer<TSchema>>;
  isPending: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormInputField = <TSchema extends z.ZodType<any, any>>({
  name,
  label,
  placeholder,
  type,
  form,
  isPending,
}: FormInputFieldProps<TSchema>) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input {...field} disabled={isPending} placeholder={placeholder} type={type} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
