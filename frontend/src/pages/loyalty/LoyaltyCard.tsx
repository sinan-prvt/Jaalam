import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { Gift, Loader2, MessageCircle, Minus, Plus, ScanLine, Share2, Smartphone } from 'lucide-react';
import StampCard from '../../components/loyalty/StampCard';
import { triggerConfettiPopper } from '../../utils/confettiPopper';
import { apiError } from '../../utils/apiError';
import { waNumber } from '../../utils/crm';
import { cardLink, saveCard, type CardView } from '../../utils/loyalty';

const POLL_MS = 5000;

const EVENT_LABEL = { STAMP: 'Stamp added', REDEEM: 'Reward given', UNDO: 'Stamp removed' };

/**
 * One customer's card (/card/:code). The customer keeps it open at the counter and it
 * updates by itself when staff stamp it; the shop's staff see the controls.
 */
export default function LoyaltyCard() {
  const { code = '' } = useParams();
  const [params] = useSearchParams();
  const [card, setCard] = useState<CardView | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<'' | 'stamp' | 'redeem' | 'undo'>('');
  const lastStamps = useRef<number | null>(null);

  const show = useCallback((next: CardView) => {
    const before = lastStamps.current;
    if (before !== null && next.stamps > before) {
      triggerConfettiPopper();
      if (!next.can_manage) toast.success(next.reward_ready ? 'Card full! Your reward is ready 🎉' : 'New stamp added!');
    }
    lastStamps.current = next.stamps;
    setCard(next);
  }, []);

  const load = useCallback(() => axios.get(`/api/loyalty/cards/${code}/`)
    .then((res) => show(res.data))
    .catch((err) => {
      if (err?.response?.status === 404) setError('This card link is not valid.');
      else if (lastStamps.current === null) setError('Could not load your card. Please check your internet and try again.');
    }), [code, show]);

  useEffect(() => {
    load();
    const id = window.setInterval(() => { if (document.visibilityState === 'visible') load(); }, POLL_MS);
    return () => window.clearInterval(id);
  }, [load]);

  // Just stamped by scanning the shop's QR: celebrate once
  const celebrated = useRef(false);
  useEffect(() => {
    if (card && params.get('stamped') === '1' && !celebrated.current) {
      celebrated.current = true;
      triggerConfettiPopper();
    }
  }, [card, params]);

  useEffect(() => {
    if (!card) return;
    document.title = `${card.program.business} rewards card`;
    if (!card.can_manage) saveCard(card.program.slug, card.code); // opened from a shared link
  }, [card]);

  const act = async (what: 'stamp' | 'redeem' | 'undo', e?: React.MouseEvent) => {
    setBusy(what);
    try {
      const res = await axios.post(`/api/loyalty/cards/${code}/${what}/`, {}, { withCredentials: true });
      show(res.data);
      if (what === 'redeem') {
        triggerConfettiPopper(e);
        toast.success(`Reward given to ${res.data.name}`);
      } else if (what === 'stamp') {
        toast.success(res.data.reward_ready ? 'Card full: reward is ready' : `Stamp added (${res.data.stamps}/${res.data.stamps_required})`);
      } else {
        toast('Stamp removed');
      }
    } catch (err) {
      const data = (err as { response?: { data?: { card?: CardView } } })?.response?.data;
      if (data?.card) show(data.card);
      toast.error(apiError(err, 'Could not update the card. Please try again.'));
    } finally {
      setBusy('');
    }
  };

  const share = async () => {
    const url = cardLink(code);
    try {
      if (navigator.share) await navigator.share({ title: `${card?.program.business} rewards card`, url });
      else { await navigator.clipboard.writeText(url); toast.success('Card link copied'); }
    } catch { /* closed the share sheet */ }
  };

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 text-center text-slate-600 font-medium">{error}</div>;
  }
  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700" />
      </div>
    );
  }

  const { program } = card;
  const left = Math.max(0, card.stamps_required - card.stamps);
  const wa = waNumber(card.phone);
  const waText = card.reward_ready
    ? `Hi ${card.name}, your ${program.business} rewards card is full! Your reward (${program.reward}) is waiting for you. Your card: ${cardLink(code)}`
    : `Hi ${card.name}, you have ${card.stamps} of ${card.stamps_required} stamps at ${program.business}. Just ${left} more to get ${program.reward}! Your card: ${cardLink(code)}`;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-md">
        {params.get('welcome') === '1' && !card.can_manage && (
          <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-800">
            Welcome, {card.name}! Your card is ready. Show this screen at the counter to collect stamps.
          </div>
        )}

        {!card.can_manage && params.get('stamped') === '1' && (
          <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-800">
            {card.reward_ready ? 'Stamp added and your card is full! 🎉' : `Stamp added! Thanks for visiting, ${card.name}.`}
          </div>
        )}
        {!card.can_manage && params.get('already') === '1' && (
          <div className="mb-4 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm font-bold text-amber-800">
            {card.reward_ready ? 'Your card is full! Ask at the counter for your reward.' : "You already got today's stamp. See you on your next visit!"}
          </div>
        )}

        <StampCard program={program} business={program.business} stamps={card.stamps} name={card.name} animate />

        {!card.active && (
          <p className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm font-semibold text-amber-800">
            This shop has paused its rewards card for now. Your stamps are kept safe.
          </p>
        )}

        {card.reward_ready ? (
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white border-2 px-4 py-4 shadow-sm" style={{ borderColor: program.color }}>
            <Gift size={28} style={{ color: program.color }} className="shrink-0" />
            <div>
              <p className="font-black text-slate-900">Your reward is ready!</p>
              <p className="text-sm text-slate-500">Show this card at the counter to get {program.reward}.</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-center text-sm font-bold text-slate-600">
            {left} more stamp{left === 1 ? '' : 's'} to get {program.reward}
          </p>
        )}

        {card.can_manage ? (
          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Staff</p>
                <p className="font-black text-slate-900 truncate">{card.name} · {card.phone}</p>
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {card.stamps_today} today · max {program.max_stamps_per_day}
              </span>
            </div>

            {card.reward_ready ? (
              <button
                onClick={(e) => act('redeem', e)}
                disabled={!!busy || !card.active}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-black text-white shadow-lg disabled:opacity-60"
                style={{ backgroundColor: program.color }}
              >
                {busy === 'redeem' ? <Loader2 className="animate-spin" size={20} /> : <Gift size={20} />} Give reward
              </button>
            ) : (
              <button
                onClick={() => act('stamp')}
                disabled={!!busy || !card.active}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-black text-white shadow-lg disabled:opacity-60"
                style={{ backgroundColor: program.color }}
              >
                {busy === 'stamp' ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />} Add stamp
              </button>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => act('undo')}
                disabled={!!busy || card.stamps === 0 || !card.active}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 disabled:opacity-40"
              >
                <Minus size={16} /> Undo stamp
              </button>
              {wa ? (
                <a
                  href={`https://wa.me/${wa}?text=${encodeURIComponent(waText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              ) : <span />}
            </div>

            <Link to="/dashboard/scan" className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white">
              <ScanLine size={16} /> Scan the next card
            </Link>

            {!!card.events?.length && (
              <ul className="mt-4 divide-y divide-slate-100 text-sm">
                {card.events.map((ev, i) => (
                  <li key={i} className="flex justify-between gap-3 py-2">
                    <span className="font-semibold text-slate-700">{EVENT_LABEL[ev.kind]}</span>
                    <span className="text-slate-400 text-right">{new Date(ev.at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}{ev.by ? ` · ${ev.by}` : ''}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-slate-400">{card.rewards_redeemed} reward{card.rewards_redeemed === 1 ? '' : 's'} given so far</p>
          </section>
        ) : (
          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm border border-slate-200 text-center">
            {program.stamp_mode === 'STAFF' ? (
              <>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Show this at the counter</p>
                <div className="mx-auto mt-3 w-fit rounded-2xl bg-white p-3 border border-slate-100">
                  <QRCodeSVG value={cardLink(code)} size={190} level="M" />
                </div>
                <p className="mt-3 text-xs text-slate-500">Staff scan it to add your stamp. This page updates by itself.</p>
              </>
            ) : (
              <>
                <p className="text-base font-black text-slate-900">How to get a stamp</p>
                <p className="mt-1 text-sm text-slate-600">
                  {program.stamp_mode === 'CODE'
                    ? "On each visit, scan the QR at the billing counter and type today's code. The cashier tells you the code after you pay."
                    : program.stamp_mode === 'SCREEN'
                      ? 'On each visit, open your phone camera and scan the QR on the counter screen. The stamp is added by itself.'
                      : 'On each visit, scan the QR at the counter with your phone camera while you are at the shop.'}
                </p>
                {card.reward_ready && (
                  <>
                    <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Claim your reward: show this to the staff</p>
                    <div className="mx-auto mt-3 w-fit rounded-2xl bg-white p-3 border border-slate-100">
                      <QRCodeSVG value={cardLink(code)} size={170} level="M" />
                    </div>
                  </>
                )}
              </>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={share} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700">
                <Share2 size={16} /> Save link
              </button>
              <div className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 px-2 text-xs font-semibold text-slate-500">
                <Smartphone size={15} className="shrink-0" /> Tip: Add to Home screen
              </div>
            </div>
            {card.rewards_redeemed > 0 && (
              <p className="mt-4 text-sm font-semibold text-slate-600">You have enjoyed {card.rewards_redeemed} reward{card.rewards_redeemed === 1 ? '' : 's'} here 🎉</p>
            )}
          </section>
        )}

        {program.terms && <p className="mt-4 px-2 text-center text-xs text-slate-500">{program.terms}</p>}
        <p className="mt-6 text-center text-xs text-slate-400">Powered by Jaalam</p>
      </div>
    </div>
  );
}
