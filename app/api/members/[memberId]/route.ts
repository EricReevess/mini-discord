import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.memberId) {
      return new NextResponse('Member Id should provided', { status: 400 });
    }

    const { serverId, role } = await req.json();

    if (!serverId) {
      return new NextResponse('Server id should provided', { status: 400 });
    }

    // 找到对应服务器，更新以memberId 更新服务器中成员列表中某个非管理员成员的角色信息
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id, // 不能更新自己的成员信息
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        // 返回带有members成员列表的的server 信息
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error('[MEMBER_ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await currentProfile();

    // admin profile only
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.memberId) {
      return new NextResponse('Member Id should provided', { status: 400 });
    }

    const searchParams = req.nextUrl.searchParams;
    const serverId = searchParams.get('serverId');

    if (!serverId) {
      return new NextResponse('Server id should provided', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          delete: {
            id: params.memberId,
            profileId: {
              not: profile.id, // 不能更新自己的成员信息
            },
          },
        },
      },
      include: {
        // 返回带有members成员列表的的server 信息
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error('[MEMBER_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
