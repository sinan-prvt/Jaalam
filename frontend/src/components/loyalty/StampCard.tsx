import { motion } from 'framer-motion';
import {
  BookOpen, Cake, Car, Coffee, Dumbbell, Flower2, Gem, Gift, Heart, IceCreamCone, PawPrint, Pill, Pizza,
  Scissors, Shirt, ShoppingBag, Sparkles, Star, UtensilsCrossed, Wrench,
} from 'lucide-react';
import type { LoyaltyIconName, LoyaltySettings } from '../../utils/loyalty';
import { rewardLine } from '../../utils/loyalty';

const ICONS: Record<LoyaltyIconName, typeof Star> = {
  coffee: Coffee,
  food: UtensilsCrossed,
  pizza: Pizza,
  cake: Cake,
  icecream: IceCreamCone,
  scissors: Scissors,
  sparkles: Sparkles,
  dumbbell: Dumbbell,
  shopping: ShoppingBag,
  shirt: Shirt,
  gem: Gem,
  book: BookOpen,
  pill: Pill,
  car: Car,
  wrench: Wrench,
  paw: PawPrint,
  flower: Flower2,
  gift: Gift,
  heart: Heart,
  star: Star,
};

export function LoyaltyIcon({ name, size = 20, className }: { name: LoyaltyIconName; size?: number; className?: string }) {
  const Icon = ICONS[name] || Star;
  return <Icon size={size} className={className} />;
}

interface Props {
  program: Pick<LoyaltySettings, 'reward' | 'stamps_required' | 'icon' | 'color'>;
  business: string;
  stamps: number;
  name?: string;
  /** Pop the newest stamp in (on the live card) */
  animate?: boolean;
}

/** The stamp card itself: shop name, reward, and a grid of stamp circles. */
export default function StampCard({ program, business, stamps, name, animate = false }: Props) {
  const total = Math.max(1, program.stamps_required);
  const filled = Math.min(stamps, total);
  // Even rows: 6 → one row, 8 → 4 + 4, 9 → 5 + 4, 12 → 6 + 6
  const columns = total <= 6 ? total : total <= 10 ? Math.ceil(total / 2) : total <= 18 ? 6 : 7;
  const ready = stamps >= total;

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-5 sm:p-6 text-white shadow-2xl"
      style={{ background: `linear-gradient(140deg, ${program.color} 0%, ${program.color}dd 55%, #0f172a 160%)` }}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -left-12 -bottom-16 h-44 w-44 rounded-full bg-black/10" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">Rewards card</p>
          <h2 className="mt-1 text-xl sm:text-2xl font-black leading-tight break-words">{business}</h2>
        </div>
        <div className="shrink-0 rounded-2xl bg-white/15 p-2.5">
          <LoyaltyIcon name={program.icon} size={22} />
        </div>
      </div>

      <p className="relative mt-2 text-sm font-semibold text-white/85">{rewardLine(program)}</p>

      <div className="relative mt-5 grid gap-2.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: total }, (_, i) => {
          const on = i < filled;
          const last = i === total - 1;
          const newest = animate && on && i === filled - 1;
          return (
            <motion.div
              key={i}
              initial={newest ? { scale: 0.3, rotate: -30, opacity: 0 } : false}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 14 }}
              className={`aspect-square rounded-full flex items-center justify-center border-2 ${
                on ? 'bg-white border-white shadow-lg' : 'border-dashed border-white/45 bg-white/5'
              }`}
              style={on ? { color: program.color } : undefined}
            >
              {on
                ? <LoyaltyIcon name={program.icon} size={18} />
                : last
                  ? <Gift size={16} className="text-white/60" />
                  : <span className="text-[11px] font-black text-white/50">{i + 1}</span>}
            </motion.div>
          );
        })}
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-white/85 truncate">{name || ' '}</span>
        <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 font-black">
          {ready ? 'Reward ready!' : `${filled} / ${total}`}
        </span>
      </div>
    </div>
  );
}
