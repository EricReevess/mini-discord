import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import ServerHeader from './server-header';

interface Props {
  serverId: string;
}

// 作为独立组件，不需要依赖layout传递服务器信息
const ServerSidebar = async ({ serverId }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createAt: 'asc',
        },
      },
      // 需要当前服务器下的成员, 以成员角色名升序排列
      members: {
        include: {
          profile: true, // 需要每个成员的信息
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });

  if (!server) {
    return redirect('/');
  }

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );

  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );

  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );

  // 筛选出除了当前用户之外的成员
  const otherMembers = server.members.filter(
    (member) => member.profileId !== profile.id,
  );

  const role = server.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  return (
    <div className='flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]'>
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSidebar;
