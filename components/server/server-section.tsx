'use client';

import { ServerWithMembersWithProfiles } from '@/types';
import { ChannelType, MemberRole } from '@prisma/client';
import ActionTooltip from '../action-tooltip';
import { Plus, Settings } from 'lucide-react';
import { ModalType, useModal } from '@/app/hooks/use-modal-store';

interface Props {
  label: string;
  sectionType: 'channels' | 'members';
  role?: MemberRole;
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: Props) => {
  const { onOpen } = useModal();
  const handleCreateChannel = () => {
    onOpen(ModalType.CREATE_CHANNEL, { server, channelType });
  };

  const handleMangeMembers = () => {
    onOpen(ModalType.MEMBERS, { server });
  };

  return (
    <div className='flex items-center justify-between py-2'>
      <p className='text-xs font-semibold'>{label}</p>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip label='创建频道'>
          <button
            onClick={handleCreateChannel}
            className='text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'
          >
            <Plus className='size-4' />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label='管理成员'>
          <button
            onClick={handleMangeMembers}
            className='text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300'
          >
            <Settings className='size-4' />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
