import { useContext, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from 'react';
import { SiteContext } from './siteContext';
import { readRsvpForm } from './rsvpFields';

interface RsvpFormProps {
  className?: string;
  children: ReactNode;
}

/**
 * Wraps a theme's RSVP form markup and sends the reply to the invitation's guest list.
 * The themes' submit buttons are plain buttons, so any button inside counts as "send".
 */
export default function RsvpForm({ className = '', children }: RsvpFormProps) {
  const { slug, preview } = useContext(SiteContext);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  const [sent, setSent] = useState({ name: '', attending: '' });

  const submit = async () => {
    const form = formRef.current;
    if (!form || state === 'sending') return;
    const reply = readRsvpForm(form);
    if (!reply.name) {
      setError('Please enter your name.');
      form.querySelector<HTMLInputElement>('input:not([type]), input[type="text"]')?.focus();
      return;
    }
    if (reply.hasChoice && !reply.attending) {
      setError('Please let us know if you can come.');
      return;
    }
    setError('');
    if (preview || !slug) {
      setSent({ name: reply.name, attending: reply.attending });
      setState('sent');
      return;
    }
    setState('sending');
    try {
      const res = await fetch(`/api/websites/${encodeURIComponent(slug)}/rsvp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({ name: reply.name, attending: reply.attending, message: reply.message, answers: reply.answers }),
      });
      if (!res.ok) {
        // 403 means the invitation isn't live (unpublished, paused or blocked): say so instead of "try again"
        const reason = res.status === 403 ? (await res.json().catch(() => null))?.error : null;
        setError(res.status === 429 ? 'Too many replies from this device. Please try again later.' : reason || 'Sorry, your reply could not be sent. Please try again.');
        setState('idle');
        return;
      }
      setSent({ name: reply.name, attending: reply.attending });
      setState('sent');
    } catch {
      setError('No connection. Please check your internet and try again.');
      setState('idle');
    }
  };

  if (state === 'sent') {
    return (
      <div className={className} role="status">
        <div className="text-center py-8 space-y-3">
          <p className="text-2xl sm:text-3xl font-bold">Thank you, {sent.name}!</p>
          <p className="opacity-75">
            {sent.attending === 'NO' ? 'We will miss you. Your reply has been sent.' : 'Your RSVP has been sent. We can’t wait to celebrate with you!'}
          </p>
          {preview && <p className="text-xs opacity-60">(Preview: replies are saved once your invitation is published.)</p>}
          <button type="button" onClick={() => setState('idle')} className="text-sm underline opacity-60 hover:opacity-100">
            Send another reply
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };
  const onClickCapture = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form ref={formRef} className={`${className} ${state === 'sending' ? 'opacity-60 pointer-events-none' : ''}`} onSubmit={onSubmit} onClickCapture={onClickCapture} aria-busy={state === 'sending'} noValidate>
      {children}
      {error && <p role="alert" className="text-sm font-semibold text-rose-600 text-center mt-4">{error}</p>}
    </form>
  );
}
