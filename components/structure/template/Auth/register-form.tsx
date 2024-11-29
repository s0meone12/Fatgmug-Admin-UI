// RegisterForm.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { RegisterSchema } from '@/schemas';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardWrapper } from '../../molecules/Auth/card-wrapper';
import { Form } from "@/components/ui/shadcn/form";
import { Button } from '@/components/ui/shadcn/button';
import { FormError } from '../../molecules/FormState/form-error';
import { FormSucess } from '../../molecules/FormState/form-sucess';
import { register } from '@/actions/register';
import { FormInputField } from '@/components/structure/molecules/FormInputField/FormInputField';  // Importing FormInputField component

export default function RegisterForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "", 
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    }
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    if (values.password !== values.confirm_password) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    localStorage.setItem("value", values.name);

    startTransition(async () => {
      const data = await register(values);
      setError(data.error ?? "");
      setSuccess(data.success ?? "");
    });
  };

  return (
    <CardWrapper 
      headerLabel="Create an account"
      backButtonLabel="Already have an account"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Using FormInputField to render each field */}
            <FormInputField 
              name="name" 
              label="Name" 
              placeholder="John Doe" 
              type="text" 
              form={form} 
              isPending={isPending} />

            <FormInputField 
                name="username" 
                label="Username" 
                placeholder="Username" 
                type="text" 
                form={form} 
                isPending={isPending} />

            <FormInputField 
                name="email" 
                label="Email" 
                placeholder="someone@some.com" 
                type="email" 
                form={form}     
                isPending={isPending} />

            <FormInputField 
                name="password" 
                label="Password" 
                placeholder="******" 
                type="password" 
                form={form} 
                isPending={isPending} />

            <FormInputField 
                name="confirm_password" 
                label="Confirm Password" 
                placeholder="******" 
                type="password" 
                form={form}     
                isPending={isPending} />
                
          </div>
              {success && <FormSucess message={success} />}
              {error && <FormError message={error} />}
          <Button 
              disabled={isPending} 
              type="submit" 
              className="w-full">
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
