import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getNavigationData,
  addCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/data';

// Check authentication
async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'authenticated';
}

// GET - Get all categories
export async function GET() {
  try {
    const data = await getNavigationData();
    return NextResponse.json({
      success: true,
      data: data.categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { success: false, error: '获取分类失败' },
      { status: 500 }
    );
  }
}

// POST - Add new category
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }

    const categoryData = await request.json();
    
    if (!categoryData.name || !categoryData.icon) {
      return NextResponse.json(
        { success: false, error: '缺少必需字段' },
        { status: 400 }
      );
    }

    const newCategory = await addCategory(categoryData);

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: '分类添加成功',
    });
  } catch (error) {
    console.error('Add category error:', error);
    return NextResponse.json(
      { success: false, error: '添加分类失败' },
      { status: 500 }
    );
  }
}

// PUT - Update category
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
        { success: false, error: '缺少分类 ID' },
        { status: 400 }
      );
    }

    const updatedCategory = await updateCategory(id, updates);

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: '分类不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: '分类更新成功',
    });
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      { success: false, error: '更新分类失败' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
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
        { success: false, error: '缺少分类 ID' },
        { status: 400 }
      );
    }

    const deleted = await deleteCategory(id);

    return NextResponse.json({
      success: true,
      message: '分类删除成功',
    });
  } catch (error: unknown) {
    console.error('Delete category error:', error);
    const message = error instanceof Error ? error.message : '删除分类失败';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
