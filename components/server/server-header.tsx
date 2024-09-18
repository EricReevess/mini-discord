'use client';

import { ServerWithMembersWithProfiles } from '@/types';
import { MemberRole } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react';
import { ModalType, useModal } from '@/app/hooks/use-modal-store';

interface Props {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}
const ServerHeader = ({ server, role }: Props) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerate = isAdmin || role === MemberRole.MODERATOR;

  const handleInvite = () => {
    onOpen(ModalType.INVITE, { server });
  };

  const handleEditServer = () => {
    onOpen(ModalType.EDIT_SERVER, { server });
  };

  const handleMembers = () => {
    onOpen(ModalType.MEMBERS, { server });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className='focus:outline-none' asChild>
          <button className='flex h-12 w-full items-center justify-between border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50'>
            {server.name}
            <ChevronDown className='h-5 w-5' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 space-y-[2px] text-xs font-medium text-black dark:bg-zinc-700 dark:text-neutral-400'>
          {isModerate && (
            <>
              <DropdownMenuItem className='cursor-pointer px-3 py-2 text-sm'>
                创建频道
                <PlusCircle className='ml-auto h-4 w-4' />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleInvite}
                className='cursor-pointer px-3 py-2 text-sm'
              >
                邀请朋友
                <UserPlus className='ml-auto h-4 w-4' />
              </DropdownMenuItem>
            </>
          )}
          {isAdmin && (
            <>
              <DropdownMenuItem
                onClick={handleEditServer}
                className='cursor-pointer px-3 py-2 text-sm'
              >
                服务器设置
                <Settings className='ml-auto h-4 w-4' />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleMembers}
                className='cursor-pointer px-3 py-2 text-sm'
              >
                成员管理
                <Users className='ml-auto h-4 w-4' />
              </DropdownMenuItem>
            </>
          )}
          {isModerate && <DropdownMenuSeparator />}
          {isAdmin ? (
            <DropdownMenuItem className='cursor-pointer px-3 py-2 text-sm text-rose-500'>
              删除服务器
              <Trash className='ml-auto h-4 w-4' />
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className='cursor-pointer px-3 py-2 text-sm text-rose-500'>
              离开服务器
              <LogOut className='ml-auto h-4 w-4' />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ServerHeader;
