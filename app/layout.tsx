import { ClerkProvider } from '@clerk/nextjs';
import { Open_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';
import ModalProvider from '@/components/providers/modal-provider';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mini Discord App',
  description: 'This is a great discord-like for gamming chat',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='zh-cn' suppressHydrationWarning>
        <body
          className={cn(
            'h-full bg-white antialiased dark:bg-[#313338]',
            font.className,
          )}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem={false}
            storageKey='mini-discord-theme'
          >
            {children}
            <ModalProvider />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
