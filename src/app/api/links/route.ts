import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getNavigationData,
  addLink,
  updateLink,
  deleteLink,
} from '@/lib/data';
import type { NavLink } from '@/types';

// Check authentication
async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'authenticated';
}

// GET - Get all links
export async function GET() {
  try {
    const data = await getNavigationData();
    return NextResponse.json({
      success: true,
      data: data.links,
    });
  } catch (error) {
    console.error('Get links error:', error);
    return NextResponse.json(
      { success: false, error: '获取链接失败' },
      { status: 500 }
    );
  }
}

// POST - Add new link
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }

    const linkData = await request.json();
    
    // Validate required fields
    if (!linkData.title || !linkData.url || !linkData.categoryId) {
      return NextResponse.json(
        { success: false, error: '缺少必需字段' },
        { status: 400 }
      );
    }

    const newLink = await addLink(linkData);

    return NextResponse.json({
      success: true,
      data: newLink,
      message: '链接添加成功',
    });
  } catch (error) {
    console.error('Add link error:', error);
    return NextResponse.json(
      { success: false, error: '添加链接失败' },
      { status: 500 }
    );
  }
}

// PUT - Update link
export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }

    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少链接 ID' },
        { status: 400 }
      );
    }

    const updatedLink = await updateLink(id, updates);

    if (!updatedLink) {
      return NextResponse.json(
        { success: false, error: '链接不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedLink,
      message: '链接更新成功',
    });
  } catch (error) {
    console.error('Update link error:', error);
    return NextResponse.json(
      { success: false, error: '更新链接失败' },
      { status: 500 }
    );
  }
}

// DELETE - Delete link
export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少链接 ID' },
        { status: 400 }
      );
    }

    const deleted = await deleteLink(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: '链接不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '链接删除成功',
    });
  } catch (error) {
    console.error('Delete link error:', error);
    return NextResponse.json(
      { success: false, error: '删除链接失败' },
      { status: 500 }
    );
  }
}
