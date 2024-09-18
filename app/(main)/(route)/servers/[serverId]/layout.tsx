import ServerSidebar from '@/components/server/server-sidebar';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
  params: { serverId: string };
}

const ServerLayout = async ({ children, params }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect('/');
  }

  return (
    <div className='h-full'>
      <div className='fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex'>
        <ServerSidebar serverId={server.id} />
      </div>
      <main className='h-full md:pl-60'>{children}</main>
    </div>
  );
};

export default ServerLayout;
