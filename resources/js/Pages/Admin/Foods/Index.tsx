import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Plus, QrCode, RotateCcw, Trash2, Edit3 } from 'lucide-react';
import type { FoodProduct } from '@/types';

interface Props {
  products: {
    data: FoodProduct[];
  };
}

export default function FoodsIndex({ products }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Permanently delete this food item? It will not show again.')) {
      router.delete(`/admin/foods/${id}`);
    }
  };

  const handleRestore = (id: number) => {
    router.post(`/admin/foods/${id}/restore`);
  };

  const handleGenerateQr = (id: number) => {
    router.post(`/admin/foods/${id}/qr`);
  };

  return (
    <AdminLayout title="Food Products">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light text-[#2C2C2C]">Food &amp; Beverage Menu</h1>
          <p className="text-xs text-[#2C2C2C]/50 mt-1">Changes sync immediately to the live QR menu.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/menu-card"
            className="px-4 py-2.5 border border-[#2C2C2C] text-xs tracking-widest uppercase hover:bg-[#2C2C2C] hover:text-[#F5F0E8] transition-colors"
          >
            All-in-One Menu Card
          </Link>
          <Link
            href="/admin/foods/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#A8622D]"
          >
            <Plus className="w-4 h-4" />
            Add Food Item
          </Link>
        </div>
      </div>

      <div className="bg-white border border-[#E8E0D0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F0E8] border-b border-[#E8E0D0] text-[10px] tracking-widest uppercase text-[#2C2C2C]/50">
            <tr>
              <th className="text-left px-4 py-3 font-normal">Item</th>
              <th className="text-left px-4 py-3 font-normal">Category</th>
              <th className="text-left px-4 py-3 font-normal">Price</th>
              <th className="text-left px-4 py-3 font-normal">Status</th>
              <th className="text-left px-4 py-3 font-normal">Availability</th>
              <th className="text-right px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.data.map((food) => (
              <tr key={food.id} className={`border-b border-[#F5F0E8] ${food.deleted_at ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#EAE3D5] shrink-0 overflow-hidden">
                    {food.image && <img src={`/storage/${food.image}`} alt={food.name} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <p className="font-medium text-[#2C2C2C]">{food.name}</p>
                    <p className="text-xs text-[#2C2C2C]/40">{food.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-[#2C2C2C]/70">{food.category?.name ?? 'Uncategorized'}</td>
                <td className="px-4 py-3">
                  <span className="font-medium">BDT {Number(food.promotional_price ?? food.price).toFixed(0)}</span>
                  {food.promotional_price && (
                    <span className="text-xs line-through text-[#2C2C2C]/35 ml-2">BDT {Number(food.price).toFixed(0)}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] tracking-widest uppercase px-2 py-1 bg-[#F5F0E8]">
                    {food.deleted_at ? 'Archived' : food.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  {food.is_available ? (
                    <span className="text-[#8B9E6E]">In Stock</span>
                  ) : (
                    <span className="text-red-500">Unavailable</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    {!food.deleted_at ? (
                      <>
                        <Link
                          href={`/admin/foods/${food.id}/menu-card`}
                          title="Printable QR Menu Card"
                          className="px-2.5 py-1 border border-[#E8E0D0] text-[10px] tracking-widest uppercase hover:border-[#C17B3F] hover:text-[#C17B3F]"
                        >
                          Menu Card
                        </Link>
                        <button
                          onClick={() => handleGenerateQr(food.id)}
                          title="Refresh Food QR"
                          className="p-1.5 border border-[#E8E0D0] hover:border-[#C17B3F]"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/admin/foods/${food.id}/edit`}
                          className="p-1.5 border border-[#E8E0D0] hover:border-[#C17B3F]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(food.id)}
                          className="p-1.5 border border-[#E8E0D0] hover:border-red-400 text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRestore(food.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 border border-[#E8E0D0] text-xs hover:border-[#8B9E6E]"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Restore
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
