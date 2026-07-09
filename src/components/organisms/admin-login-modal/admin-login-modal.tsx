"use client";

import { Modal } from "@/components/atoms/modal";
import { AdminLoginForm } from "@/components/organisms/admin-login-form";
import { adminLoginAction } from "@/app/admin/(auth)/login/actions";

type AdminLoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AdminLoginModal({ open, onClose }: AdminLoginModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Super admin"
      description="Sign in to manage tenants."
    >
      <AdminLoginForm action={adminLoginAction} />
    </Modal>
  );
}
