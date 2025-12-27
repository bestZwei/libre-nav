import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (session?.value === 'authenticated') {
      return NextResponse.json({
        success: true,
        authenticated: true,
      });
    }

    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 401 }
    );
  } catch (error) {
    console.error('Check auth error:', error);
    return NextResponse.json(
      { success: false, error: '认证检查失败' },
      { status: 500 }
    );
  }
}
