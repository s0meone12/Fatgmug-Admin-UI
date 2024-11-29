"use server"
import * as z from "zod"

import { RegisterSchema } from '@/schemas'

export const register = async (values : z.infer<typeof RegisterSchema>) => {
    const validatedField =  RegisterSchema.safeParse(values);

    if(!validatedField){
        return {error: "Invalid fields!" };
    }
    

  return { success: "User created Sucessfully."}
}

