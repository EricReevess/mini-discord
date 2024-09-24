import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { MemberRole } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, type, serverId } = await req.json();

    if (!serverId) {
      return new NextResponse('Server id should provided', { status: 400 });
    }

    const existedChannel = await db.channel.findFirst({
      where: {
        name,
        serverId,
      },
    });

    if (existedChannel) {
      return new NextResponse('频道名称已经存在，请修改', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNEL_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}