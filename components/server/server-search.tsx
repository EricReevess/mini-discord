'use client';

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { useParams, useRouter } from 'next/navigation';

type SearchData = {
  label: string;
  type: 'channel' | 'member';
  data?: {
    id: string;
    name: string;
    icon: React.ReactNode;
  }[];
};

interface Props {
  data: SearchData[];
}
const ServerSearch = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);

  const handleClick = ({
    id: targetId,
    type,
  }: {
    id: string;
    type: 'channel' | 'member';
  }) => {
    setOpen(false);

    if (type === 'member') {
      return router.push(
        `/servers/${params.serverId}/conversations/${targetId}`,
      );
    }
    if (type === 'channel') {
      return router.push(`/servers/${params.serverId}/channels/${targetId}`);
    }
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='group flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-300 dark:hover:bg-zinc-700/50'
      >
        <Search className='size-4 text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300' />
        <span className='text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300'>
          搜索
        </span>
        <kbd className='pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground'>
          <span className='text-xs'>⌘</span> + K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='搜索服务器所有的频道和用户' />
        <CommandList>
          <CommandEmpty>无结果</CommandEmpty>
          {data.map(({ data, type, label }) => {
            if (!data?.length) return null;
            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ id, icon, name }) => (
                  <CommandItem
                    onSelect={() => handleClick({ id, type })}
                    className='flex cursor-pointer items-center gap-x-2'
                    key={id}
                  >
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
