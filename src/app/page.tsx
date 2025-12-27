import { getNavigationData, getVisibleCategories, getVisibleLinks } from '@/lib/data';
import { HomeClient } from './HomeClient';

export default async function HomePage() {
  // Fetch data on server side
  const data = await getNavigationData();
  const categories = await getVisibleCategories();
  const links = await getVisibleLinks();

  return (
    <HomeClient
      initialLinks={links}
      initialCategories={categories}
      siteName={data.site.title}
    />
  );
}

export const dynamic = 'force-dynamic';
