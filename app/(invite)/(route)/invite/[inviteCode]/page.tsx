import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: Props) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  if (!params.inviteCode) {
    return notFound();
  }

  // 查询用户是否已经是服务器成员
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    redirect(`/server/${server.id}`);
  }

  // todo 邀请接受界面
  return null;
};

export default InviteCodePage;
