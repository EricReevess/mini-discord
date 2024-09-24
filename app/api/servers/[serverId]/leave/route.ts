import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse('Server Id should provided', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id, // 管理员无法离开服务器，只能删除
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    if (!server) {
      return new NextResponse('No such server', { status: 404 });
    }

    return NextResponse.json(server);
  } catch (error) {
    console.error('[SERVER_ID_LEAVE_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
