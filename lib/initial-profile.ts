import { currentUser, auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if(!user) {
    return auth().redirectToSignIn()
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id
    }
  })

  if(profile) return profile

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: user.fullName || user.emailAddresses?.[0].emailAddress.split('@')[0] || user.id,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress
    }
  })

  return newProfile;
}