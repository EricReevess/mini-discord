'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import axios from 'axios';
// import { useRouter } from 'next/navigation';
import { ModalType, useModal } from '@/app/hooks/use-modal-store';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import useOrigin from '@/app/hooks/use-origin';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const InviteModal = () => {
  const { isOpen, type, onClose, data, onOpen } = useModal();
  // const router = useRouter();
  const origin = useOrigin();
  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const isModalOpen = isOpen && type === ModalType.INVITE;
  const [isCopied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const [isLoading, setLoading] = useState(false);
  const handleGenNewLink = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      console.log('res:', res);
      onOpen(ModalType.INVITE, { server: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='overflow-hidden bg-white text-slate-900'>
        <DialogHeader>
          <DialogTitle>邀请朋友</DialogTitle>
        </DialogHeader>
        <div>
          <Label className='text-xs font-bold text-zinc-500 dark:text-secondary/70'>
            邀请链接
          </Label>
          <div className='mt2 mt-2 flex items-center gap-x-2'>
            <Input
              disabled={isLoading}
              className='border-0 bg-zinc-300 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
              value={inviteUrl}
            />
            <Button
              className='relative'
              size='icon'
              disabled={isCopied || isLoading}
              onClick={handleCopy}
            >
              <Copy
                className={cn('h-4 w-4 transition-all', isCopied && 'scale-0')}
              />
              <Check
                className={cn(
                  'absolute h-4 w-4 scale-0 transition-all',
                  isCopied && 'scale-100',
                )}
              />
            </Button>
          </div>
          <Button
            variant='link'
            size='sm'
            className='mt-4 pl-0 text-xs text-zinc-500'
            onClick={handleGenNewLink}
            disabled={isLoading}
          >
            生成新链接
            <RefreshCw
              className={cn('ml-2 h-4 w-4', isLoading && 'animate-spin')}
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
