"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import {getUserProgress, getUserSubscription} from "@/db/queries";
import db from "@/db/drizzle";
import { and, eq } from "drizzle-orm";
import { challengeProgress, challenges, userProgress } from "@/db/schema";

export const upsertChallengeProgress = async (challengeId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentUserProgress = await getUserProgress();
  const userSubscription = await getUserSubscription();
  //TODO: Handle subscription query later

  if (!currentUserProgress) {
    throw new Error("User Progress not found!");
  }

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) {
    throw new Error("Challenge Not Found!");
  }

  const lessonId = challenge.lessonId; // find the lesson corresponding to the challenge

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    ),
  }); // and is used to combine multiple filters

  const isPractice = !!existingChallengeProgress;


  if (currentUserProgress.hearts === 0 && !isPractice && !userSubscription?.isActive) {
    return { error: "hearts" };
  }

  if (isPractice) {
    await db
      .update(challengeProgress)
      .set({
        completed: true,
      })
      .where(and(eq(challengeProgress.id, existingChallengeProgress?.id))); // update the current challenge progress of the user

    await db
      .update(userProgress)
      .set({
        hearts: Math.min(currentUserProgress.hearts + 1, 5), // hearts should not exceed 5
        points: currentUserProgress.points + 10,
      })
      .where(eq(userProgress.userId, userId));

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
    return;
  }

  await db.insert(challengeProgress).values({
    challengeId: challengeId,
    userId: userId,
    completed: true,
  }); // insert a new row in the table if this is the first time

  await db
    .update(userProgress)
    .set({
      points: currentUserProgress.points + 10,
    })
    .where(eq(userProgress.userId, userId));
};
