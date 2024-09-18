'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import axios from 'axios';
// import { useRouter } from 'next/navigation';
import { ModalType, useModal } from '@/app/hooks/use-modal-store';

import { useState } from 'react';
import { ServerWithMembersWithProfiles } from '@/types';
import { ScrollArea } from '../ui/scroll-area';
import UserAvatar from '../user-avatar';
import { MemberRole } from '@prisma/client';
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldQuestion,
  User,
  UserMinus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const ROLE_ICON_MAP = {
  [MemberRole.GUEST]: <User className='size-4 text-zinc-600' />,
  [MemberRole.MODERATOR]: <Shield className='size-4 text-green-600' />,
  [MemberRole.ADMIN]: <ShieldCheck className='size-4 text-blue-600' />,
};

const ROLE_NAME_MAP = {
  [MemberRole.GUEST]: '游客',
  [MemberRole.MODERATOR]: '版主',
  [MemberRole.ADMIN]: '管理员',
};

const MembersModal = () => {
  const router = useRouter();
  const { isOpen, type, onClose, data, onOpen } = useModal();
  const { toast } = useToast();
  // const router = useRouter();
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const isModalOpen = isOpen && type === ModalType.MEMBERS;

  const [loadingId, setLoadingId] = useState('');

  const handleRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const res = await axios.patch(`/api/members/${memberId}`, {
        role,
        serverId: server.id,
      });

      if (!res.data) {
        throw new Error('服务器没有返回数据');
      }

      router.refresh();
      onOpen(ModalType.MEMBERS, { server: res.data });
    } catch (error) {
      console.error(error);
      toast({
        title: '角色修改失败',
        description: JSON.stringify(error),
        variant: 'destructive',
        duration: 1000,
      });
    } finally {
      setLoadingId('');
    }
  };

  const handleKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const res = await axios.delete(`/api/members/${memberId}`, {
        params: {
          serverId: server.id,
        },
      });

      if (!res.data) {
        throw new Error('服务器没有返回数据');
      }

      router.refresh();
      onOpen(ModalType.MEMBERS, { server: res.data });
    } catch (error) {
      console.error(error);
      toast({
        title: '移除成员失败',
        description: JSON.stringify(error),
        variant: 'destructive',
        duration: 1000,
      });
    } finally {
      setLoadingId('');
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='overflow-hidden bg-white text-slate-900'>
        <DialogHeader>
          <DialogTitle>管理成员</DialogTitle>
          <DialogDescription className='text-zinc-500'>
            总共 {server?.members?.length} 位成员
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='mt-2 max-h-[240px]'>
          {server?.members?.map((member) => (
            <div key={member.id} className='mb-3 flex items-center gap-x-2'>
              <UserAvatar src={member.profile.imageUrl} />
              <div className='flex flex-col gap-y-1'>
                <div className='text-sx flex items-center gap-x-1 font-semibold'>
                  {member.profile.name}
                  <div className='flex gap-x-1'>
                    {ROLE_ICON_MAP[member.role]}
                    <span className='text-xs font-normal text-zinc-500'>
                      {ROLE_NAME_MAP[member.role]}
                    </span>
                  </div>
                </div>
                <p className='text-xs text-zinc-500'>{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className='ml-auto'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className='size-4 text-zinc-500' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side='bottom'>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <ShieldQuestion className='mr-2 size-4' />
                            <span>角色</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {Object.keys(ROLE_ICON_MAP)
                                .map((roleName) => {
                                  if (roleName === MemberRole.ADMIN)
                                    return null;
                                  return (
                                    <DropdownMenuItem
                                      key={roleName}
                                      onClick={() =>
                                        handleRoleChange(
                                          member.id,
                                          roleName as MemberRole,
                                        )
                                      }
                                    >
                                      <div className='flex items-center gap-x-1'>
                                        {ROLE_ICON_MAP[roleName as MemberRole]}
                                        {ROLE_NAME_MAP[roleName as MemberRole]}
                                      </div>
                                      {member.role === roleName && (
                                        <Check className='ml-auto size-4 text-green-500' />
                                      )}
                                    </DropdownMenuItem>
                                  );
                                })
                                .filter(Boolean)}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleKick(member.id)}>
                          <UserMinus className='mr-2 size-4' />
                          移除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className='ml-auto size-4 animate-spin text-zinc-500' />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
