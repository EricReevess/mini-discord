'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ModalType, useModal } from '@/app/hooks/use-modal-store';

import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const DeleteChannelModal = () => {
  const { toast } = useToast();
  const { isOpen, type, onClose, data } = useModal();
  const router = useRouter();
  const { server, channel } = data;
  const isModalOpen = isOpen && type === ModalType.DELETE_CHANNEL;

  const [isLoading, setLoading] = useState(false);
  const handleLeave = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/channels/${channel?.id}`, {
        params: {
          serverId: server?.id,
        },
      });

      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: '频道删除失败',
        description: (error as unknown as { message: string })?.message,
        variant: 'destructive',
        duration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='overflow-hidden bg-white text-slate-900'>
        <DialogHeader>
          <DialogTitle>删除服务器</DialogTitle>
        </DialogHeader>
        <DialogDescription className='flex items-center gap-1 text-zinc-500'>
          确定要永久删除频道
          <span className='font-semibold text-sky-500'>{channel?.name}</span>
          吗？
        </DialogDescription>
        <DialogFooter>
          <Button variant='ghost' onClick={onClose} disabled={isLoading}>
            取消
          </Button>
          <Button
            variant='destructive'
            onClick={handleLeave}
            disabled={isLoading}
          >
            {isLoading && (
              <LoaderCircle className='mr-1 h-4 w-4 animate-spin' />
            )}
            删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
