'use client'

import { Plus } from 'lucide-react';
import ActionTooltip from '../action-tooltip';
import { ModalType, useModal } from '@/app/hooks/use-modal-store';

const NavigationAction = () => {
  const { onOpen } = useModal();

  return (
    <div>
      <ActionTooltip label='创建服务器' side='right'>
        <button
          onClick={() => onOpen(ModalType.CREATE_SERVER)}
          className='group flex items-center'
        >
          <div className='flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700'>
            <Plus
              className='text-emerald-500 transition group-hover:text-white'
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
