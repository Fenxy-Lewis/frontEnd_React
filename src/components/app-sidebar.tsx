"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Component,
  ShoppingCart,
  UserCircle,
  LayoutList,
  PlusCircle,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Fenxy",
    email: "lunsereyvorth@gmail.com",
    avatar: "/public/img/photo_2024-11-28_08-45-41.jpg",
  },
  teams: [
    { name: "Acme Inc",  logo: GalleryVerticalEnd, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveform,      plan: "Startup"    },
    { name: "Evil Corp.", logo: Command,            plan: "Free"       },
  ],
  navMain: [
    {
      title: "Product",
      icon: SquareTerminal,
      items: [
        { title: "Products List", url: "/admin/product",  icon: LayoutList  },
        { title: "Add Product",   url: "/admin/product/create", icon: PlusCircle },
      ],
    },
    {
      title: "Category",
      icon: Component,
      items: [
        { title: "Categories List", url: "/admin/category",        icon: LayoutList  },
        { title: "Add Category",    url: "/category/create", icon: PlusCircle  },
      ],
    },
    {
      title: "Customer",
      icon: ShoppingCart,
      items: [
        { title: "Customers List", url: "/admin/customer",        icon: LayoutList  },
        { title: "Add Customer",   url: "/admin/customer/create", icon: PlusCircle  },
      ],
    },
    {
      title: "User",
      icon: UserCircle,
      items: [
        { title: "Users List", url: "/admin/user",        icon: LayoutList  },
        { title: "Add User",   url: "/admin/user/create", icon: PlusCircle  },
      ],
    },
    {
      title: "Settings",
      icon: Settings2,
      items: [
        { title: "General", url: "/settings/general" },
        { title: "Team",    url: "/settings/team"    },
        { title: "Billing", url: "/settings/billing" },
      ],
    },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Frame    },
    { name: "Sales & Marketing",  url: "#", icon: PieChart },
    { name: "Travel",             url: "#", icon: Map      },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}