import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import NavigationAction from './navigation-action';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import NavigationItem from './navigation-item';
import { ModeToggle } from '../mode-toggle';
import { UserButton } from '@clerk/nextjs';

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
    orderBy: {
      createAt: 'asc',
    },
  });

  return (
    <div className='flex h-full w-full flex-col items-center space-y-4 py-3 text-primary dark:bg-[#1E1F22]'>
      <NavigationAction />
      <Separator className='mx-auto h-[1px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
      <ScrollArea className='w-full flex-1'>
        {servers.map((server) => (
          <div className='relative mb-4 flex justify-center' key={server.id}>
            <NavigationItem {...server} />
          </div>
        ))}
      </ScrollArea>
      <div className='mt-auto flex flex-col items-center gap-y-4 pb-3'>
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-[48px] w-[48px]',
            },
          }}
        />
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavigationSidebar;
