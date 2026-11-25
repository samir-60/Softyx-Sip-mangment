import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm } from '@inertiajs/react';
import { Download, QrCode, ExternalLink } from 'lucide-react';
import type { QrCodeItem, RestaurantTable } from '@/types';

export default function QrCodesIndex({
  qrCodes,
  tables,
}: {
  qrCodes: QrCodeItem[];
  tables: RestaurantTable[];
}) {
  const { data, setData, post, reset, processing } = useForm({
    name: '',
    capacity: '4',
  });

  const createTable = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/qr-codes/tables', { onSuccess: () => reset('name') });
  };

  return (
    <AdminLayout title="QR Code Studio">
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E8E0D0] p-6">
          <div>
            <h1 className="text-2xl font-light text-[#2C2C2C]">Permanent QR Code Studio</h1>
            <p className="text-xs text-[#2C2C2C]/55 mt-1">
              Menu QR codes point to your live database route. Adding or editing dishes never requires reprinting.
            </p>
          </div>
          <button
            onClick={() => router.post('/admin/qr-codes/menu')}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#A8622D]"
          >
            <QrCode className="w-4 h-4" />
            Generate / Refresh Main Menu QR
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Add Table */}
          <div className="bg-white border border-[#E8E0D0] p-6 h-fit">
            <h2 className="text-xs tracking-widest uppercase text-[#2C2C2C]/60 mb-4">Add Restaurant Table QR</h2>
            <form onSubmit={createTable} className="space-y-3">
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Table Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 05"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Capacity</label>
                <input
                  type="number"
                  value={data.capacity}
                  onChange={(e) => setData('capacity', e.target.value)}
                  className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full py-2.5 bg-[#2C2C2C] text-[#F5F0E8] text-xs tracking-widest uppercase"
              >
                Create Table &amp; QR
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#E8E0D0] space-y-2">
              <p className="text-[10px] tracking-widest uppercase text-[#2C2C2C]/40">Existing Tables</p>
              {tables.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs">
                  <span>{t.name}</span>
                  <button
                    onClick={() => router.post(`/admin/qr-codes/table/${t.id}`)}
                    className="text-[#C17B3F] hover:underline"
                  >
                    Generate QR
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Generated QRs */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {qrCodes.map((qr) => (
              <div key={qr.id} className="bg-white border border-[#E8E0D0] p-5 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-[#C17B3F]">{qr.type}</span>
                    <h3 className="font-medium text-sm mt-0.5">{qr.label}</h3>
                    <a
                      href={qr.target_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#2C2C2C]/50 hover:text-[#C17B3F] mt-1"
                    >
                      Preview destination
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {qr.image_path && (
                    <img
                      src={`/storage/${qr.image_path}`}
                      alt={qr.label}
                      className="w-24 h-24 border border-[#E8E0D0] p-1 bg-white"
                    />
                  )}
                </div>
                <a
                  href={`/admin/qr-codes/${qr.id}/download`}
                  className="inline-flex items-center justify-center gap-2 w-full py-2 border border-[#2C2C2C] text-xs tracking-widest uppercase hover:bg-[#2C2C2C] hover:text-[#F5F0E8] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Printable SVG
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
