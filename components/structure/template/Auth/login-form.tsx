// LoginForm.tsx
'use client';

import * as z from "zod";
import React, { useState, useTransition } from 'react';
import { CardWrapper } from '../../molecules/Auth/card-wrapper';
import { Button } from "@/components/ui/shadcn/button";
import {
  Form
} from "@/components/ui/shadcn/form";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from '@/schemas';
import { FormError } from "../../molecules/FormState/form-error";
import { FormSucess } from "../../molecules/FormState/form-sucess";
import { login } from "@/actions/login";
import { FormInputField } from '@/components/structure/molecules/FormInputField/FormInputField';  // Importing the separate FormInputField component

export const LoginForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values).then(data => {
        if (data) {
          if (data.success) {
            setSuccess(data.success || "");
            setTimeout(() => {
              router.push("/");
            }, 500);
          } else {
            setError(data.error || "")
          }
        }
      });
    });

  };

  return (
    <CardWrapper 
      headerLabel='Welcome back'
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            {/* Using the imported FormInputField component */}
            <FormInputField 
              name="username" 
              label="Username" 
              placeholder="someone" 
              type="text" 
              form={form} 
              isPending={isPending} 
            />

            <FormInputField 
              name="password" 
              label="Password" 
              placeholder="******" 
              type="password" 
              form={form} 
              isPending={isPending} 
            />
          </div>
              {success && <FormSucess message={success} />}
              {error && <FormError message={error} />}
          <Button 
            disabled={isPending} 
            type="submit" 
            className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
