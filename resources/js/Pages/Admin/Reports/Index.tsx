import AdminLayout from '@/Layouts/AdminLayout';

interface Props {
  totalRevenue: number;
  totalOrders: number;
  paidOrders: number;
  averageOrder: number;
  topItems: { product_name: string; total_qty: number; total_sales: number }[];
  recentAudits: { id: number; action: string; created_at: string; user?: { name: string } }[];
}

export default function ReportsIndex({
  totalRevenue,
  totalOrders,
  paidOrders,
  averageOrder,
  topItems,
  recentAudits,
}: Props) {
  return (
    <AdminLayout title="Sales Reports & Analytics">
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E8E0D0] p-5">
            <p className="text-[10px] tracking-widest uppercase text-[#2C2C2C]/40">Total Revenue</p>
            <p className="text-2xl font-light mt-1">BDT {Number(totalRevenue).toFixed(0)}</p>
          </div>
          <div className="bg-white border border-[#E8E0D0] p-5">
            <p className="text-[10px] tracking-widest uppercase text-[#2C2C2C]/40">Total Orders</p>
            <p className="text-2xl font-light mt-1">{totalOrders}</p>
          </div>
          <div className="bg-white border border-[#E8E0D0] p-5">
            <p className="text-[10px] tracking-widest uppercase text-[#2C2C2C]/40">Paid Orders</p>
            <p className="text-2xl font-light mt-1">{paidOrders}</p>
          </div>
          <div className="bg-white border border-[#E8E0D0] p-5">
            <p className="text-[10px] tracking-widest uppercase text-[#2C2C2C]/40">Average Order</p>
            <p className="text-2xl font-light mt-1">BDT {Number(averageOrder).toFixed(0)}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white border border-[#E8E0D0] p-6">
            <h2 className="text-xs tracking-widest uppercase text-[#2C2C2C]/50 mb-4">Top Selling Dishes</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E0D0] text-[10px] uppercase text-[#2C2C2C]/40">
                  <th className="text-left py-2 font-normal">Item</th>
                  <th className="text-center py-2 font-normal">Qty</th>
                  <th className="text-right py-2 font-normal">Sales</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item) => (
                  <tr key={item.product_name} className="border-b border-[#F5F0E8]">
                    <td className="py-2.5">{item.product_name}</td>
                    <td className="py-2.5 text-center">{item.total_qty}</td>
                    <td className="py-2.5 text-right font-medium">${Number(item.total_sales).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-[#E8E0D0] p-6">
            <h2 className="text-xs tracking-widest uppercase text-[#2C2C2C]/50 mb-4">Audit Trail</h2>
            <div className="space-y-2 text-xs">
              {recentAudits.map((log) => (
                <div key={log.id} className="flex justify-between border-b border-[#F5F0E8] pb-2">
                  <span>{log.action}</span>
                  <span className="text-[#2C2C2C]/45">{log.user?.name ?? 'System'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
