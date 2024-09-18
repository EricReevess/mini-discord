import { initialProfile } from '@/lib/initial-profile';
import { db } from '@/lib/db';
import InitialModal from '@/components/modals/initial-modal';
import { redirect } from 'next/navigation';
const SetupPage = async () => {
  const profile = await initialProfile();

  // 寻找用户的第一个服务器
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
    <div>
      <InitialModal profile={profile} />
    </div>
  );
};

export default SetupPage;
