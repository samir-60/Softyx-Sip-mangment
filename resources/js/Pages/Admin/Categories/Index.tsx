import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import type { Category } from '@/types';

export default function CategoriesIndex({ categories }: { categories: Category[] }) {
  const { data, setData, post, reset, processing } = useForm({
    type: 'food',
    name: '',
    sort_order: 0,
    is_active: true,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/categories', { onSuccess: () => reset('name') });
  };

  return (
    <AdminLayout title="Categories">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white border border-[#E8E0D0] p-6 h-fit">
          <h2 className="text-sm tracking-widest uppercase text-[#2C2C2C]/60 mb-4">Add Category</h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Type</label>
              <select
                value={data.type}
                onChange={(e) => setData('type', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm bg-white"
              >
                <option value="food">Food &amp; Drinks</option>
                <option value="clothing">Clothing</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Name *</label>
              <input
                type="text"
                required
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-2.5 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase"
            >
              Create Category
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white border border-[#E8E0D0]">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F0E8] border-b border-[#E8E0D0] text-[10px] tracking-widest uppercase text-[#2C2C2C]/50">
              <tr>
                <th className="text-left px-4 py-3 font-normal">Name</th>
                <th className="text-left px-4 py-3 font-normal">Type</th>
                <th className="text-left px-4 py-3 font-normal">Items</th>
                <th className="text-right px-4 py-3 font-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-[#F5F0E8]">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-xs uppercase">{cat.type}</td>
                  <td className="px-4 py-3 text-xs">
                    {cat.type === 'food' ? cat.food_products_count : cat.clothing_products_count}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => router.delete(`/admin/categories/${cat.id}`)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
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
