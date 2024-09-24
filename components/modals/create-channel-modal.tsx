'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { ModalType, useModal } from '@/app/hooks/use-modal-store';
import { LoaderCircle } from 'lucide-react';
import { ChannelType } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: '请输入频道名称',
    })
    .max(50)
    .refine((name) => name !== '公共', {
      message: '不能使用"公共频道"作为名称',
    }),
  type: z.nativeEnum(ChannelType),
});

const CHANNEL_TYPE_TEXT_MAP: Record<ChannelType, string> = {
  [ChannelType.AUDIO]: '语音',
  [ChannelType.TEXT]: '文字',
  [ChannelType.VIDEO]: '视频',
};

const CreateChannelModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const router = useRouter();
  const { toast } = useToast();

  const { server, channelType, channel } = data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: channel?.name || '',
      type: channel?.type || ChannelType.AUDIO,
    },
  });

  const isModalOpen =
    isOpen &&
    [ModalType.CREATE_CHANNEL, ModalType.EDIT_CHANNEL].includes(type!);

  const isLoading = form.formState.isSubmitting;

  const isEdit = type === ModalType.EDIT_CHANNEL;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('values:', values);
    try {
      if (isEdit) {
        await axios.patch(`/api/channels/${channel?.id}`, {
          ...values,
          serverId: server?.id,
        });
      } else {
        await axios.post('/api/channels', {
          ...values,
          serverId: server?.id,
        });
      }
      toast({
        title: `频道${isEdit ? '编辑' : '创建'}成功`,
        duration: 2000,
      });

      onClose();
      router.refresh();
      form.reset();
    } catch (error) {
      console.log('error:', error);
      const err = error as AxiosError;
      let errorMsg;
      if (err.response) {
        errorMsg = (err.response.data as string) || err.message;
      }
      toast({
        title: `频道${isEdit ? '编辑' : '创建'}失败`,
        description: errorMsg,
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  useEffect(() => {
    if (channelType) {
      form.setValue('type', channelType);
    } else {
      form.setValue('type', ChannelType.TEXT);
    }
    if (isEdit && channel) {
      form.setValue('name', channel.name);
      form.setValue('type', channel.type);
    }
  }, [channelType, channel]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='overflow-hidden bg-white text-slate-900'>
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑' : '创建'}频道</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-zinc-500 dark:text-secondary/70'>
                    频道名称
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className='border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
                      placeholder='输入频道名称'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-zinc-500 dark:text-secondary/70'>
                    频道类型
                  </FormLabel>

                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='border-0 bg-zinc-300/50 outline-none ring-offset-0 focus:ring-0 focus:ring-offset-0'>
                        <SelectValue placeholder='选择一个频道类型' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(CHANNEL_TYPE_TEXT_MAP).map((type) => (
                        <SelectItem
                          className='cursor-pointer'
                          key={type}
                          value={type}
                        >
                          {CHANNEL_TYPE_TEXT_MAP[type as ChannelType]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant='ghost' onClick={onClose} disabled={isLoading}>
                取消
              </Button>
              <Button variant='primary' disabled={isLoading}>
                {isLoading && (
                  <LoaderCircle className='mr-1 h-4 w-4 animate-spin' />
                )}
                {isEdit ? '提交' : '创建'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
