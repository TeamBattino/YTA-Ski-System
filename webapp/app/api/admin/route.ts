import { admin } from '@prisma/client';
import { NextResponse } from 'next/server';
import { loginAdmin } from '@/app/lib/actions/admin/data';

export async function POST(req: Request) {
  if (!req.body) return NextResponse.json({ message: 'Error: body is empty' }, { status: 400 }); 
  try {
    const data: admin = await req.json();
    
    if (!data.username || !data.password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const admin = await loginAdmin(data.username, data.password);
    return NextResponse.json(admin);
  } catch (error) {
    console.error('Error handling POST request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
