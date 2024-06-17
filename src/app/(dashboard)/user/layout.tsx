import Sidebar from "@/components/(dashboard)/sidebar/sidebar";
import UserHeaderCard from "@/components/user_header_card/user_header_card";
import { authOptions } from "@/lib/auth_options";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Academix Portal",
  icons: "/favicon.png",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <div className="grid grid-cols-12 h-screen overflow-hidden">
      <Sidebar />
      <div className="col-span-10 grid grid-cols-1">
        <div className="h-20 col-span-1 w-full bg-white shadow-md border-b px-5 py-2 flex items-center justify-between">
          <h3 className="text-gray-600 font-medium">
            Welcome {session?.user?.email?.split("@")[0]}! 👋
          </h3>
          <UserHeaderCard
            username={session?.user?.email}
            role={session?.user?.role}
          />
        </div>
        <div className="col-span-1">{children}</div>
      </div>
    </div>
  );
}
