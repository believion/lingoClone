import { getIsAdmin } from "@/lib/admin";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
const App = dynamic(() => import("./app"), { ssr: false });

const AdminPage = async () => {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) {
    redirect("/"); // redirect to main homepage if not admin
  }
  return <App />;
};

export default AdminPage;
