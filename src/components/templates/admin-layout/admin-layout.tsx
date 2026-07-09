import { AdminSidebar } from "./admin-sidebar";
import { AdminMobileNav } from "./admin-mobile-nav";
import { AdminTopbar } from "./admin-topbar";

type AdminLayoutProps = {
  adminName: string;
  children: React.ReactNode;
};

export function AdminLayout({ adminName, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-container-lowest">
      <a href="#main-content" className="skip-link focus:skip-link-focus">
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminMobileNav />
          <AdminTopbar adminName={adminName} />
          <main id="main-content" className="flex-1 px-lg py-lg lg:px-xl">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
