'use client';

import { cn } from '@/lib/utils';
import { Member, MemberRole, Profile, Server } from '@prisma/client';
import { User, Shield, ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import UserAvatar from '../user-avatar';

interface Props {
  member: Member & { profile: Profile };
  server: Server;
}

export const ROLE_ICON_MAP = {
  [MemberRole.GUEST]: <User className='size-4 text-zinc-600 dark:text-zinc-400' />,
  [MemberRole.MODERATOR]: <Shield className='size-4 text-green-600' />,
  [MemberRole.ADMIN]: <ShieldCheck className='size-4 text-blue-600' />,
};
const ServerMember = ({ member, server }: Props) => {
  const params = useParams();
  const router = useRouter();
  const isActive = params?.memberId === member.id;
  return (
    <button
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        isActive && 'bg-zinc-700/20 dark:bg-zinc-700',
      )}
    >
      <UserAvatar src={member.profile.imageUrl} className='size-6' />
      <p
        className={cn(
          'line-clamp-1 text-left text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          isActive &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white',
        )}
      >
        {member.profile.name}
      </p>
      {ROLE_ICON_MAP[member.role]}
    </button>
  );
};

export default ServerMember;
