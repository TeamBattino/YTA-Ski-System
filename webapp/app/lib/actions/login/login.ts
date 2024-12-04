'use server';
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log('IM SIGNING INNNN IM SIGNINNGGGGGGGGG')
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials. sent from lib/actions/login/login';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}