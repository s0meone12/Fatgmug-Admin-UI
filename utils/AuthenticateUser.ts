import { cookies } from 'next/headers';

export function AuthenticateUser(username: string, password: string) {

    const cookieStore  = cookies();

    const validUsername = 'user1';
    const validPassword = 'user1';

    if (username === validUsername && password === validPassword) {
        cookieStore.set("isLoggedIn", "true")
        return true;
 
    } else {
        return false;
    }
}
