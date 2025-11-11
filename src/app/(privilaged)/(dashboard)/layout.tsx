import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { getLocale } from "next-intl/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border/40 bg-background px-4 sm:px-6">
            <SidebarTrigger />
            <div className="flex-1" />
            <LocaleSwitcher currentLocale={locale} />
          </div>
          <div className="p-6 w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
