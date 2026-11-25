import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { Download, Printer, ArrowLeft } from 'lucide-react';

interface Props {
  food: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    effective_price: number;
    promotional_price: number | null;
    image: string | null;
    category: string;
    status: string;
  };
  qr: {
    uuid: string;
    image_url: string;
    scan_url: string;
    download_url: string;
  };
}

export default function MenuCard({ food, qr }: Props) {
  const hasPromo = food.promotional_price !== null && food.promotional_price < food.price;

  return (
    <AdminLayout title={`Menu Card — ${food.name}`}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/admin/foods"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#2C2C2C]/60 hover:text-[#C17B3F]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Food Menu
          </Link>
          <div className="flex items-center gap-3">
            <a
              href={qr.download_url}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#2C2C2C] text-xs tracking-widest uppercase hover:bg-[#2C2C2C] hover:text-[#F5F0E8] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download QR SVG
            </a>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#C17B3F] text-[#F5F0E8] text-xs tracking-widest uppercase hover:bg-[#A8622D]"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Menu Card
            </button>
          </div>
        </div>

        {/* Physical Editorial Table Menu Card */}
        <div className="bg-[#FAF6EE] border-2 border-[#2C2C2C] p-3 shadow-sm">
          <div className="border border-[#2C2C2C]/35 p-8 sm:p-10 space-y-8">
            {/* Card Masthead */}
            <div className="flex items-center justify-between border-b border-[#2C2C2C]/20 pb-4">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-[#C17B3F]">SOFTYX &amp; SIP</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#2C2C2C]/45 mt-0.5">
                  {food.category} &middot; Item #{String(food.id).padStart(3, '0')}
                </p>
              </div>
              <span className="text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 border border-[#2C2C2C]/30 text-[#2C2C2C]/70">
                Table Card
              </span>
            </div>

            {/* Dish Photo (if uploaded) */}
            {food.image && (
              <div className="aspect-[16/9] bg-[#EAE3D5] border border-[#2C2C2C]/15 overflow-hidden">
                <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Dish Title, Description & BDT Price */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                <h1
                  className="text-3xl sm:text-4xl font-medium text-[#2C2C2C] leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {food.name}
                </h1>
                <div className="shrink-0 flex items-baseline gap-2">
                  <span className="text-2xl font-medium text-[#2C2C2C]">
                    BDT {food.effective_price.toFixed(0)}
                  </span>
                  {hasPromo && (
                    <span className="text-xs line-through text-[#2C2C2C]/40">
                      BDT {food.price.toFixed(0)}
                    </span>
                  )}
                </div>
              </div>

              {food.description && (
                <p className="text-sm text-[#2C2C2C]/70 leading-relaxed font-light">
                  {food.description}
                </p>
              )}
            </div>

            {/* QR Scan Strip */}
            <div className="border-t border-[#2C2C2C]/20 pt-6 flex items-center justify-between gap-6">
              <div className="space-y-1.5">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#C17B3F]">Scan to Order</p>
                <p className="text-sm font-medium text-[#2C2C2C]">{food.name}</p>
                <p className="text-xs text-[#2C2C2C]/55">
                  Point your phone camera at this code to view live availability, add extras, and order directly.
                </p>
              </div>
              <div className="shrink-0 bg-white p-2.5 border border-[#2C2C2C]">
                <img src={qr.image_url} alt={`QR for ${food.name}`} className="w-28 h-28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
