'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useEffect, useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: '请输入服务器名称',
    })
    .max(50),
  imageUrl: z.string().optional(),
});

const InitialModal = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('values:', values);
    try {
      const res = await axios.post('/api/servers', values);
      router.refresh()
      window.location.reload()
    } catch (error) {
      console.log('error:', error);
    }
  };

  if (!isMounted) return null;

  return (
    <Dialog open>
      <DialogContent className='bg-white text-slate-900 overflow-hidden'>
        <DialogHeader>
          <DialogTitle>创建聊天服务器</DialogTitle>
          <DialogDescription>
            给你的聊天服务器取一个名字吧, 或者上传一个服务器头像
          </DialogDescription>
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
                      className='bg-zinc-300/50 border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
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
                创建
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InitialModal;
