import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ 
      ok: true, 
      message: 'ออกจากระบบสำเร็จ' 
    });

    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      expires: new Date(0)
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      ok: false, 
      message: 'เกิดข้อผิดพลาดในการออกจากระบบ' 
    }, { status: 500 });
  }
}