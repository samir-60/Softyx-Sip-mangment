import { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import type { Category } from '@/types';

export default function FoodCreate({ categories }: { categories: Category[] }) {
  const { data, setData, post, processing, errors } = useForm<{
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
    auto_image_url: string;
    model_3d: File | null;
  }>({
    name: '',
    category_id: '',
    description: '',
    price: '',
    promotional_price: '',
    status: 'published',
    is_available: true,
    is_featured: false,
    sort_order: 0,
    image: null,
    auto_image_url: '',
    model_3d: null,
  });

  const [lookingUp, setLookingUp] = useState(false);

  useEffect(() => {
    const query = data.name.trim();
    if (query.length < 3 || data.image !== null) return;

    const timer = setTimeout(async () => {
      setLookingUp(true);
      try {
        const res = await fetch(`/admin/foods/lookup-photo?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.url) {
          setData('auto_image_url', json.url);
        }
      } catch {
        // Ignore transient lookup errors; server also has fallback
      } finally {
        setLookingUp(false);
      }
    }, 550);

    return () => clearTimeout(timer);
  }, [data.name, data.image]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/foods', { forceFormData: true });
  };

  return (
    <AdminLayout title="Add Food Item">
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-light text-[#2C2C2C]">Add Food Item</h1>
            <p className="text-xs text-[#2C2C2C]/50 mt-1">
              Type a food name (e.g. Tea, Roti, Curry) to auto-fetch a real online photo and add its QR scanner to the Master Menu Card.
            </p>
          </div>
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
              placeholder="e.g. Masala Tea, Tandoori Roti, Chicken Curry"
              className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
              required
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {(lookingUp || data.auto_image_url) && !data.image && (
            <div className="border border-[#E8E0D0] bg-[#FAF6EE] p-3 flex items-center gap-4">
              {data.auto_image_url ? (
                <img src={data.auto_image_url} alt={data.name} className="w-20 h-16 object-cover border border-[#E8E0D0]" />
              ) : (
                <div className="w-20 h-16 bg-[#EAE3D5]" />
              )}
              <div className="text-xs">
                <p className="font-medium text-[#2C2C2C]">
                  {lookingUp ? 'Searching real online photo...' : 'Auto-matched real photo'}
                </p>
                <p className="text-[#2C2C2C]/50">
                  Saved automatically on submit, or upload your own photo below.
                </p>
              </div>
            </div>
          )}

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
                <option value="published">Published (Live Menu)</option>
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
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
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
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Override Photo (Optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} className="text-xs" />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Optional 3D Model (.glb/.gltf)</label>
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
              Featured on Welcome page
            </label>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="px-6 py-3 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#A8622D]"
          >
            {processing ? 'Saving...' : 'Create Food Item'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
