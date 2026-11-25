import { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import type { Order } from '@/types';

const STATUSES = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'] as const;

export default function OrdersIndex({ orders: initialOrders }: { orders: { data: Order[] } }) {
  const [ordersList, setOrdersList] = useState<Order[]>(initialOrders.data);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    setOrdersList(initialOrders.data);
  }, [initialOrders.data]);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch('/admin/orders/live', { headers: { Accept: 'application/json' } });
        if (!res.ok) return;
        const json = await res.json();
        if (Array.isArray(json.orders)) {
          setOrdersList(json.orders);
        }
      } catch {
        // Ignore transient network errors
      }
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const filtered = filter === 'all' ? ordersList : ordersList.filter((o) => o.status === filter);

  const confirmOrder = (id: number) => {
    router.post(`/admin/orders/${id}/confirm`);
  };

  const updateStatus = (id: number, status: string) => {
    router.patch(`/admin/orders/${id}/status`, { status });
  };

  return (
    <AdminLayout title="Orders & POS">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#2C2C2C]">Orders &amp; Kitchen Queue</h1>
          <p className="text-xs text-[#2C2C2C]/50 mt-1">
            Live auto-updating queue. Confirming an order sends the confirmation email and PDF invoice to the customer.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#8B9E6E] border border-[#8B9E6E]/40 px-2.5 py-1 bg-white">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B9E6E] animate-pulse" />
          Live Queue
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 text-xs tracking-widest uppercase border ${
              filter === s ? 'bg-[#2C2C2C] text-[#F5F0E8] border-[#2C2C2C]' : 'bg-white text-[#2C2C2C]/60 border-[#E8E0D0]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#E8E0D0] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F0E8] border-b border-[#E8E0D0] text-[10px] tracking-widest uppercase text-[#2C2C2C]/50">
            <tr>
              <th className="text-left px-4 py-3 font-normal">Order #</th>
              <th className="text-left px-4 py-3 font-normal">Customer</th>
              <th className="text-left px-4 py-3 font-normal">Table</th>
              <th className="text-left px-4 py-3 font-normal">Total</th>
              <th className="text-left px-4 py-3 font-normal">Status</th>
              <th className="text-left px-4 py-3 font-normal">Payment</th>
              <th className="text-right px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-[#F5F0E8]">
                <td className="px-4 py-3 font-mono text-xs text-[#C17B3F]">
                  <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                    {order.order_number}
                  </Link>
                </td>
                <td className="px-4 py-3">{order.customer_name}</td>
                <td className="px-4 py-3 text-xs text-[#2C2C2C]/60">{order.table?.name ?? 'Takeaway'}</td>
                <td className="px-4 py-3 font-medium">BDT {Number(order.total).toFixed(0)}</td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border border-[#E8E0D0] px-2 py-1 text-xs bg-white uppercase"
                  >
                    {STATUSES.filter((s) => s !== 'all').map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs uppercase">{order.payment_status}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => confirmOrder(order.id)}
                      className="px-3 py-1 bg-[#8B9E6E] text-white text-[10px] tracking-widest uppercase"
                    >
                      Confirm &amp; Email
                    </button>
                  )}
                  <Link href={`/admin/orders/${order.id}`} className="text-xs text-[#C17B3F] hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
