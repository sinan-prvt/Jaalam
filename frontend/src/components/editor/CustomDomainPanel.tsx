import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CheckCircle2, Copy, ExternalLink, Link2, Loader2, RefreshCw, ShieldCheck, Trash2, XCircle } from 'lucide-react';

interface DnsRecord { type: string; name: string; host: string; value: string; purpose: string }
interface DomainState {
  domain: string | null;
  verified: boolean;
  verified_at?: string | null;
  records: DnsRecord[];
  auto_ssl: boolean;
  check?: { ownership: boolean; apex: boolean; www: boolean; verified: boolean; error?: string; found?: Record<string, string[]>; hosting?: Record<string, any> };
}

const copy = (text: string) => {
  navigator.clipboard?.writeText(text).then(() => toast.success('Copied'), () => toast.error('Copy failed'));
};

/** Editor → Domain: connect a custom domain, show DNS records, verify them. */
export default function CustomDomainPanel({ slug }: { slug: string }) {
  const [state, setState] = useState<DomainState | null>(null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState<'load' | 'connect' | 'verify' | 'remove' | null>('load');

  useEffect(() => {
    let alive = true;
    axios.get(`/api/websites/${slug}/domain/`)
      .then(res => alive && setState(res.data))
      .catch(() => alive && setState({ domain: null, verified: false, records: [], auto_ssl: false }))
      .finally(() => alive && setBusy(null));
    return () => { alive = false; };
  }, [slug]);

  const errorText = (err: any, fallback: string) => err?.response?.data?.error || fallback;

  const connect = async () => {
    if (!input.trim()) return;
    setBusy('connect');
    try {
      const res = await axios.post(`/api/websites/${slug}/domain/`, { domain: input });
      setState(res.data);
      setInput('');
      toast.success('Domain added. Now add the DNS records below.');
    } catch (err) {
      toast.error(errorText(err, 'Could not add this domain'));
    } finally {
      setBusy(null);
    }
  };

  const verify = async () => {
    setBusy('verify');
    try {
      const res = await axios.post(`/api/websites/${slug}/domain/verify/`);
      setState(res.data);
      if (res.data.verified) toast.success('Domain verified and connected!');
      else toast('Records not found yet. DNS changes can take a few minutes to a few hours.', { icon: '⏳' });
    } catch (err) {
      toast.error(errorText(err, 'Verification failed'));
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Disconnect ${state?.domain}? Your site will stop loading on this domain.`)) return;
    setBusy('remove');
    try {
      const res = await axios.delete(`/api/websites/${slug}/domain/`);
      setState(res.data);
      toast.success('Domain disconnected');
    } catch (err) {
      toast.error(errorText(err, 'Could not disconnect'));
    } finally {
      setBusy(null);
    }
  };

  if (busy === 'load' || !state) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" /> Loading domain settings…
      </div>
    );
  }

  const check = state.check;
  const Tick = ({ ok, label }: { ok?: boolean; label: string }) => (
    <div className={`flex items-center gap-2 text-xs font-bold ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
      {ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {label}
    </div>
  );

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md"><Link2 size={20} /></div>
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-slate-900 text-sm">Custom Domain</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Use your own address, e.g. mybusiness.com</p>
        </div>
        {state.domain && (
          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${state.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {state.verified ? 'Connected' : 'Pending DNS'}
          </span>
        )}
      </div>

      {!state.domain ? (
        <div className="space-y-3">
          <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20">
            <span className="px-3 py-2.5 text-slate-400 bg-slate-100 border-r border-slate-200 select-none flex items-center font-bold text-sm">https://</span>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && connect()}
              className="flex-1 bg-transparent px-3 py-2.5 outline-none text-slate-900 placeholder-slate-400 font-bold text-sm min-w-0"
              placeholder="mybusiness.com"
            />
          </div>
          <button
            onClick={connect}
            disabled={busy === 'connect' || !input.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black py-3 rounded-xl transition-all shadow-md active:scale-95 text-sm flex items-center justify-center gap-2"
          >
            {busy === 'connect' ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />} Connect Domain
          </button>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Don't have one yet? Buy it from any registrar (GoDaddy, Namecheap, Hostinger…) and come back to connect it.{' '}
            {input.trim() && (
              <a className="font-bold text-indigo-600 hover:underline" target="_blank" rel="noreferrer" href={`https://www.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(input.trim())}`}>Check availability</a>
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <span className="font-black text-slate-900 text-sm truncate">{state.domain}</span>
            {state.verified && (
              <a href={`https://${state.domain}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-1.5 rounded-lg"><ExternalLink size={16} /></a>
            )}
          </div>

          {state.verified ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800 flex gap-3">
              <ShieldCheck size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Your site is live on {state.domain}</p>
                <p className="text-xs mt-1 text-emerald-700">
                  {state.auto_ssl
                    ? 'HTTPS is set up automatically and can take a few minutes the first time.'
                    : 'The platform admin must also add this domain to the hosting project for HTTPS. We have been notified.'}
                  {' '}Keep the DNS records below in place.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-600 leading-relaxed">
              Log in to the company where you bought <b>{state.domain}</b>, open its <b>DNS settings</b> and add these records. Then press <b>Verify</b>.
            </div>
          )}

          <div className="space-y-2">
            {state.records.map(r => (
              <div key={r.type + r.name} className="border border-slate-200 rounded-xl p-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-2 py-0.5 rounded">{r.type}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{r.purpose}</span>
                </div>
                <div className="grid grid-cols-[52px_1fr_auto] gap-x-2 gap-y-1.5 items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Name</span>
                  <code className="font-mono text-slate-800 truncate">{r.name}</code>
                  <button onClick={() => copy(r.name)} className="text-slate-400 hover:text-indigo-600" title="Copy"><Copy size={13} /></button>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Value</span>
                  <code className="font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded break-all">{r.value}</code>
                  <button onClick={() => copy(r.value)} className="text-slate-400 hover:text-indigo-600" title="Copy"><Copy size={13} /></button>
                </div>
              </div>
            ))}
          </div>

          {check && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
              <Tick ok={check.ownership} label="TXT verification record found" />
              <Tick ok={check.apex} label={`${state.domain} points to us (A record)`} />
              <Tick ok={check.www} label={`www.${state.domain} points to us (CNAME)`} />
              {check.error && <p className="text-xs text-rose-600">{check.error}</p>}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={verify}
              disabled={busy === 'verify'}
              className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-black py-3 rounded-xl transition-all shadow-md active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              {busy === 'verify' ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} {state.verified ? 'Re-check DNS' : 'Verify'}
            </button>
            <button
              onClick={remove}
              disabled={busy === 'remove'}
              className="px-4 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-black rounded-xl text-sm flex items-center gap-2"
              title="Disconnect domain"
            >
              <Trash2 size={16} />
            </button>
          </div>
          {!state.verified && <p className="text-[10px] text-slate-400 text-center">DNS changes usually show up within minutes, but can take up to 48 hours.</p>}
        </div>
      )}
    </div>
  );
}
