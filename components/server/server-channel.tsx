'use client';

import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Mic, Video, Hash, Edit, Trash, Lock } from 'lucide-react';
import { useParams } from 'next/navigation';
import ActionTooltip from '../action-tooltip';
import { ModalType, useModal } from '@/app/hooks/use-modal-store';

interface Props {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const CHANNEL_ICON_MAP = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, server, role }: Props) => {
  const params = useParams();
  const { onOpen } = useModal();
  const { channelId } = params;
  const isPublic = channel.name === '公共频道';
  const isActive = channelId === channel.id;
  const Icon = CHANNEL_ICON_MAP[channel.type];

  const handleDeleteChannel = () => {
    onOpen(ModalType.DELETE_CHANNEL, { server, channel });
  };

  const handleEditChannel = () => {
    onOpen(ModalType.EDIT_CHANNEL, { server, channel });
  };

  return (
    <button
      onClick={() => {}}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        isActive && 'bg-zinc-700/20 dark:bg-zinc-700',
      )}
    >
      <Icon className='size-4 flex-shrink-0 text-zinc-500 dark:text-zinc-400' />
      <p
        className={cn(
          'line-clamp-1 text-left text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          isActive &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white',
        )}
      >
        {channel.name}
      </p>
      <div className='ml-auto flex items-center gap-x-2'>
        {!isPublic && role !== MemberRole.GUEST && (
          <>
            <ActionTooltip label='编辑'>
              <Edit
                onClick={handleEditChannel}
                className='hidden size-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300'
              />
            </ActionTooltip>
            <ActionTooltip label='删除'>
              <Trash
                onClick={handleDeleteChannel}
                className='hidden size-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300'
              />
            </ActionTooltip>
          </>
        )}
        {isPublic && (
          <ActionTooltip label='默认频道不可更改'>
            <Lock className='hidden size-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300' />
          </ActionTooltip>
        )}
      </div>
    </button>
  );
};

export default ServerChannel;
