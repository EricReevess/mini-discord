import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import ServerHeader from './server-header';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch from './server-search';
import { Hash, Mic, Shield, ShieldCheck, User, Video } from 'lucide-react';
import { Separator } from '../ui/separator';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import ServerMember from './server-member';

interface Props {
  serverId: string;
}

const CHANNEL_ICON_MAP = {
  [ChannelType.TEXT]: <Hash className=', size-4' />,
  [ChannelType.AUDIO]: <Mic className=', size-4' />,
  [ChannelType.VIDEO]: <Video className=', size-4' />,
};

const ROLE_ICON_MAP = {
  [MemberRole.GUEST]: <User className='size-4 text-zinc-600' />,
  [MemberRole.MODERATOR]: <Shield className='size-4 text-green-600' />,
  [MemberRole.ADMIN]: <ShieldCheck className='size-4 text-blue-600' />,
};

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
      <ScrollArea className='mt-2 flex-1 px-2'>
        <ServerSearch
          data={[
            {
              label: '文字频道',
              type: 'channel',
              data: textChannels.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: CHANNEL_ICON_MAP[channel.type],
              })),
            },
            {
              label: '语音频道',
              type: 'channel',
              data: audioChannels.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: CHANNEL_ICON_MAP[channel.type],
              })),
            },
            {
              label: '视频频道',
              type: 'channel',
              data: videoChannels.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: CHANNEL_ICON_MAP[channel.type],
              })),
            },
            {
              label: '成员',
              type: 'member',
              data: otherMembers.map((member) => ({
                id: member.id,
                name: member.profile.name,
                icon: ROLE_ICON_MAP[member.role],
              })),
            },
          ]}
        />
        <Separator className='my-2 rounded-md bg-zinc-200 dark:bg-zinc-700' />
        {!!textChannels.length && (
          <div>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.TEXT}
              role={role}
              label='文字频道'
              server={server}
            />
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        {!!audioChannels.length && (
          <div>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.AUDIO}
              role={role}
              label='语音频道'
              server={server}
            />
            {audioChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        {!!videoChannels.length && (
          <div>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.VIDEO}
              role={role}
              label='视频频道'
              server={server}
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        {!!otherMembers.length && (
          <div>
            <ServerSection
              sectionType='members'
              role={role}
              label='服务器成员'
              server={server}
            />
            {otherMembers.map((member) => (
              <ServerMember key={member.id} member={member} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
