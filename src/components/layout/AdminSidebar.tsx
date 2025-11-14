"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";

export function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const t = useTranslations("Dashboard.sidebar");

  const navigationItems = [
    {
      title: t("dashboard"),
      items: [
        {
          title: t("overview"),
          url: "/admin/dashboard",
          icon: Home,
        },
      ],
    },
    {
      title: t("platformManagement"),
      items: [
        {
          title: t("professionals"),
          url: "/admin/dashboard/professionals",
          icon: Users,
        },
        {
          title: t("patients"),
          url: "/admin/dashboard/patients",
          icon: User,
        },
        {
          title: t("reports"),
          url: "/admin/dashboard/reports",
          icon: ClipboardList,
        },
      ],
    },
    {
      title: t("support"),
      items: [
        {
          title: t("systemSettings"),
          url: "/admin/dashboard/settings",
          icon: Settings,
        },
        {
          title: t("helpCenter"),
          url: "/admin/dashboard/help",
          icon: HelpCircle,
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 px-4 py-4">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 font-serif text-xl font-light text-foreground"
        >
          {state === "expanded" && (
            <Image
              src="/Logo.png"
              alt={t("logo")}
              className="w-full px-8"
              width={256}
              height={32}
            />
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-light tracking-wider text-muted-foreground/70">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="font-light transition-colors"
                      >
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {isActive && (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="font-light">
              <Link href="/logout">
                <LogOut className="h-4 w-4" />
                <span>{t("logout")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
