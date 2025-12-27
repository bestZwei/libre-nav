import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyPassword, getSessionExpiry } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password, action } = await request.json();

    // Logout
    if (action === 'logout') {
      const cookieStore = await cookies();
      cookieStore.delete('admin_session');
      
      return NextResponse.json({
        success: true,
        message: '已退出登录',
      });
    }

    // Login
    if (!password) {
      return NextResponse.json(
        { success: false, error: '密码不能为空' },
        { status: 400 }
      );
    }

    const isValid = verifyPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 }
      );
    }

    // Set session cookie
    const cookieStore = await cookies();
    const expiresAt = getSessionExpiry();
    
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(expiresAt),
    });

    return NextResponse.json({
      success: true,
      message: '登录成功',
      expiresAt,
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    
    return NextResponse.json({
      success: true,
      authenticated: session?.value === 'authenticated',
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
