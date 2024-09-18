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

    const { name, imageUrl } = await req.json();

    if (!name) {
      return new NextResponse('Server name should provided', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id, // 只有 服务器所有者能更新要求链接
      },
      data: {
        name,
        imageUrl,
      },
    });

    if (!server) {
      return new NextResponse('No such server', { status: 404 });
    }

    return NextResponse.json(server);
  } catch (error) {
    console.error('[SERVER_ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
