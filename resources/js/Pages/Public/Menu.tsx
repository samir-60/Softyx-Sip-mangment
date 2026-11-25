import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, Search, ShoppingBag, X } from 'lucide-react';
import type { Category, FoodProduct, RestaurantTable } from '@/types';

interface CartEntry {
  product: FoodProduct;
  quantity: number;
  selectedOptions: string[];
}

interface Props {
  products: FoodProduct[];
  categories: (Category & { food_products_count?: number })[];
  tables?: RestaurantTable[];
  selectedTableId?: number | null;
}

export default function Menu({ products, categories, tables = [], selectedTableId = null }: Props) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableId, setTableId] = useState<string>(selectedTableId ? String(selectedTableId) : '');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === null || p.category_id === activeCategory;
      const matchSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description ?? '').toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, search]);

  const addToCart = (product: FoodProduct) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.product.id === product.id && c.selectedOptions.length === 0);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      return [...prev, { product, quantity: 1, selectedOptions: [] }];
    });
    setCartOpen(true);
  };

  const updateQty = (index: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((entry, i) => (i === index ? { ...entry, quantity: entry.quantity + delta } : entry))
        .filter((entry) => entry.quantity > 0)
    );
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, entry) => sum + entry.product.effective_price * entry.quantity, 0);
  }, [cart]);

  const totalItems = useMemo(() => cart.reduce((sum, entry) => sum + entry.quantity, 0), [cart]);

  const applyPromo = async () => {
    setPromoMessage(null);
    if (!promoCode.trim()) return;
    try {
      const res = await fetch('/orders/validate-promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
        },
        body: JSON.stringify({ code: promoCode, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setPromoDiscount(Number(data.discount));
        setPromoMessage(`Applied: ${data.name} (-$${Number(data.discount).toFixed(2)})`);
      } else {
        setPromoDiscount(0);
        setPromoMessage(data.message ?? 'Invalid code.');
      }
    } catch {
      setPromoMessage('Could not validate code.');
    }
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !customerName.trim()) return;
    setSubmitting(true);
    router.post(
      '/orders',
      {
        customer_name: customerName,
        customer_email: customerEmail || null,
        customer_phone: customerPhone || null,
        table_id: tableId ? Number(tableId) : null,
        promotion_code: promoCode || null,
        notes: notes || null,
        items: cart.map((entry) => ({
          food_product_id: entry.product.id,
          quantity: entry.quantity,
          options: entry.selectedOptions,
        })),
      },
      {
        onFinish: () => setSubmitting(false),
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2C2C2C]">
      <Head title="Live Food Menu" />

      {/* Header */}
      <header className="bg-[#2C2C2C] text-[#F5F0E8] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-xs tracking-[0.25em] uppercase text-[#C17B3F] hover:underline">
              SOFTYX &amp; SIP
            </Link>
            <h1 className="text-3xl sm:text-4xl font-light mt-2">Live Food &amp; Drink Menu</h1>
            <p className="text-xs text-[#E8E0D0]/60 mt-1">
              {selectedTableId
                ? `Table selected: ${tables.find((t) => t.id === selectedTableId)?.name ?? '#' + selectedTableId}`
                : 'Updated directly from our kitchen'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/clothing" className="text-xs tracking-widest uppercase text-[#E8E0D0]/80 hover:text-[#C17B3F]">
              Clothing Store
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#A8622D] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Order ({totalItems})
            </button>
          </div>
        </div>
      </header>

      {/* Sticky Category + Search Bar */}
      <div className="sticky top-0 z-30 bg-[#F5F0E8]/95 border-b border-[#E5DDD0] px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 text-xs tracking-widest uppercase py-1 border-b-2 transition-colors ${
                activeCategory === null ? 'border-[#C17B3F] text-[#C17B3F]' : 'border-transparent text-[#2C2C2C]/60'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 text-xs tracking-widest uppercase py-1 border-b-2 transition-colors ${
                  activeCategory === cat.id ? 'border-[#C17B3F] text-[#C17B3F]' : 'border-transparent text-[#2C2C2C]/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#2C2C2C]/40" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 sm:py-1.5 bg-white border border-[#E5DDD0] focus:border-[#C17B3F] outline-none text-xs w-full"
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-[#2C2C2C]/40">No dishes match your filter.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => {
              const hasPromo = product.promotional_price !== null && product.promotional_price < product.price;
              return (
                <div key={product.id} className="bg-white border border-[#E5DDD0] flex flex-col justify-between">
                  <Link href={`/menu/${product.slug}`} className="group block">
                    <div className="aspect-[4/3] bg-[#EAE3D5] overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs tracking-widest uppercase text-[#2C2C2C]/30">
                          SOFTYX &amp; SIP
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-1">
                        {product.is_featured && (
                          <span className="text-[10px] tracking-widest uppercase text-[#C17B3F]">Featured</span>
                        )}
                        {product.has_3d && (
                          <span className="text-[10px] tracking-widest uppercase text-[#8B9E6E]">3D View</span>
                        )}
                      </div>
                      <h3 className="font-medium text-base mb-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-xs text-[#2C2C2C]/55 line-clamp-2">{product.description}</p>
                      )}
                    </div>
                  </Link>
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-[#F5F0E8]">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-base">BDT {product.effective_price.toFixed(0)}</span>
                      {hasPromo && (
                        <span className="text-xs line-through text-[#2C2C2C]/35">BDT {product.price.toFixed(0)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-[#2C2C2C] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#C17B3F] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cart & Checkout Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
          <div className="w-full max-w-md bg-[#F5F0E8] h-full flex flex-col border-l border-[#E5DDD0]">
            <div className="px-6 py-4 bg-[#2C2C2C] text-[#F5F0E8] flex items-center justify-between">
              <span className="text-xs tracking-widest uppercase">Your Order ({totalItems})</span>
              <button onClick={() => setCartOpen(false)} aria-label="Close order drawer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <p className="text-sm text-[#2C2C2C]/50 text-center py-12">Your order is currently empty.</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {cart.map((entry, idx) => (
                      <div key={idx} className="bg-white p-4 border border-[#E5DDD0] flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">{entry.product.name}</p>
                          <p className="text-xs text-[#2C2C2C]/50">BDT {entry.product.effective_price.toFixed(0)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(idx, -1)}
                            className="w-7 h-7 border border-[#E5DDD0] flex items-center justify-center hover:border-[#C17B3F]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs w-5 text-center">{entry.quantity}</span>
                          <button
                            onClick={() => updateQty(idx, 1)}
                            className="w-7 h-7 border border-[#E5DDD0] flex items-center justify-center hover:border-[#C17B3F]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code */}
                  <div className="bg-white p-4 border border-[#E5DDD0]">
                    <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-2">
                      Promotion Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. SOFTYX10"
                        className="flex-1 border border-[#E5DDD0] px-3 py-2 text-xs uppercase"
                      />
                      <button
                        type="button"
                        onClick={applyPromo}
                        className="px-4 py-2 bg-[#2C2C2C] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#C17B3F]"
                      >
                        Apply
                      </button>
                    </div>
                    {promoMessage && <p className="text-xs mt-2 text-[#8B9E6E]">{promoMessage}</p>}
                  </div>

                  {/* Customer Info Form */}
                  <form id="order-form" onSubmit={submitOrder} className="space-y-3 bg-white p-4 border border-[#E5DDD0]">
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full border border-[#E5DDD0] px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">
                        Email (for confirmation &amp; PDF invoice)
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full border border-[#E5DDD0] px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full border border-[#E5DDD0] px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">
                          Table
                        </label>
                        <select
                          value={tableId}
                          onChange={(e) => setTableId(e.target.value)}
                          className="w-full border border-[#E5DDD0] px-3 py-2 text-xs bg-white"
                        >
                          <option value="">Takeaway</option>
                          {tables.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-1">
                        Notes
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full border border-[#E5DDD0] px-3 py-2 text-xs"
                      />
                    </div>
                  </form>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-[#E5DDD0] space-y-3">
                <div className="flex justify-between text-xs text-[#2C2C2C]/60">
                  <span>Subtotal</span>
                  <span>BDT {subtotal.toFixed(0)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-xs text-[#8B9E6E]">
                    <span>Discount</span>
                    <span>-BDT {promoDiscount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium border-t border-[#E5DDD0] pt-2">
                  <span>Total</span>
                  <span>BDT {Math.max(0, subtotal - promoDiscount).toFixed(0)}</span>
                </div>
                <button
                  type="submit"
                  form="order-form"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#A8622D] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
