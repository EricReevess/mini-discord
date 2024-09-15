import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

const NavigationSidebar = async () => {
  const profile = await currentProfile();

  if (!profile) {
    redirect('/');
  }

  // 寻找用户已加入的服务器
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className='space-y-4 flex flex-col items-center h-full w-full text-primary dark:bg-[#1E1F22] py-3'>
      111
    </div>
  );
};

export default NavigationSidebar;
