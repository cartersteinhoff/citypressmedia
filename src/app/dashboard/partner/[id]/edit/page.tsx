import { CONFIG } from 'src/config-global';
import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `User edit | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  // Dynamically determine the base URL based on the environment
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8082' // Development URL
      : 'https://citypressmedia.com'; // Production URL

  // Fetch user data from the appropriate API endpoint
  const response = await fetch(`${baseUrl}/api/chapter-leader/?id=${id}`);
  console.log(18, response);

  if (!response.ok) {
    return <p>Error fetching user data</p>;
  }

  const currentUser = await response.json();
  console.log(currentUser);

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
