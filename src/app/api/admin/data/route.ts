import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getNavigationData, updateNavigationData } from '@/lib/data';

// Check authentication
async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'authenticated';
}

// POST - Import data
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }

    const importData = await request.json();

    // Validate data structure
    if (!importData.links || !Array.isArray(importData.links)) {
      return NextResponse.json(
        { success: false, error: '数据格式不正确：缺少 links 数组' },
        { status: 400 }
      );
    }

    if (!importData.categories || !Array.isArray(importData.categories)) {
      return NextResponse.json(
        { success: false, error: '数据格式不正确：缺少 categories 数组' },
        { status: 400 }
      );
    }

    // Get current data to merge
    const currentData = await getNavigationData();

    // Merge strategy: replace links and categories, keep site and settings
    const mergedData = {
      ...currentData,
      links: importData.links,
      categories: importData.categories,
      // Optionally merge site and settings if provided
      ...(importData.site && { site: importData.site }),
      ...(importData.settings && { settings: importData.settings }),
    };

    await updateNavigationData(mergedData);

    return NextResponse.json({
      success: true,
      message: '数据导入成功',
      imported: {
        links: importData.links.length,
        categories: importData.categories.length,
      },
    });
  } catch (error) {
    console.error('Import data error:', error);
    return NextResponse.json(
      { success: false, error: '导入数据失败' },
      { status: 500 }
    );
  }
}

// GET - Export data
export async function GET() {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }

    const data = await getNavigationData();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Export data error:', error);
    return NextResponse.json(
      { success: false, error: '导出数据失败' },
      { status: 500 }
    );
  }
}
