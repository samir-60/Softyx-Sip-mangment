import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

interface SettingsProps {
  settings: {
    business_name: string;
    currency_symbol: string;
    contact_email: string;
    contact_phone: string;
    address: string;
    external_clothing_store: string;
  };
}

export default function SettingsIndex({ settings }: SettingsProps) {
  const { data, setData, post, processing } = useForm(settings);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/settings');
  };

  return (
    <AdminLayout title="Business Settings">
      <div className="max-w-2xl bg-white border border-[#E8E0D0] p-6">
        <h1 className="text-2xl font-light text-[#2C2C2C] mb-6">Business Settings</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Business Name</label>
            <input
              type="text"
              value={data.business_name}
              onChange={(e) => setData('business_name', e.target.value)}
              className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={data.currency_symbol}
                onChange={(e) => setData('currency_symbol', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Contact Email</label>
              <input
                type="email"
                value={data.contact_email}
                onChange={(e) => setData('contact_email', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Contact Phone</label>
            <input
              type="text"
              value={data.contact_phone}
              onChange={(e) => setData('contact_phone', e.target.value)}
              className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Address</label>
            <textarea
              rows={2}
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
              className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
            />
          </div>
          <div className="p-3 bg-[#F5F0E8] text-xs text-[#2C2C2C]/70">
            Official Clothing Store Domain: <strong>{data.external_clothing_store}</strong>
          </div>
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-3 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase"
          >
            {processing ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
