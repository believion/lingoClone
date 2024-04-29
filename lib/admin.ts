import { auth } from "@clerk/nextjs";

const adminIds = ["user_2eUq2LcKV9x7E8ElElH2qx3ILJv"];

export const getIsAdmin = async () => {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  return adminIds.indexOf(userId) !== -1; // check if the user id is in the allowed ids array
};
