import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { channelId: string } },
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const serverId = searchParams.get('serverId');

    if (!serverId) {
      return new NextResponse('Server id should provided', { status: 400 });
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
          delete: {
            id: params.channelId,
            name: {
              not: '公共频道',
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNEL_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { channelId: string } },
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, type, serverId } = await req.json();

    if (!serverId) {
      return new NextResponse('Server id should provided', { status: 400 });
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
          update: {
            where: {
              id: params.channelId,
              NOT: {
                // NOT 字段 适用于 多个字段的反向精准匹配， 而not 仅用于某个字段的反向匹配
                name: '公共频道',
              },
            },
            data: { name, type },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNEL_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
