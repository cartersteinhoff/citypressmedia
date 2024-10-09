import { CONFIG } from 'src/config-global';
import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `User edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  // Fetch user data from the relative API endpoint
  const response = await fetch(`/api/get-single-chapter-leader/${id}`);
  console.log(response);

  if (!response.ok) {
    return <p>Error fetching user data</p>;
  }

  const currentUser = await response.json();

  return <UserEditView user={currentUser} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Dynamic page generation
 * Depending on static export configuration
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

/**
 * [2] Static exports
 * Adjusted to fetch the IDs of users dynamically for static exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    const response = await fetch(`/api/get-all-chapter-leaders`);

    if (!response.ok) {
      return [];
    }

    const userList = await response.json();

    return userList.map((user: { id: string }) => ({ id: user.id }));
  }

  return [];
}
