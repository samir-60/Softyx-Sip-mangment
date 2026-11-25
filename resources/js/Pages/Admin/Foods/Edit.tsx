import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import type { Category, FoodProduct } from '@/types';

export default function FoodEdit({ food, categories }: { food: FoodProduct; categories: Category[] }) {
  const { data, setData, post, processing, errors } = useForm<{
    _method: string;
    name: string;
    category_id: string;
    description: string;
    price: string;
    promotional_price: string;
    status: string;
    is_available: boolean;
    is_featured: boolean;
    sort_order: number;
    image: File | null;
    model_3d: File | null;
  }>({
    _method: 'PUT',
    name: food.name,
    category_id: food.category_id ? String(food.category_id) : '',
    description: food.description ?? '',
    price: String(food.price),
    promotional_price: food.promotional_price ? String(food.promotional_price) : '',
    status: food.status ?? 'published',
    is_available: Boolean(food.is_available ?? true),
    is_featured: Boolean(food.is_featured),
    sort_order: food.sort_order ?? 0,
    image: null,
    model_3d: null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/foods/${food.id}`, { forceFormData: true });
  };

  return (
    <AdminLayout title={`Edit ${food.name}`}>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-light text-[#2C2C2C]">Edit Food Item</h1>
          <Link href="/admin/foods" className="text-xs uppercase tracking-widest text-[#2C2C2C]/50 hover:text-[#C17B3F]">
            Back
          </Link>
        </div>

        <form onSubmit={submit} className="bg-white border border-[#E8E0D0] p-6 space-y-4">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Name *</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
              required
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Category</label>
              <select
                value={data.category_id}
                onChange={(e) => setData('category_id', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm bg-white"
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Status</label>
              <select
                value={data.status}
                onChange={(e) => setData('status', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm bg-white"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Live Price (BDT) *</label>
              <input
                type="number"
                step="0.01"
                value={data.price}
                onChange={(e) => setData('price', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Promotional Price (BDT)</label>
              <input
                type="number"
                step="0.01"
                value={data.promotional_price}
                onChange={(e) => setData('promotional_price', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Description</label>
            <textarea
              rows={3}
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Replace Photo</label>
              <input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} className="text-xs" />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Replace 3D Model (.glb/.gltf)</label>
              <input type="file" accept=".glb,.gltf" onChange={(e) => setData('model_3d', e.target.files?.[0] ?? null)} className="text-xs" />
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={data.is_available} onChange={(e) => setData('is_available', e.target.checked)} />
              Available for ordering
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} />
              Featured
            </label>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="px-6 py-3 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#A8622D]"
          >
            {processing ? 'Updating...' : 'Update Food Item'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
