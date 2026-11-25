import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import type { PromotionItem } from '@/types';

export default function PromotionsIndex({ promotions }: { promotions: PromotionItem[] }) {
  const { data, setData, post, reset, processing } = useForm({
    name: '',
    code: '',
    type: 'percentage',
    value: '10',
    applies_to: 'all',
    is_active: true,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/promotions', { onSuccess: () => reset('name', 'code') });
  };

  return (
    <AdminLayout title="Promotions">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white border border-[#E8E0D0] p-6 h-fit">
          <h2 className="text-sm tracking-widest uppercase text-[#2C2C2C]/60 mb-4">New Promotion</h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Campaign Name *</label>
              <input
                type="text"
                required
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Coupon Code</label>
              <input
                type="text"
                value={data.code}
                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                placeholder="SOFTYX10"
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm font-mono uppercase"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Type</label>
                <select
                  value={data.type}
                  onChange={(e) => setData('type', e.target.value)}
                  className="w-full border border-[#E8E0D0] px-3 py-2 text-sm bg-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed ($)</option>
                  <option value="bogo">BOGO</option>
                  <option value="combo">Combo</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Value</label>
                <input
                  type="number"
                  step="0.01"
                  value={data.value}
                  onChange={(e) => setData('value', e.target.value)}
                  className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-2.5 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase"
            >
              Create Promotion
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white border border-[#E8E0D0]">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F0E8] border-b border-[#E8E0D0] text-[10px] tracking-widest uppercase text-[#2C2C2C]/50">
              <tr>
                <th className="text-left px-4 py-3 font-normal">Name</th>
                <th className="text-left px-4 py-3 font-normal">Code</th>
                <th className="text-left px-4 py-3 font-normal">Discount</th>
                <th className="text-left px-4 py-3 font-normal">Uses</th>
                <th className="text-right px-4 py-3 font-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p) => (
                <tr key={p.id} className="border-b border-[#F5F0E8]">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{p.code ?? 'Auto'}</td>
                  <td className="px-4 py-3 text-xs uppercase">
                    {p.type === 'percentage' ? `${p.value}%` : `$${Number(p.value).toFixed(2)}`} ({p.type})
                  </td>
                  <td className="px-4 py-3 text-xs">{p.usage_count}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => router.delete(`/admin/promotions/${p.id}`)}
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
