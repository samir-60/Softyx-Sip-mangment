import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { Printer, ArrowLeft } from 'lucide-react';
import type { Category } from '@/types';

interface MasterFoodItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  effective_price: number;
  promotional_price: number | null;
  image: string | null;
  category_id: number | null;
  category_name: string;
  qr_image_url: string;
  qr_download_url: string;
}

interface Props {
  categories: Category[];
  foods: MasterFoodItem[];
  mainQrUrl: string;
}

export default function MasterMenuCard({ categories, foods, mainQrUrl }: Props) {
  const grouped = categories
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      items: foods.filter((f) => f.category_id === cat.id),
    }))
    .filter((g) => g.items.length > 0);

  const uncategorized = foods.filter((f) => !f.category_id);
  if (uncategorized.length > 0) {
    grouped.push({ id: 0, name: 'House Specials', items: uncategorized });
  }

  return (
    <AdminLayout title="All-in-One Master Menu Card">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/admin/foods"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#2C2C2C]/60 hover:text-[#C17B3F]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Food Management
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#A8622D]"
          >
            <Printer className="w-4 h-4" />
            Print All-in-One Menu Card
          </button>
        </div>

        {/* Single Unified Editorial Master Menu Card */}
        <div className="bg-[#FAF6EE] border-2 border-[#2C2C2C] p-3">
          <div className="border border-[#2C2C2C]/35 p-8 sm:p-12 space-y-10">
            {/* Masthead */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#2C2C2C]/25 pb-6">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-[#C17B3F]">Official Dining Card</p>
                <h1
                  className="text-4xl sm:text-5xl font-medium text-[#2C2C2C] mt-1"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  SOFTYX <span className="italic text-[#C17B3F] font-normal">&amp;</span> SIP
                </h1>
                <p className="text-xs text-[#2C2C2C]/55 mt-1 tracking-wide">
                  Scan any dish code to inspect details &amp; order live, or scan the full menu code.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white border border-[#2C2C2C] p-2.5 shrink-0 self-start">
                <img src={mainQrUrl} alt="Full Menu QR" className="w-20 h-20" />
                <div className="text-[10px] tracking-widest uppercase text-[#2C2C2C]/70 leading-snug pr-1">
                  Full<br />Live<br />Menu
                </div>
              </div>
            </div>

            {/* Category Sections inside the ONE card */}
            {grouped.map((group) => (
              <section key={group.id} className="space-y-4">
                <div className="flex items-center gap-4">
                  <h2
                    className="text-2xl font-medium text-[#2C2C2C]"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {group.name}
                  </h2>
                  <div className="flex-1 h-px bg-[#2C2C2C]/20" />
                </div>

                <div className="divide-y divide-[#2C2C2C]/10">
                  {group.items.map((item) => {
                    const hasPromo = item.promotional_price !== null && item.promotional_price < item.price;
                    return (
                      <div key={item.id} className="py-4 flex items-center justify-between gap-5">
                        <div className="flex items-center gap-4 min-w-0">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-14 object-cover border border-[#2C2C2C]/15 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-baseline gap-3">
                              <h3 className="font-medium text-base text-[#2C2C2C]">{item.name}</h3>
                              <span className="text-sm font-semibold text-[#C17B3F]">
                                BDT {item.effective_price.toFixed(0)}
                              </span>
                              {hasPromo && (
                                <span className="text-xs line-through text-[#2C2C2C]/35">
                                  BDT {item.price.toFixed(0)}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-[#2C2C2C]/60 mt-1 line-clamp-2">{item.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Auto-generated per-item QR scanner */}
                        <div className="shrink-0 flex flex-col items-center bg-white border border-[#2C2C2C]/30 p-1.5">
                          <img src={item.qr_image_url} alt={`QR ${item.name}`} className="w-16 h-16" />
                          <span className="text-[8px] tracking-widest uppercase text-[#2C2C2C]/50 mt-0.5">Scan</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            {grouped.length === 0 && (
              <p className="text-sm text-[#2C2C2C]/45 text-center py-8">No published food items yet.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
