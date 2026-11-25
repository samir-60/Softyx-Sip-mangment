import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

interface InventoryRow {
  id: number;
  name: string;
  status: string;
  quantity: number;
  low_stock_threshold: number;
  is_low_stock: boolean;
}

interface MovementRow {
  id: number;
  type: string;
  quantity: number;
  notes: string | null;
  created_at: string;
  food_product?: { name: string };
}

export default function InventoryIndex({
  items,
  movements,
}: {
  items: InventoryRow[];
  movements: MovementRow[];
}) {
  const { data, setData, post, reset, processing } = useForm({
    food_product_id: items[0]?.id ? String(items[0].id) : '',
    quantity: '10',
    notes: 'Restock',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/inventory/adjust', { onSuccess: () => reset('notes') });
  };

  return (
    <AdminLayout title="Inventory">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white border border-[#E8E0D0] p-6 h-fit">
          <h2 className="text-sm tracking-widest uppercase text-[#2C2C2C]/60 mb-4">Stock Adjustment</h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Food Item</label>
              <select
                value={data.food_product_id}
                onChange={(e) => setData('food_product_id', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm bg-white"
              >
                {items.map((item) => (
                  <option key={item.id} value={item.id}>{item.name} (Current: {item.quantity})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">
                Quantity Change (+/-)
              </label>
              <input
                type="number"
                value={data.quantity}
                onChange={(e) => setData('quantity', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">Notes</label>
              <input
                type="text"
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                className="w-full border border-[#E8E0D0] px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-2.5 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase"
            >
              Apply Adjustment
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E8E0D0]">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F0E8] border-b border-[#E8E0D0] text-[10px] tracking-widest uppercase text-[#2C2C2C]/50">
                <tr>
                  <th className="text-left px-4 py-3 font-normal">Item</th>
                  <th className="text-left px-4 py-3 font-normal">Stock</th>
                  <th className="text-left px-4 py-3 font-normal">Alert Threshold</th>
                  <th className="text-left px-4 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-[#F5F0E8]">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3 text-xs text-[#2C2C2C]/50">{item.low_stock_threshold}</td>
                    <td className="px-4 py-3 text-xs">
                      {item.is_low_stock ? (
                        <span className="text-red-500 uppercase tracking-wider">Low Stock</span>
                      ) : (
                        <span className="text-[#8B9E6E] uppercase tracking-wider">Healthy</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-[#E8E0D0] p-4">
            <h3 className="text-xs tracking-widest uppercase text-[#2C2C2C]/50 mb-3">Recent Stock Movements</h3>
            <div className="space-y-2 text-xs">
              {movements.map((m) => (
                <div key={m.id} className="flex justify-between border-b border-[#F5F0E8] pb-2">
                  <span>
                    <strong>{m.food_product?.name}</strong> — {m.type} ({m.quantity > 0 ? `+${m.quantity}` : m.quantity})
                  </span>
                  <span className="text-[#2C2C2C]/40">{m.notes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
