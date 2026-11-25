import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import type { Category, ClothingProduct } from '@/types';

export default function ClothingEdit({
  clothing,
  categories,
}: {
  clothing: ClothingProduct;
  categories: Category[];
}) {
  const { data, setData, post, processing, errors } = useForm<{
    _method: string;
    name: string;
    category_id: string;
    description: string;
    display_price: string;
    promotional_price: string;
    sizes: string[];
    colours: string[];
    external_store_url: string;
    redirect_enabled: boolean;
    fallback_redirect_enabled: boolean;
    status: string;
    is_featured: boolean;
    image: File | null;
  }>({
    _method: 'PUT',
    name: clothing.name,
    category_id: clothing.category_id ? String(clothing.category_id) : '',
    description: clothing.description ?? '',
    display_price: clothing.display_price !== null ? String(clothing.display_price) : '',
    promotional_price: clothing.promotional_price !== null ? String(clothing.promotional_price) : '',
    sizes: clothing.sizes ?? [],
    colours: clothing.colours ?? [],
    external_store_url: clothing.external_store_url ?? '',
    redirect_enabled: Boolean(clothing.redirect_enabled ?? true),
    fallback_redirect_enabled: Boolean(clothing.fallback_redirect_enabled ?? false),
    status: clothing.status ?? 'published',
    is_featured: Boolean(clothing.is_featured),
    image: null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/clothing/${clothing.id}`, { forceFormData: true });
  };

  return (
    <AdminLayout title={`Edit ${clothing.name}`}>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-light text-[#2C2C2C]">Edit Clothing Product Link</h1>
          <Link href="/admin/clothing" className="text-xs uppercase tracking-widest text-[#2C2C2C]/50 hover:text-[#C17B3F]">
            Back
          </Link>
        </div>

        <form onSubmit={submit} className="bg-white border border-[#E8E0D0] p-6 space-y-4">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">
              Clothing Product Name *
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
              required
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">
              SOFTYX Product URL (softyx.shop only)
            </label>
            <input
              type="url"
              value={data.external_store_url}
              onChange={(e) => setData('external_store_url', e.target.value)}
              className="w-full border border-[#E8E0D0] px-3 py-2 text-sm font-mono"
            />
            {errors.external_store_url && <p className="text-xs text-red-500 mt-1">{errors.external_store_url}</p>}
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
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Display Status</label>
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
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Display Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={data.display_price}
                onChange={(e) => setData('display_price', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Promotional Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={data.promotional_price}
                onChange={(e) => setData('promotional_price', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Sizes</label>
              <input
                type="text"
                value={data.sizes.join(', ')}
                onChange={(e) => setData('sizes', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Colours</label>
              <input
                type="text"
                value={data.colours.join(', ')}
                onChange={(e) => setData('colours', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
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

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Replace Image</label>
            <input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] ?? null)} className="text-xs" />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={data.redirect_enabled} onChange={(e) => setData('redirect_enabled', e.target.checked)} />
              Redirect enabled
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={data.fallback_redirect_enabled}
                onChange={(e) => setData('fallback_redirect_enabled', e.target.checked)}
              />
              Fallback to https://softyx.shop
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
            {processing ? 'Updating...' : 'Update Clothing Link'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
