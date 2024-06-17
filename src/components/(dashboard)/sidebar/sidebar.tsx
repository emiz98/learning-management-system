"use client";

import {
  HomeIcon as HomeIconOutline,
  UserGroupIcon as UserGroupIconOutline,
  AcademicCapIcon as AcademicCapIconOutline,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
} from "@heroicons/react/24/solid";
import SidebarOption from "../sidebar_option/sidebar_option";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IUserRole } from "@/interfaces/IUserRole";
import { LOGO } from "@/lib/constants";
import Image from "next/image";

const Sidebar = () => {
  const { data } = useSession();
  const router = useRouter();
  const path = usePathname();

  return (
    <div className="h-full bg-white drop-shadow-md col-span-2 p-5">
      <div className="flex items-center justify-start mb-5 gap-x-2">
        <Image
          src={LOGO}
          alt="logo_main"
          width={40}
          height={60}
          priority={true}
        />
        <h4 className="font-bold text-accent text-lg hidden md:flex">
          AcademiX
        </h4>
      </div>
      <div className="w-full h-[1px] bg-slate-200 my-5" />
      <SidebarOption
        onClick={() =>
          router.push(data?.user.role == IUserRole.ADMIN ? "/admin" : "/user")
        }
        title="Dashboard"
        selected={path === "/admin" || path === "/user"}
        Icon={HomeIconOutline}
        SelectedIcon={HomeIconSolid}
      />

      {data?.user.role == IUserRole.ADMIN && (
        <>
          <SidebarOption
            onClick={() => router.push("/admin/courses")}
            title="Courses"
            selected={path === "/admin/courses"}
            Icon={AcademicCapIconOutline}
            SelectedIcon={AcademicCapIconSolid}
          />
          <SidebarOption
            onClick={() => router.push("/admin/students")}
            title="Students"
            selected={path === "/admin/students"}
            Icon={UserGroupIconOutline}
            SelectedIcon={UserGroupIconSolid}
          />
        </>
      )}

      {data?.user.role == IUserRole.USER && (
        <>
          <SidebarOption
            onClick={() => router.push("/user/courses")}
            title="Courses"
            selected={path === "/user/courses"}
            Icon={AcademicCapIconOutline}
            SelectedIcon={AcademicCapIconSolid}
          />
        </>
      )}
    </div>
  );
};

export default Sidebar;
