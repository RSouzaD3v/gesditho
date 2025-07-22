import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOption";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/login");
  }

  return (<div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow p-6 md:ml-60 ml-10 bg-gray-100">{children}</main>
    </div> );
}
