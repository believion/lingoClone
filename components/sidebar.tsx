import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import SidebarItem from "./sidebar-item";
type Props = {
  className?: string;
};

const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 flex-col border-r-2 px-4",
        className
      )}
    >
      <Link href={"/learn"}>
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/hippo.png" height={40} width={40} alt="mascot" />
          <h1 className="font-extrabold text-2xl text-green-600 tracking-wide">
            Lingo
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label={"Learn"} iconSrc={"./learn.svg"} href={"/learn"} />
        <SidebarItem
          label={"leaderboard"}
          iconSrc={"./leaderboard.svg"}
          href={"/leaderboard"}
        />
        <SidebarItem
          label={"quests"}
          iconSrc={"./quests.svg"}
          href={"/quests"}
        />
        <SidebarItem label={"shop"} iconSrc={"./shop.svg"} href={"/shop"} />
      </div>
      <div className="p-4">
        <ClerkLoading>
          <Loader className="text-muted-foreground h-5 w-5 animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
    </div>
  );
};

export default Sidebar;
