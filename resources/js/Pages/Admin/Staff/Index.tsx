import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  is_active: boolean;
}

export default function StaffIndex({ staff }: { staff: StaffMember[] }) {
  const { data, setData, post, reset, processing } = useForm({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    is_active: true,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/staff', { onSuccess: () => reset('name', 'email', 'password') });
  };

  return (
    <AdminLayout title="Staff & Permissions">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white border border-[#E8E0D0] p-6 h-fit">
          <h2 className="text-xs tracking-widest uppercase text-[#2C2C2C]/60 mb-4">Add Staff Account</h2>
          <form onSubmit={submit} className="space-y-3">
            <input
              type="text"
              required
              placeholder="Full Name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
            />
            <input
              type="password"
              required
              placeholder="Password (min 8 chars)"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
            />
            <select
              value={data.role}
              onChange={(e) => setData('role', e.target.value)}
              className="w-full border border-[#E8E0D0] px-3 py-2 text-sm bg-white"
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-2.5 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase"
            >
              Create Account
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white border border-[#E8E0D0]">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F0E8] border-b border-[#E8E0D0] text-[10px] tracking-widest uppercase text-[#2C2C2C]/50">
              <tr>
                <th className="text-left px-4 py-3 font-normal">Name</th>
                <th className="text-left px-4 py-3 font-normal">Email</th>
                <th className="text-left px-4 py-3 font-normal">Role</th>
                <th className="text-right px-4 py-3 font-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id} className="border-b border-[#F5F0E8]">
                  <td className="px-4 py-3 font-medium">{member.name}</td>
                  <td className="px-4 py-3 text-xs text-[#2C2C2C]/60">{member.email}</td>
                  <td className="px-4 py-3 text-xs uppercase">{member.role}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => router.delete(`/admin/staff/${member.id}`)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
