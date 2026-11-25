import { Head, Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import type { ClothingProduct, LiveSoftyxProduct } from '@/types';

interface Props {
  products: ClothingProduct[];
  liveProducts?: LiveSoftyxProduct[];
}

const COLOUR_MAP: Record<string, string> = {
  Black: '#1A1A1A',
  White: '#F5F5F5',
  Navy: '#1B2A4A',
  Red: '#C0392B',
  Green: '#2ECC71',
  Blue: '#2980B9',
  Grey: '#95A5A6',
  Gray: '#95A5A6',
  Cream: '#F5F0E8',
  Brown: '#8B6914',
  Olive: '#6B7A3C',
};

function ClothingCard({ product }: { product: ClothingProduct }) {
  const hasPromo =
    product.promotional_price !== null &&
    product.display_price !== null &&
    product.promotional_price < product.display_price;

  return (
    <article className="group bg-white border border-[#E8E0D0] overflow-hidden flex flex-col justify-between">
      <div>
        <div className="aspect-[3/4] bg-[#EAE3D5] overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[#2C2C2C]/25 text-xs tracking-widest uppercase">SOFTYX</span>
            </div>
          )}
        </div>
        <div className="p-5">
          {product.category && (
            <span className="text-[10px] tracking-widest uppercase text-[#2C2C2C]/40 block mb-1">
              {product.category}
            </span>
          )}
          <h3 className="text-[#2C2C2C] font-medium text-sm mb-2 leading-tight">{product.name}</h3>
          {product.description && (
            <p className="text-[#2C2C2C]/55 text-xs font-light leading-relaxed mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {product.display_price !== null && (
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-[#2C2C2C] font-medium text-sm">
                ${Number(hasPromo ? product.promotional_price : product.display_price).toFixed(2)}
              </span>
              {hasPromo && (
                <span className="text-[#2C2C2C]/35 text-xs line-through">
                  ${Number(product.display_price).toFixed(2)}
                </span>
              )}
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.sizes.map((size) => (
                <span key={size} className="text-[10px] border border-[#E8E0D0] px-2 py-0.5 text-[#2C2C2C]/60">
                  {size}
                </span>
              ))}
            </div>
          )}

          {product.colours.length > 0 && (
            <div className="flex gap-1.5 mb-2">
              {product.colours.map((colour) => (
                <span
                  key={colour}
                  title={colour}
                  className="w-4 h-4 rounded-full border border-[#D4CCC0]"
                  style={{ backgroundColor: COLOUR_MAP[colour] ?? '#E8E0D0' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-5">
        {product.has_redirect ? (
          <a
            href={product.redirect_url}
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#2C2C2C] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#C17B3F] transition-colors"
          >
            Shop on SOFTYX
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <div className="w-full text-center py-3 bg-[#E8E0D0] text-[#2C2C2C]/40 text-xs tracking-widest uppercase cursor-not-allowed">
            Currently Unavailable
          </div>
        )}
      </div>
    </article>
  );
}

export default function Clothing({ products, liveProducts = [] }: Props) {
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Head title="SOFTYX — Clothing and Fashion" />

      <header className="bg-[#8B9E6E] px-6 py-12 text-[#2C2C2C]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-xs tracking-widest uppercase opacity-75 hover:opacity-100">
              SOFTYX &amp; SIP
            </Link>
            <Link href="/menu" className="text-xs tracking-widest uppercase opacity-75 hover:opacity-100">
              Food Menu
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase opacity-65 mb-2">SOFTYX — Clothing and Fashion</p>
              <h1 className="text-4xl font-light tracking-tight">Official Clothing Showcase</h1>
            </div>
            <div className="border border-[#2C2C2C]/20 p-4 max-w-sm bg-[#F5F0E8]/30">
              <p className="text-xs leading-relaxed">
                Selecting any product redirects you to the official SOFTYX clothing storefront at{' '}
                <a href="https://softyx.shop" className="underline font-medium">
                  softyx.shop
                </a>{' '}
                to complete your purchase.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-14">
        {liveProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between border-b border-[#E8E0D0] pb-3 mb-6">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#5E6E47]">Real-Time Storefront Feed</p>
                <h2 className="text-2xl font-light">Available Now on softyx.shop</h2>
              </div>
              <a
                href="https://softyx.shop"
                className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#C17B3F] hover:underline"
              >
                Visit softyx.shop
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveProducts.map((item) => (
                <article key={item.id} className="bg-white border border-[#E8E0D0] flex flex-col justify-between">
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
                        <span className="text-[10px] tracking-widest uppercase text-[#2C2C2C]/45 truncate">
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
                        <div className="flex items-baseline gap-2 mb-3">
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
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.sizes.map((s) => (
                            <span key={s} className="text-[10px] border border-[#E8E0D0] px-2 py-0.5 text-[#2C2C2C]/60">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.colours.length > 0 && (
                        <p className="text-[11px] text-[#2C2C2C]/50 mt-2">
                          Colours: {item.colours.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <a
                      href={item.url}
                      className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#2C2C2C] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#C17B3F] transition-colors"
                    >
                      Shop on SOFTYX
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {products.length > 0 && (
          <section>
            <div className="border-b border-[#E8E0D0] pb-3 mb-6">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#2C2C2C]/45">Curated Links</p>
              <h2 className="text-2xl font-light">Featured Clothing Links</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ClothingCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {liveProducts.length === 0 && products.length === 0 && (
          <div className="py-20 text-center text-sm text-[#2C2C2C]/40">No clothing products published yet.</div>
        )}
      </main>
    </div>
  );
}
