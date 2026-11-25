import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Clock, Download, ExternalLink, Printer } from 'lucide-react';
import type { Order } from '@/types';

const WHEEL_SEGMENTS = [
  { label: '10% Food', color: '#2C2C2C', text: '#F5F0E8' },
  { label: '10% SOFTYX', color: '#8B9E6E', text: '#FAF6EE' },
  { label: 'BDT 50 Food', color: '#C17B3F', text: '#FAF6EE' },
  { label: '15% SOFTYX', color: '#3D3028', text: '#F5F0E8' },
  { label: '15% Food', color: '#D4A843', text: '#2C2C2C' },
  { label: '5% Food', color: '#5E6E47', text: '#FAF6EE' },
];

export default function OrderConfirmation({ order }: { order: Order }) {
  const [liveStatus, setLiveStatus] = useState(order.status);
  const [prepEndsAt, setPrepEndsAt] = useState(order.prep_ends_at ?? null);
  const totalPrepSeconds = (order.prep_minutes ?? 10) * 60;

  const computeRemaining = (endsAt = prepEndsAt) => {
    if (!endsAt) return totalPrepSeconds;
    const diff = Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  };

  const [secondsLeft, setSecondsLeft] = useState<number>(() => computeRemaining(order.prep_ends_at ?? null));
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [reward, setReward] = useState(order.spin_reward ?? null);

  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsLeft(computeRemaining());
    }, 1000);

    const pollStatus = setInterval(async () => {
      try {
        const res = await fetch(`/orders/${order.order_number}/status`, { headers: { Accept: 'application/json' } });
        if (!res.ok) return;
        const json = await res.json();
        if (json.status) setLiveStatus(json.status);
        if (json.prep_ends_at) setPrepEndsAt(json.prep_ends_at);
      } catch {
        // Ignore transient network errors
      }
    }, 4000);

    return () => {
      clearInterval(tick);
      clearInterval(pollStatus);
    };
  }, [prepEndsAt, order.order_number]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const progressPct = Math.min(100, Math.max(0, ((totalPrepSeconds - secondsLeft) / totalPrepSeconds) * 100));

  const handleSpin = async () => {
    if (spinning || reward) return;
    setSpinning(true);
    try {
      const res = await fetch(`/orders/${order.order_number}/spin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
        },
      });
      const json = await res.json();
      if (json.reward) {
        const segIndex = json.reward.index ?? 0;
        const sliceDeg = 360 / WHEEL_SEGMENTS.length;
        const targetAngle = 360 * 5 + (360 - segIndex * sliceDeg - sliceDeg / 2);
        setRotation(targetAngle);
        setTimeout(() => {
          setReward(json.reward);
          setSpinning(false);
        }, 3600);
      } else {
        setSpinning(false);
      }
    } catch {
      setSpinning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2C2C2C] py-12 px-6">
      <Head title={`Invoice ${order.order_number}`} />

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Invoice Card */}
        <div className="bg-white border border-[#E5DDD0] shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-[#2C2C2C] via-[#3D3028] to-[#2C2C2C] text-[#F5F0E8] p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs tracking-[0.25em] uppercase text-[#C17B3F]">SOFTYX &amp; SIP</span>
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#8B9E6E]">
                <CheckCircle2 className="w-4 h-4" />
                {liveStatus}
              </span>
            </div>
            <h1 className="text-3xl font-light">Order Confirmed</h1>
            <p className="text-xs text-[#E8E0D0]/60 mt-1 font-mono">
              {order.order_number} &middot; {order.created_at}
            </p>
          </div>

          {/* Real-Time Animated Prep Countdown */}
          <div className="bg-[#FAF6EE] border-b border-[#E5DDD0] px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#C17B3F] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  Live Kitchen Preparation Timer
                </p>
                <p className="text-xs text-[#2C2C2C]/60 mt-1">
                  Estimated prep: {order.prep_minutes ?? 10} min (Standard 5–10 min, max 20 min)
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-3xl font-medium tracking-wider text-[#2C2C2C]">
                  {secondsLeft > 0 ? `${mins}:${secs}` : 'READY'}
                </span>
              </div>
            </div>
            <div className="mt-4 h-2 w-full bg-[#E5DDD0] overflow-hidden">
              <div
                className="h-full bg-[#C17B3F] transition-all duration-1000 ease-linear"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Invoice Body */}
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-xs border-b border-[#E5DDD0] pb-4">
              <div>
                <span className="uppercase tracking-widest text-[#2C2C2C]/40 block mb-1">Customer</span>
                <span className="font-medium text-sm">{order.customer_name}</span>
                {order.customer_email && <span className="block text-[#2C2C2C]/60">{order.customer_email}</span>}
              </div>
              <div className="text-right">
                <span className="uppercase tracking-widest text-[#2C2C2C]/40 block mb-1">Dining</span>
                <span className="font-medium text-sm">{order.table_name ?? 'Takeaway'}</span>
              </div>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5DDD0] text-[10px] tracking-widest uppercase text-[#2C2C2C]/40">
                  <th className="text-left py-2 font-normal">Item</th>
                  <th className="text-center py-2 font-normal">Qty</th>
                  <th className="text-right py-2 font-normal">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-[#F5F0E8]">
                    <td className="py-3">
                      <span className="font-medium">{item.product_name}</span>
                      <span className="block text-xs text-[#2C2C2C]/45">BDT {item.unit_price.toFixed(0)} each</span>
                    </td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right font-medium">BDT {item.subtotal.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-[#F5F0E8] p-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-[#2C2C2C]/60">
                <span>Subtotal</span>
                <span>BDT {order.subtotal.toFixed(0)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-[#8B9E6E]">
                  <span>Discount</span>
                  <span>-BDT {order.discount_amount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-base border-t border-[#E5DDD0] pt-2">
                <span>Total</span>
                <span>BDT {order.total.toFixed(0)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex gap-3">
                <a
                  href={`/orders/${order.order_number}/invoice`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C2C2C] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#C17B3F] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF Invoice
                </a>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E5DDD0] text-xs tracking-widest uppercase hover:border-[#2C2C2C]"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
              <Link href="/menu" className="text-xs tracking-widest uppercase text-[#C17B3F] hover:underline">
                Back to Menu
              </Link>
            </div>
          </div>
        </div>

        {/* Spin-the-Wheel Reward Game */}
        <div className="bg-[#FAF6EE] border-2 border-[#2C2C2C] p-6 sm:p-8 text-center print:hidden">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#C17B3F] mb-1">While You Wait</p>
          <h2
            className="text-3xl font-medium text-[#2C2C2C] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Spin &amp; Win Food or Clothing Discounts
          </h2>
          <p className="text-xs text-[#2C2C2C]/60 mb-6">
            One spin per order — unlock instant savings for SOFTYX &amp; SIP food or SOFTYX clothing.
          </p>

          <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto mb-6">
            {/* Pointer */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-[#C17B3F]" />
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full rounded-full border-4 border-[#2C2C2C]"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
              }}
            >
              {WHEEL_SEGMENTS.map((seg, i) => {
                const slice = 360 / WHEEL_SEGMENTS.length;
                const startAngle = (i * slice - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * slice - 90) * (Math.PI / 180);
                const x1 = 100 + 100 * Math.cos(startAngle);
                const y1 = 100 + 100 * Math.sin(startAngle);
                const x2 = 100 + 100 * Math.cos(endAngle);
                const y2 = 100 + 100 * Math.sin(endAngle);
                const midAngle = i * slice + slice / 2;

                return (
                  <g key={seg.label}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                      fill={seg.color}
                      stroke="#FAF6EE"
                      strokeWidth="1"
                    />
                    <text
                      x="100"
                      y="32"
                      fill={seg.text}
                      fontSize="8.5"
                      fontWeight="600"
                      textAnchor="middle"
                      transform={`rotate(${midAngle}, 100, 100)`}
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}
              <circle cx="100" cy="100" r="14" fill="#FAF6EE" stroke="#2C2C2C" strokeWidth="3" />
            </svg>
          </div>

          {!reward ? (
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="px-8 py-3 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#A8622D] disabled:opacity-50 transition-colors"
            >
              {spinning ? 'Spinning...' : 'Spin Now'}
            </button>
          ) : (
            <div className="bg-white border border-[#2C2C2C] p-5 max-w-sm mx-auto space-y-2">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#8B9E6E]">You Won</p>
              <p className="text-xl font-medium text-[#2C2C2C]">{reward.label}</p>
              <p className="text-xs text-[#2C2C2C]/60">
                Coupon Code:{' '}
                <span className="font-mono font-semibold text-[#C17B3F] px-2 py-0.5 bg-[#FAF6EE] border border-[#E5DDD0]">
                  {reward.code}
                </span>
              </p>
              {reward.target === 'clothing' ? (
                <a
                  href="https://softyx.shop"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs tracking-widest uppercase text-[#C17B3F] hover:underline"
                >
                  Redeem at softyx.shop
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link
                  href="/menu"
                  className="inline-block mt-2 text-xs tracking-widest uppercase text-[#C17B3F] hover:underline"
                >
                  Apply on Next Food Order
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
