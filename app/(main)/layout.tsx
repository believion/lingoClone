import Sidebar from "@/components/sidebar";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <>
    <Sidebar />
      <main className="pl-[256px]">
        {children}
      </main>
    </>
  )
}
