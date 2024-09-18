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

import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/file-upload';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ModalType, useModal } from '@/app/hooks/use-modal-store';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: '请输入服务器名称',
    })
    .max(50),
  imageUrl: z.string().optional(),
});

const EditServerModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const { server } = data;

  const isModalOpen = isOpen && type === ModalType.EDIT_SERVER;

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue('name', server.name);
      form.setValue('imageUrl', server.imageUrl);
    }
  }, [server, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('values:', values);
    try {
      await axios.patch(`/api/servers/${server?.id}`, values);
      router.refresh();
      onClose();
    } catch (error) {
      console.log('error:', error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='overflow-hidden bg-white text-slate-900'>
        <DialogHeader>
          <DialogTitle>编辑聊天服务器</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-zinc-500 dark:text-secondary/70'>
                    服务器名称
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className='border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
                      placeholder='输入服务器名称'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div className='flex items-center justify-center text-center'> */}
            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-zinc-500 dark:text-secondary/70'>
                    服务器头像
                  </FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      endpoint='serverImage'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* </div> */}

            <DialogFooter>
              <Button variant='primary' disabled={isLoading}>
                {isLoading && (
                  <LoaderCircle className='mr-1 h-4 w-4 animate-spin' />
                )}
                保存
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;
