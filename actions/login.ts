"use server"
import * as z from "zod"
import { LoginSchema } from "@/schemas"
import { AuthenticateUser } from "@/utils/AuthenticateUser";
// import { cookies } from "next/headers";

export const login = async (values: z.infer<typeof LoginSchema>) =>{
    const validatedField = LoginSchema.safeParse(values);

    // const cookieStore = cookies();
    const username = validatedField.data?.username;
    const password = validatedField.data?.password;

    // const response = await fetch("https://www.test.backend.fatmug.co.in/api/token/", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ username, password }),
    //   });
    
    //   if (!response.ok) {
    //     throw new Error("Authentication failed");
    //   }
    
    //   const data = await response.json();

    //   cookieStore.set("accessToken", `${data.access}`)

    const validauth = AuthenticateUser(username as string, password as string);

    // if(!data) {
    //     return { error: "Authentication failed. Invalid credentials."};
    // }


    if(!validauth) {
        return { error: "Authentication failed. Invalid credentials."};
    }

    if(!validatedField.success){
        return {error: "Invalid fields!"};
    }

    return {
       success: "User logged in sucessfully."
    };
};