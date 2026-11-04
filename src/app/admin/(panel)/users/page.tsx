import { createAdminUser, signOutEverywhere, toggleUserActive } from "@/actions/admin/settings";
import { ActionForm } from "@/components/admin/action-form";
import { ActionButton } from "@/components/admin/confirm-action";
import { SelectField, TextField } from "@/components/admin/fields";
import { AdminPageHeader, Panel, Pill, Table } from "@/components/admin/ui";
import { requirePageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { roleLabels } from "@/lib/labels";
import { formatDateTime } from "@/lib/utils";

export default async function UsersPage() {
  const me = await requirePageUser("ADMIN");
  const users = await db.adminUser.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true } });

  return (
    <>
      <AdminPageHeader title="Users" description="Administrators can change settings, delete content and manage users. Editors manage products, enquiries and content." />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Table head={["User", "Role", "Last sign-in", "Status", ""]}>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-4">
                  <span className="block font-semibold text-deep">{u.name}{u.id === me.id ? " (you)" : ""}</span>
                  <span className="text-xs text-ink/55">{u.email}</span>
                </td>
                <td className="px-5 py-4 text-ink/70">{roleLabels[u.role]}</td>
                <td className="px-5 py-4 text-ink/60">{u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "Never"}</td>
                <td className="px-5 py-4"><Pill className={u.isActive ? "bg-emerald-100 text-emerald-900" : "bg-stone-200 text-stone-700"}>{u.isActive ? "Active" : "Inactive"}</Pill></td>
                <td className="px-5 py-4">
                  {u.id !== me.id ? (
                    <div className="flex justify-end gap-1">
                      <ActionButton action={signOutEverywhere.bind(null, u.id)}>Sign out sessions</ActionButton>
                      <ActionButton action={toggleUserActive.bind(null, u.id)} confirm="Confirm" tone={u.isActive ? "danger" : "default"}>{u.isActive ? "Deactivate" : "Activate"}</ActionButton>
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </Table>
        </div>
        <Panel title="Add user">
          <ActionForm action={createAdminUser} submitLabel="Create user" resetOnSuccess className="space-y-4">
            <TextField name="name" label="Name" required />
            <TextField name="email" label="Email" type="email" required />
            <SelectField name="role" label="Role" defaultValue="EDITOR" options={[{ value: "EDITOR", label: "Editor" }, { value: "ADMIN", label: "Administrator" }]} />
            <TextField name="password" label="Temporary password" type="password" required hint="Min 10 characters with upper, lower case and a number. Ask the user to change it after first sign-in." />
          </ActionForm>
        </Panel>
      </div>
    </>
  );
}
