import { changePasswordAction } from "@/actions/auth";
import { ActionForm } from "@/components/admin/action-form";
import { TextField } from "@/components/admin/fields";
import { AdminPageHeader, Panel } from "@/components/admin/ui";
import { requirePageUser } from "@/lib/auth";

export default async function AccountPage() {
  const user = await requirePageUser();
  return (
    <>
      <AdminPageHeader title="Your account" description={`${user.name} · ${user.email}`} />
      <Panel title="Change password" className="max-w-xl">
        <ActionForm action={changePasswordAction} submitLabel="Update password" resetOnSuccess className="space-y-4">
          <TextField name="currentPassword" label="Current password" type="password" required />
          <TextField name="newPassword" label="New password" type="password" required hint="At least 10 characters with upper-case, lower-case letters and a number" />
          <TextField name="confirmPassword" label="Confirm new password" type="password" required />
        </ActionForm>
      </Panel>
    </>
  );
}
