import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
 
async function getAdmin(admin_username: string){
  console.log('trying to get admin');
  try{
    const admin = await prisma.admin.findUnique({
      where: { username: admin_username },
    });

    if (!admin) {
      console.log('Admin not found');
      return null;  // Explicitly return null if no admin is found
    }

    return {
      id: admin?.admin_id,
      username: admin?.username,
      password: admin?.password
    };
  } catch (error){
    console.log('couldnt fetch admin')
    return null;
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials) {
          console.log('No credentials provided');
          return null;
        }
        console.log(credentials)

        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

          console.log(parsedCredentials);

          
 
        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const admin = await getAdmin(username);
          if (!admin) return null;
          console.log('THIS IS THE ADMIN PASSUWADO: ' + admin.password);
          console.log('THIS IS THE PASSWORD U PUT HEHE: ' + password)
          const passwordsMatch = (admin.password === password);
          if(passwordsMatch){
            return admin;
          }
        }
        console.log('Invalid credentials, sent from auth.ts');
        return null;
      },
    }),
  ],
});