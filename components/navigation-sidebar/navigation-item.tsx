'use client';

import { cn } from '@/lib/utils';
import ActionTooltip from '../action-tooltip';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface Props {
  id: string;
  imageUrl: string;
  name: string;
}

const NavigationItem = ({ id, name, imageUrl }: Props) => {
  const params = useParams();
  const router = useRouter();
  const isActive = params?.serverId === id;

  const handleClick = () => {
    router.replace(`/servers/${id}`);
  };

  return (
    <ActionTooltip side='right' label={name}>
      <button
        className='group relative flex items-center'
        onClick={handleClick}
      >
        <div
          className={cn(
            'absolute -left-3 w-[4px] rounded-r-full bg-primary transition-all',
            isActive ? 'h-[36px]' : 'h-[8px]',
            !isActive && 'group-hover:h-[20px]',
          )}
        />
        <div
          className={cn(
            'group relative flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px] select-none',
            isActive && 'rounded-[16px] bg-primary/20 text-primary',
            !isActive && 'bg-primary/10',
          )}
        >
          {imageUrl ? (
            <Image fill src={imageUrl} alt={name} />
          ) : (
            <span className='text-xl uppercase text-primary dark:text-primary/100'>
              {name[0]}
            </span>
          )}
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
