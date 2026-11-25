import { Link, usePage } from '@inertiajs/react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import type { PageProps } from '../types'

function playOrderChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0.001, start)
      gain.gain.exponentialRampToValueAtTime(0.22, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + duration)
    }

    playTone(880, now, 0.25)
    playTone(1174.66, now + 0.18, 0.4)
  } catch {
    // Ignore audio context restrictions
  }
}

interface Props {
  children: ReactNode
  title: string
}

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Food Products', href: '/admin/foods' },
  { label: 'Master Menu Card', href: '/admin/menu-card' },
  { label: 'Clothing', href: '/admin/clothing' },
  { label: 'Categories', href: '/admin/categories' },
  { label: 'Inventory', href: '/admin/inventory' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Promotions', href: '/admin/promotions' },
  { label: 'QR Studio', href: '/admin/qr-codes' },
  { label: 'Reports', href: '/admin/reports' },
  { label: 'Staff', href: '/admin/staff' },
  { label: 'Settings', href: '/admin/settings' },
]

function isActive(href: string, pathname: string): boolean {
  if (href === '/admin') return pathname === '/admin' || pathname === '/admin/'
  return pathname.startsWith(href)
}

export default function AdminLayout({ children, title }: Props) {
  const { auth, flash } = usePage<PageProps>().props
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [newOrderAlert, setNewOrderAlert] = useState<{
    id: number
    order_number: string
    customer_name: string
    total: number
  } | null>(null)
  const lastOrderIdRef = useRef<number | null>(null)

  useEffect(() => {
    const checkOrders = async () => {
      try {
        const res = await fetch('/admin/live-orders', { headers: { Accept: 'application/json' } })
        if (!res.ok) return
        const data = await res.json()
        const latestId = Number(data.latest_order_id ?? 0)
        if (lastOrderIdRef.current === null) {
          lastOrderIdRef.current = latestId
          return
        }
        if (latestId > lastOrderIdRef.current) {
          lastOrderIdRef.current = latestId
          if (soundEnabled) {
            playOrderChime()
          }
          if (data.latest_order) {
            setNewOrderAlert(data.latest_order)
          }
        }
      } catch {
        // Ignore transient network errors
      }
    }

    checkOrders()
    const timer = setInterval(checkOrders, 4000)
    return () => clearInterval(timer)
  }, [soundEnabled])

  const pathname =
    typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <div className="flex min-h-screen bg-[#F5F0E8]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 w-56 bg-[#2C2C2C] flex flex-col min-h-screen transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-[#E8E0D0]/10">
          <Link href="/admin" className="block" onClick={() => setSidebarOpen(false)}>
            <div className="flex items-center gap-1.5">
              <span className="text-[#F5F0E8] text-xs tracking-widest uppercase font-medium">
                Softyx
              </span>
              <span className="text-[#C17B3F] text-xs">&amp;</span>
              <span className="text-[#F5F0E8] text-xs tracking-widest uppercase font-medium">
                Sip
              </span>
            </div>
            <p className="text-[#E8E0D0]/30 text-[10px] mt-1 tracking-widest uppercase">Admin</p>
          </Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, pathname)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-6 py-2.5 text-xs tracking-wider transition-colors ${
                  active
                    ? 'text-[#F5F0E8] bg-[#C17B3F]/20 border-r-2 border-[#C17B3F]'
                    : 'text-[#E8E0D0]/40 hover:text-[#E8E0D0] hover:bg-[#E8E0D0]/5'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    active ? 'bg-[#C17B3F]' : 'bg-[#E8E0D0]/20'
                  }`}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#E8E0D0]/10">
          <p className="text-[#E8E0D0]/40 text-xs mb-2 truncate">{auth.user?.name}</p>
          <Link
            href="/logout"
            method="post"
            as="button"
            className="text-[10px] tracking-widest uppercase text-[#E8E0D0]/30 hover:text-[#C17B3F] transition-colors"
          >
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-56 flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E8E0D0] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-1 text-[#2C2C2C]/50 hover:text-[#2C2C2C] transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <span className="block w-5 h-px bg-current mb-1" />
              <span className="block w-5 h-px bg-current mb-1" />
              <span className="block w-5 h-px bg-current" />
            </button>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="text-[#2C2C2C]/30 text-xs hover:text-[#C17B3F] transition-colors"
              >
                Site
              </Link>
              <span className="text-[#2C2C2C]/20 text-xs">/</span>
              <span className="text-[#2C2C2C] text-xs">{title}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled
                setSoundEnabled(next)
                if (next) playOrderChime()
              }}
              className={`text-[10px] tracking-widest uppercase px-2.5 py-1 border transition-colors ${
                soundEnabled
                  ? 'border-[#8B9E6E] text-[#8B9E6E]'
                  : 'border-[#E8E0D0] text-[#2C2C2C]/40'
              }`}
            >
              {soundEnabled ? 'Order Sound: On' : 'Order Sound: Off'}
            </button>
            <span className="text-[#2C2C2C]/30 text-xs capitalize">{auth.user?.role}</span>
          </div>
        </header>

        {/* Live New Order Alert */}
        {newOrderAlert && (
          <div className="bg-[#C17B3F] text-[#F5F0E8] px-6 py-3 flex items-center justify-between gap-4">
            <p className="text-xs tracking-wide">
              New Order Received: <strong>{newOrderAlert.order_number}</strong> from{' '}
              <strong>{newOrderAlert.customer_name}</strong> — BDT {Number(newOrderAlert.total).toFixed(0)}
            </p>
            <div className="flex items-center gap-4 text-xs uppercase tracking-widest">
              <Link href={`/admin/orders/${newOrderAlert.id}`} className="underline">
                View Order
              </Link>
              <button onClick={() => setNewOrderAlert(null)} className="opacity-75 hover:opacity-100">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Flash Messages */}
        {flash?.success && (
          <div className="bg-[#8B9E6E]/10 border-b border-[#8B9E6E]/20 px-6 py-3">
            <p className="text-[#8B9E6E] text-xs">{flash.success}</p>
          </div>
        )}
        {flash?.error && (
          <div className="bg-red-50 border-b border-red-100 px-6 py-3">
            <p className="text-red-500 text-xs">{flash.error}</p>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
