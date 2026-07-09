import { Button } from "@/components/atoms/button";
import { adminLogoutAction } from "@/app/admin/actions";

type AdminTopbarProps = {
  adminName: string;
};

export function AdminTopbar({ adminName }: AdminTopbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-outline-variant bg-surface/95 px-lg py-md backdrop-blur-sm">
      <p className="text-label-md text-on-surface-variant lg:hidden">Super admin</p>
      <div className="ml-auto flex items-center gap-md">
        <span className="text-body-sm text-on-surface-variant">{adminName}</span>
        <form action={adminLogoutAction}>
          <Button type="submit" variant="secondary" className="px-md py-xs text-body-sm cursor-pointer">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
