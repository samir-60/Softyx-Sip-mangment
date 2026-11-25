import { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ExternalLink, QrCode, Utensils, Shirt, X } from 'lucide-react';
import type { ClothingProduct, FoodProduct, LiveSoftyxProduct } from '@/types';

interface PromoSummary {
  id: number;
  name: string;
  code: string | null;
  type: string;
  value: number;
}

interface Props {
  featuredFoods?: FoodProduct[];
  featuredClothing?: ClothingProduct[];
  liveClothing?: LiveSoftyxProduct[];
  activePromotions?: PromoSummary[];
}

export default function Welcome({
  featuredFoods = [],
  featuredClothing = [],
  liveClothing = [],
  activePromotions = [],
}: Props) {
  const [festPopupOpen, setFestPopupOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('mu_cse_fest_2026_seen')) {
      const timer = setTimeout(() => setFestPopupOpen(true), 250);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeFestPopup = () => {
    setFestPopupOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mu_cse_fest_2026_seen', '1');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2C2C2C]">
      <Head title="SOFTYX & SIP — Food, Drinks and Fashion" />

      {/* MU CSE Fest 2026 Animated Welcome Popup */}
      {festPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-[fadeIn_0.35s_ease-out]">
          <div className="relative w-full max-w-lg bg-[#FAF6EE] border-2 border-[#2C2C2C] p-3 shadow-2xl animate-[scaleIn_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="border border-[#2C2C2C]/30 p-8 text-center relative">
              <button
                onClick={closeFestPopup}
                aria-label="Close welcome popup"
                className="absolute top-4 right-4 p-1.5 text-[#2C2C2C]/60 hover:text-[#C17B3F] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#C17B3F] mb-3">
                Special Campus Edition
              </p>
              <h2
                className="text-4xl sm:text-5xl font-medium text-[#2C2C2C] leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Welcome to<br />
                <span className="text-[#C17B3F] italic">MU CSE Fest 2026</span>
              </h2>
              <div className="w-12 h-px bg-[#2C2C2C]/30 mx-auto my-5" />
              <p className="text-xs sm:text-sm text-[#2C2C2C]/70 leading-relaxed mb-7">
                Presented by <strong>SOFTYX &amp; SIP</strong>. Order fresh food &amp; drinks with live prep tracking, spin to win fest discounts, and explore official SOFTYX apparel.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/menu"
                  onClick={closeFestPopup}
                  className="px-7 py-3 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#A8622D] transition-colors"
                >
                  Explore Live Menu
                </Link>
                <button
                  onClick={closeFestPopup}
                  className="px-7 py-3 border border-[#2C2C2C] text-xs tracking-widest uppercase hover:bg-[#2C2C2C] hover:text-[#F5F0E8] transition-colors"
                >
                  Enter Site
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation — always show brand + links on all screen sizes */}
      <header className="sticky top-0 z-50 bg-[#F5F0E8]/95 backdrop-blur border-b border-[#E5DDD0]">
        <div className="max-w-6xl mx-auto px-4 h-12 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="text-[11px] sm:text-sm font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase">Softyx</span>
            <span className="text-[#C17B3F] font-light text-xs sm:text-sm">&amp;</span>
            <span className="text-[11px] sm:text-sm font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase">Sip</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs tracking-widest uppercase">
            <Link href="/menu" className="hover:text-[#C17B3F] transition-colors whitespace-nowrap">
              Food Menu
            </Link>
            <Link href="/clothing" className="hover:text-[#C17B3F] transition-colors whitespace-nowrap">
              Clothing
            </Link>
          </nav>
        </div>
      </header>

      {/* Editorial Split Hero — identical layout on mobile & desktop, video always fills behind */}
      <section className="relative overflow-hidden border-b border-[#E5DDD0] bg-[#1C1814] text-[#F5F0E8] min-h-[56vw] sm:min-h-0">
        {/* Full-bleed video background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            src="/videos/hero-cooking.mp4"
          />
          <div className="absolute inset-0 bg-[#1C1814]/55 pointer-events-none" />
        </div>

        {/* Grid — always 12 cols so both columns show side-by-side on every screen */}
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-12 min-h-[56vw] sm:min-h-[60vw] lg:min-h-[78vh]">

          {/* LEFT: brand statement — col-span-7 on all sizes */}
          <div className="col-span-7 px-3 sm:px-6 lg:px-10 py-5 sm:py-14 lg:py-24 flex flex-col justify-between border-r border-[#F5F0E8]/15">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-2 sm:mb-8 lg:mb-10">
                <span className="w-4 sm:w-8 h-px bg-[#C17B3F]" />
                <span className="text-[7px] xs:text-[9px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.35em] uppercase text-[#C17B3F]">
                  Kitchen, Bar &amp; Atelier
                </span>
              </div>

              {/* Brand name — scales smoothly across breakpoints */}
              <h1
                className="font-medium tracking-[0.04em] leading-none mb-2 sm:mb-6 lg:mb-8"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(1.1rem, 5.5vw, 4.25rem)',
                  whiteSpace: 'nowrap',
                }}
              >
                SOFTYX{' '}
                <span className="text-[#C17B3F] italic font-normal">&amp;</span>{' '}
                SIP
              </h1>

              {/* Tagline — hidden on very tiny mobile to save space */}
              <p
                className="text-[#E8E0D0]/80 font-light leading-snug sm:leading-relaxed hidden xs:block"
                style={{ fontSize: 'clamp(0.6rem, 1.8vw, 1.05rem)' }}
              >
                Two distinct houses under one roof: live kitchen &amp; craft beverages at your table, paired with direct access to the official SOFTYX clothing house.
              </p>
            </div>

            {/* CTA buttons — compact single-line on mobile */}
            <div className="mt-3 sm:mt-10 lg:mt-12 flex flex-wrap items-center gap-1.5 sm:gap-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-1 sm:gap-3 px-2.5 sm:px-8 py-1.5 sm:py-4 bg-[#C17B3F] text-[#F5F0E8] text-[8px] xs:text-[9px] sm:text-xs tracking-[0.08em] sm:tracking-[0.2em] uppercase whitespace-nowrap hover:bg-[#A96832] transition-colors"
              >
                <Utensils className="w-2.5 h-2.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Browse Food Menu</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:inline shrink-0" />
              </Link>
              <Link
                href="/clothing"
                className="inline-flex items-center gap-1 sm:gap-3 px-2.5 sm:px-8 py-1.5 sm:py-4 border border-[#F5F0E8]/35 text-[#F5F0E8] text-[8px] xs:text-[9px] sm:text-xs tracking-[0.08em] sm:tracking-[0.2em] uppercase whitespace-nowrap hover:border-[#8B9E6E] hover:text-[#8B9E6E] transition-colors"
              >
                <Shirt className="w-2.5 h-2.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Explore Clothing</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: info cards — col-span-5 on all sizes */}
          <div className="col-span-5 flex flex-col">
            {/* Dining card */}
            <div className="flex-1 px-2 py-3 sm:p-8 lg:p-12 border-b border-[#F5F0E8]/15 flex flex-col justify-between bg-[#252525]/60">
              <div>
                <span
                  className="uppercase text-[#D4A843] tracking-[0.18em]"
                  style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.65rem)' }}
                >
                  01 / Dining
                </span>
                <h2
                  className="font-light mt-0.5 sm:mt-2 mb-1 sm:mb-3 leading-tight"
                  style={{ fontSize: 'clamp(0.65rem, 2.2vw, 1.5rem)' }}
                >
                  SOFTYX &amp; SIP — Food and Drinks
                </h2>
                <p
                  className="text-[#E8E0D0]/70 font-light leading-snug hidden sm:block"
                  style={{ fontSize: 'clamp(0.55rem, 1.3vw, 0.875rem)' }}
                >
                  Scan any table QR for real-time dishes, live pricing, customizations, and instant kitchen ordering with PDF invoice confirmation.
                </p>
              </div>
              <div
                className="mt-2 sm:mt-6 flex items-center justify-between gap-1 uppercase text-[#C17B3F] tracking-wider"
                style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.75rem)' }}
              >
                <span className="inline-flex items-center gap-1">
                  <QrCode className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Live QR Menu</span>
                  <span className="xs:hidden">QR</span>
                </span>
                <Link href="/menu" className="underline underline-offset-2 hover:text-[#F5F0E8]">
                  Open Menu
                </Link>
              </div>
            </div>

            {/* Apparel card */}
            <div className="flex-1 px-2 py-3 sm:p-8 lg:p-12 flex flex-col justify-between bg-[#323A2B]/65">
              <div>
                <span
                  className="uppercase text-[#D4A843] tracking-[0.18em]"
                  style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.65rem)' }}
                >
                  02 / Apparel
                </span>
                <h2
                  className="font-light mt-0.5 sm:mt-2 mb-1 sm:mb-3 leading-tight"
                  style={{ fontSize: 'clamp(0.65rem, 2.2vw, 1.5rem)' }}
                >
                  SOFTYX — Clothing and Fashion
                </h2>
                <p
                  className="text-[#E8E0D0]/75 font-light leading-snug hidden sm:block"
                  style={{ fontSize: 'clamp(0.55rem, 1.3vw, 0.875rem)' }}
                >
                  Preview live available garments from our official storefront, then jump directly to softyx.shop to complete your purchase.
                </p>
              </div>
              <div
                className="mt-2 sm:mt-6 flex flex-wrap items-center justify-between gap-1 uppercase text-[#D4A843] tracking-wider"
                style={{ fontSize: 'clamp(0.5rem, 1.2vw, 0.75rem)' }}
              >
                <span className="hidden lg:inline">Official Store: softyx.shop</span>
                <a href="https://softyx.shop" className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-[#F5F0E8]">
                  Shop on SOFTYX
                  <ExternalLink className="w-2 h-2 sm:w-3.5 sm:h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Promotions Bar */}
      {activePromotions.length > 0 && (
        <section className="bg-[#D4A843]/15 border-b border-[#D4A843]/30 py-3 px-6">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs tracking-wider">
            {activePromotions.map((promo) => (
              <span key={promo.id} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#C17B3F] inline-block" />
                <span className="font-medium">{promo.name}</span>
                {promo.code && (
                  <span className="font-mono px-2 py-0.5 bg-[#2C2C2C] text-[#F5F0E8] text-[10px]">
                    {promo.code}
                  </span>
                )}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Featured Food */}
      {featuredFoods.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10 border-b border-[#E5DDD0] pb-4">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#C17B3F] mb-1">From the Kitchen</p>
              <h2 className="text-3xl font-light">Featured Food &amp; Drinks</h2>
            </div>
            <Link href="/menu" className="text-xs tracking-widest uppercase text-[#2C2C2C]/70 hover:text-[#C17B3F]">
              View Full Menu
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFoods.map((item) => (
              <Link
                key={item.id}
                href={`/menu/${item.slug}`}
                className="group bg-white border border-[#E5DDD0] hover:border-[#C17B3F] transition-colors"
              >
                <div className="aspect-[4/3] bg-[#EAE3D5] overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs tracking-widest uppercase text-[#2C2C2C]/30">
                      SOFTYX &amp; SIP
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                  <p className="text-xs text-[#2C2C2C]/55 line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-sm">BDT {item.effective_price.toFixed(0)}</span>
                    {item.promotional_price !== null && item.promotional_price < item.price && (
                      <span className="text-xs line-through text-[#2C2C2C]/35">BDT {item.price.toFixed(0)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Live Clothing from softyx.shop + Featured Clothing */}
      {(liveClothing.length > 0 || featuredClothing.length > 0) && (
        <section className="bg-[#EAE3D5]/60 border-t border-[#E5DDD0] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10 border-b border-[#D8CFC0] pb-4">
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-[#5E6E47] mb-1">
                  SOFTYX — Live from softyx.shop
                </p>
                <h2 className="text-3xl font-light">Available Clothing</h2>
              </div>
              <div className="flex items-center gap-5">
                <Link href="/clothing" className="text-xs tracking-widest uppercase text-[#2C2C2C]/70 hover:text-[#C17B3F]">
                  Browse All
                </Link>
                <a
                  href="https://softyx.shop"
                  className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#C17B3F] hover:underline"
                >
                  softyx.shop
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveClothing.map((item) => (
                <div key={item.id} className="bg-white border border-[#E5DDD0] flex flex-col justify-between">
                  <div>
                    <div className="aspect-[4/3] bg-[#EAE3D5] overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs tracking-widest uppercase text-[#2C2C2C]/30">
                          SOFTYX
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] tracking-widest uppercase text-[#5E6E47] truncate">
                          {item.category}
                        </span>
                        <span className="text-[10px] tracking-widest uppercase text-[#8B9E6E] shrink-0">
                          In Stock
                        </span>
                      </div>
                      <h3 className="font-medium text-sm mb-2">{item.name}</h3>
                      {item.description && (
                        <p className="text-xs text-[#2C2C2C]/55 line-clamp-2 mb-3">{item.description}</p>
                      )}
                      {item.price !== null && (
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-sm font-medium">
                            {item.currency} {item.price.toFixed(0)}
                          </span>
                          {item.compare_price && (
                            <span className="text-xs line-through text-[#2C2C2C]/35">
                              {item.currency} {item.compare_price.toFixed(0)}
                            </span>
                          )}
                        </div>
                      )}
                      {item.sizes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.sizes.map((s) => (
                            <span key={s} className="text-[10px] border border-[#E5DDD0] px-1.5 py-0.5 text-[#2C2C2C]/60">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <a
                      href={item.url}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#2C2C2C] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#C17B3F] transition-colors"
                    >
                      Shop on SOFTYX
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
              {liveClothing.length === 0 &&
                featuredClothing.map((item) => (
                  <div key={item.id} className="bg-white border border-[#E5DDD0] flex flex-col justify-between">
                    <div>
                      <div className="aspect-[3/4] bg-[#EAE3D5] overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs tracking-widest uppercase text-[#2C2C2C]/30">
                            SOFTYX
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-medium text-sm mb-2">{item.name}</h3>
                        {item.display_price !== null && (
                          <p className="text-sm font-medium mb-3">${(item.promotional_price ?? item.display_price).toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                    <div className="px-5 pb-5">
                      {item.has_redirect ? (
                        <a
                          href={item.redirect_url}
                          className="block w-full text-center py-2.5 bg-[#2C2C2C] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#C17B3F] transition-colors"
                        >
                          Shop on SOFTYX
                        </a>
                      ) : (
                        <span className="block w-full text-center py-2.5 bg-[#E5DDD0] text-[#2C2C2C]/40 text-xs tracking-widest uppercase">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#2C2C2C] text-[#E8E0D0] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#F5F0E8]">SOFTYX &amp; SIP</p>
            <p className="text-xs text-[#E8E0D0]/50 mt-1">Food and Drinks Management Platform</p>
          </div>
          <div className="text-xs text-[#E8E0D0]/60">
            Official Clothing Store:{' '}
            <a href="https://softyx.shop" className="text-[#C17B3F] hover:underline">
              https://softyx.shop
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
