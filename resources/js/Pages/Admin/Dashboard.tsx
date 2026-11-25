import { useEffect, useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout'
import { Link } from '@inertiajs/react'
import type { Order } from '../../types'

interface Stats {
  total_food_products: number
  total_clothing_products: number
  total_orders_today: number
  revenue_today: number
  pending_orders: number
  low_stock_items: number
}

interface Props {
  stats: Stats
  recentOrders: Order[]
}

function StatCard({
  label,
  value,
  accent,
  href,
}: {
  label: string
  value: string | number
  accent?: boolean
  href?: string
}) {
  const inner = (
    <div
      className={`p-6 border transition-colors ${
        accent
          ? 'border-[#C17B3F] bg-[#C17B3F]/5 hover:bg-[#C17B3F]/10'
          : 'border-[#E8E0D0] bg-white hover:border-[#C17B3F]/30'
      } ${href ? 'cursor-pointer' : ''}`}
    >
      <p className="text-[#2C2C2C]/40 text-xs tracking-widest uppercase mb-3">{label}</p>
      <p className={`text-3xl font-light tabular-nums ${accent ? 'text-[#C17B3F]' : 'text-[#2C2C2C]'}`}>
        {value}
      </p>
    </div>
  )

  return href ? <Link href={href}>{inner}</Link> : inner
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-[#8B9E6E]/20 text-[#8B9E6E]',
  pending: 'bg-[#D4A843]/20 text-[#D4A843]',
  preparing: 'bg-blue-50 text-blue-500',
  ready: 'bg-purple-50 text-purple-500',
  delivered: 'bg-[#8B9E6E]/10 text-[#8B9E6E]/70',
  cancelled: 'bg-red-50 text-red-400',
}

export default function Dashboard({ stats: initialStats, recentOrders: initialOrders }: Props) {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [recentOrders, setRecentOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/admin/live-orders', { headers: { Accept: 'application/json' } });
        if (!res.ok) return;
        const json = await res.json();
        if (json.stats) setStats(json.stats);
        if (json.recentOrders) setRecentOrders(json.recentOrders);
      } catch {
        // Ignore transient network errors
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#2C2C2C] tracking-tight">Overview</h1>
          <p className="text-[#2C2C2C]/40 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#8B9E6E] border border-[#8B9E6E]/40 px-2.5 py-1 bg-white">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B9E6E] animate-pulse" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard
          label="Food Products"
          value={stats.total_food_products}
          href="/admin/foods"
        />
        <StatCard
          label="Clothing Products"
          value={stats.total_clothing_products}
          href="/admin/clothing"
        />
        <StatCard
          label="Orders Today"
          value={stats.total_orders_today}
          accent
          href="/admin/orders"
        />
        <StatCard
          label="Revenue Today"
          value={`BDT ${Number(stats.revenue_today).toFixed(0)}`}
          accent
        />
        <StatCard
          label="Pending Orders"
          value={stats.pending_orders}
          href="/admin/orders"
        />
        <StatCard label="Low Stock Items" value={stats.low_stock_items} href="/admin/inventory" />
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xs tracking-widest uppercase text-[#2C2C2C]/50">Recent Orders</h2>
          <div className="flex-1 h-px bg-[#E8E0D0]" />
          <Link href="/admin/orders" className="text-[10px] tracking-widest uppercase text-[#C17B3F] hover:text-[#A8622D] transition-colors">
            View All
          </Link>
        </div>
        <div className="bg-white border border-[#E8E0D0] overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="border-b border-[#E8E0D0] bg-[#F5F0E8]">
              <tr>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#2C2C2C]/40 font-normal">
                  Order
                </th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#2C2C2C]/40 font-normal">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#2C2C2C]/40 font-normal">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#2C2C2C]/40 font-normal">
                  Payment
                </th>
                <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-[#2C2C2C]/40 font-normal">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[#E8E0D0] last:border-0 hover:bg-[#F5F0E8]/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-[#C17B3F]">
                    <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#2C2C2C] text-sm">{order.customer_name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] tracking-wider uppercase px-2 py-1 ${
                        STATUS_STYLES[order.status] ?? 'bg-[#E8E0D0] text-[#2C2C2C]/50'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] tracking-wider uppercase ${
                        order.payment_status === 'paid'
                          ? 'text-[#8B9E6E]'
                          : order.payment_status === 'refunded'
                          ? 'text-red-400'
                          : 'text-[#D4A843]'
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[#2C2C2C] tabular-nums">
                    BDT {Number(order.total).toFixed(0)}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[#2C2C2C]/30 text-xs">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
