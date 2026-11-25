import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import FoodViewer3D from '@/Components/FoodViewer3D';

interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  effective_price: number;
  promotional_price: number | null;
  image: string | null;
  model_3d_url: string | null;
  options: Record<string, number> | null;
  category: string | null;
}

export default function FoodDetail({ product }: { product: ProductDetail }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const hasPromo = product.promotional_price !== null && product.promotional_price < product.price;

  const optionsExtra = selectedOptions.reduce((sum, opt) => {
    return sum + Number(product.options?.[opt] ?? 0);
  }, 0);

  const unitTotal = product.effective_price + optionsExtra;

  const toggleOption = (opt: string) => {
    setSelectedOptions((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
  };

  const handleQuickOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    setSubmitting(true);
    router.post(
      '/orders',
      {
        customer_name: customerName,
        customer_email: customerEmail || null,
        items: [
          {
            food_product_id: product.id,
            quantity,
            options: selectedOptions,
          },
        ],
      },
      { onFinish: () => setSubmitting(false) }
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2C2C2C]">
      <Head title={product.name} />

      <header className="bg-[#2C2C2C] text-[#F5F0E8] px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/menu" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase hover:text-[#C17B3F]">
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Link>
          <span className="text-xs tracking-[0.25em] uppercase text-[#C17B3F]">SOFTYX &amp; SIP</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="aspect-[4/3] bg-[#EAE3D5] border border-[#E5DDD0] overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs tracking-widest uppercase text-[#2C2C2C]/30">
                SOFTYX &amp; SIP
              </div>
            )}
          </div>
          {product.model_3d_url && <FoodViewer3D modelUrl={product.model_3d_url} />}
        </div>

        <div className="space-y-6">
          <div>
            {product.category && (
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#C17B3F]">{product.category}</span>
            )}
            <h1 className="text-3xl font-light mt-1">{product.name}</h1>
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-medium">BDT {unitTotal.toFixed(0)}</span>
              {hasPromo && <span className="text-sm line-through text-[#2C2C2C]/35">BDT {product.price.toFixed(0)}</span>}
            </div>
            {product.description && (
              <p className="text-sm text-[#2C2C2C]/70 leading-relaxed mt-4">{product.description}</p>
            )}
          </div>

          {product.options && Object.keys(product.options).length > 0 && (
            <div className="bg-white border border-[#E5DDD0] p-5">
              <p className="text-[10px] tracking-widest uppercase text-[#2C2C2C]/50 mb-3">Optional Extras</p>
              <div className="space-y-2">
                {Object.entries(product.options).map(([label, price]) => (
                  <label key={label} className="flex items-center justify-between text-sm cursor-pointer">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(label)}
                        onChange={() => toggleOption(label)}
                      />
                      {label}
                    </span>
                    <span className="text-xs text-[#2C2C2C]/60">+BDT {Number(price).toFixed(0)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleQuickOrder} className="bg-white border border-[#E5DDD0] p-5 space-y-4">
            <p className="text-[10px] tracking-widest uppercase text-[#2C2C2C]/50">Quick Order</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#2C2C2C]/50 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-[#E5DDD0] px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#2C2C2C]/50 mb-1">Email (Invoice)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border border-[#E5DDD0] px-3 py-2 text-xs"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-[#2C2C2C]/60">Quantity</label>
              <input
                type="number"
                min={1}
                max={20}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-20 border border-[#E5DDD0] px-3 py-1.5 text-xs text-center"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#A8622D] transition-colors"
            >
              {submitting ? 'Submitting...' : `Order Now — BDT ${(unitTotal * quantity).toFixed(0)}`}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
