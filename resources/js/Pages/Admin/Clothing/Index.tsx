import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Edit3, ExternalLink, Plus, RotateCcw, Trash2 } from 'lucide-react';
import type { ClothingProduct } from '@/types';

export default function ClothingIndex({ products }: { products: { data: ClothingProduct[] } }) {
  const handleDelete = (id: number) => {
    if (confirm('Remove this clothing link?')) {
      router.delete(`/admin/clothing/${id}`);
    }
  };

  const handleRestore = (id: number) => {
    router.post(`/admin/clothing/${id}/restore`);
  };

  return (
    <AdminLayout title="Clothing Redirects">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light text-[#2C2C2C]">SOFTYX Clothing Links</h1>
          <p className="text-xs text-[#2C2C2C]/50 mt-1">
            Manage clothing showcase cards and their direct product links to softyx.shop.
          </p>
        </div>
        <Link
          href="/admin/clothing/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#A8622D]"
        >
          <Plus className="w-4 h-4" />
          Add Clothing Link
        </Link>
      </div>

      <div className="bg-white border border-[#E8E0D0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F0E8] border-b border-[#E8E0D0] text-[10px] tracking-widest uppercase text-[#2C2C2C]/50">
            <tr>
              <th className="text-left px-4 py-3 font-normal">Product</th>
              <th className="text-left px-4 py-3 font-normal">Display Price</th>
              <th className="text-left px-4 py-3 font-normal">SOFTYX URL</th>
              <th className="text-left px-4 py-3 font-normal">Redirect</th>
              <th className="text-left px-4 py-3 font-normal">Status</th>
              <th className="text-right px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.data.map((item) => (
              <tr key={item.id} className={`border-b border-[#F5F0E8] ${item.deleted_at ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">
                  {item.display_price !== null ? `$${Number(item.display_price).toFixed(2)}` : '—'}
                </td>
                <td className="px-4 py-3 text-xs font-mono max-w-xs truncate">
                  {item.external_store_url ? (
                    <a
                      href={item.external_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#C17B3F] hover:underline"
                    >
                      {item.external_store_url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[#2C2C2C]/35">Not set</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  {item.redirect_enabled ? (
                    <span className="text-[#8B9E6E]">Enabled</span>
                  ) : (
                    <span className="text-[#2C2C2C]/40">Disabled</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] tracking-widest uppercase px-2 py-1 bg-[#F5F0E8]">
                    {item.deleted_at ? 'Archived' : item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    {!item.deleted_at ? (
                      <>
                        <Link href={`/admin/clothing/${item.id}/edit`} className="p-1.5 border border-[#E8E0D0] hover:border-[#C17B3F]">
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 border border-[#E8E0D0] hover:border-red-400 text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleRestore(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 border border-[#E8E0D0] text-xs"
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
