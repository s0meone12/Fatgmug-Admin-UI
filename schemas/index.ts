import * as z from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, { message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});


export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().min(1, { message: "Enter user name" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters long" }),
  confirm_password: z.string().min(4, { message: "Re-enter the password" }),
});


