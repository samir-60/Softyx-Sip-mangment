import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import type { Order } from '@/types';

export default function OrderShow({ order }: { order: Order }) {
  const togglePaid = () => {
    router.patch(`/admin/orders/${order.id}/payment`, {
      payment_status: order.payment_status === 'paid' ? 'unpaid' : 'paid',
    });
  };

  return (
    <AdminLayout title={`Order ${order.order_number}`}>
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light font-mono text-[#C17B3F]">{order.order_number}</h1>
            <p className="text-xs text-[#2C2C2C]/50">{order.customer_name} &middot; {order.customer_email ?? 'No email'}</p>
          </div>
          <div className="flex gap-3">
            <a
              href={`/orders/${order.order_number}/invoice`}
              className="px-4 py-2 bg-[#2C2C2C] text-[#F5F0E8] text-xs tracking-widest uppercase"
            >
              PDF Invoice
            </a>
            <button
              onClick={togglePaid}
              className="px-4 py-2 border border-[#E8E0D0] bg-white text-xs tracking-widest uppercase"
            >
              Mark {order.payment_status === 'paid' ? 'Unpaid' : 'Paid'}
            </button>
            <Link href="/admin/orders" className="px-4 py-2 text-xs tracking-widest uppercase text-[#2C2C2C]/50">
              Back
            </Link>
          </div>
        </div>

        <div className="bg-white border border-[#E8E0D0] p-6">
          <table className="w-full text-sm mb-4">
            <thead className="border-b border-[#E8E0D0] text-[10px] tracking-widest uppercase text-[#2C2C2C]/40">
              <tr>
                <th className="text-left py-2 font-normal">Item</th>
                <th className="text-center py-2 font-normal">Qty</th>
                <th className="text-right py-2 font-normal">Unit</th>
                <th className="text-right py-2 font-normal">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-[#F5F0E8]">
                  <td className="py-3">{item.product_name}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">BDT {Number(item.unit_price).toFixed(0)}</td>
                  <td className="py-3 text-right font-medium">BDT {Number(item.subtotal).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right space-y-1 text-sm">
            <p className="text-[#2C2C2C]/60">Subtotal: BDT {Number(order.subtotal).toFixed(0)}</p>
            {Number(order.discount_amount) > 0 && (
              <p className="text-[#8B9E6E]">Discount: -BDT {Number(order.discount_amount).toFixed(0)}</p>
            )}
            <p className="text-lg font-medium">Total: BDT {Number(order.total).toFixed(0)}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
