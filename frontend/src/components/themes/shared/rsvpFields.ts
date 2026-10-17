// The invitation themes' RSVP forms are hand-designed and differ in labels and markup, so the
// reply is read from the rendered form: the first text box is the guest's name, the chosen
// radio says attending or not, text areas are the message, anything else goes into `answers`.

export interface RsvpReply {
  name: string;
  attending: '' | 'YES' | 'NO';
  message: string;
  answers: Record<string, string>;
  /** The form has attend/decline options (so one must be picked). */
  hasChoice: boolean;
}

const DECLINE = /declin|regret|sorry|can'?t|cannot|unable|sadly|\bno\b/i;

const clean = (text: string | null | undefined) => (text || '').replace(/\s+/g, ' ').trim();

function fieldLabel(el: HTMLElement, form: HTMLFormElement): string {
  // Usually <div><label>Name</label><input/></div>: a label beside the field.
  for (let node = el.parentElement; node && node !== form.parentElement; node = node.parentElement) {
    const label = Array.from(node.children).find(
      (child) => child.tagName === 'LABEL' && !child.contains(el) && !child.querySelector('input, textarea, select'),
    );
    if (label) return clean(label.textContent);
    if (node === el.parentElement && (el as HTMLInputElement).placeholder) break;
  }
  return clean((el as HTMLInputElement).placeholder) || (el as HTMLInputElement).name || 'Answer';
}

export function readRsvpForm(form: HTMLFormElement): RsvpReply {
  const reply: RsvpReply = { name: '', attending: '', message: '', answers: {}, hasChoice: false };
  const messages: string[] = [];
  form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select').forEach((el) => {
    const type = (el.getAttribute('type') || 'text').toLowerCase();
    if (['hidden', 'submit', 'button', 'reset', 'file'].includes(type)) return;
    if (type === 'radio' || type === 'checkbox') {
      const option = clean(el.closest('label')?.textContent) || el.value;
      if (type === 'radio') reply.hasChoice = true;
      if (!(el as HTMLInputElement).checked) return;
      if (type === 'radio' && !reply.attending) reply.attending = DECLINE.test(option) ? 'NO' : 'YES';
      else reply.answers[fieldLabel(el, form)] = option;
      return;
    }
    const value = el.value.trim();
    if (!value) return;
    if (el.tagName === 'TEXTAREA') messages.push(value);
    else if (!reply.name && el.tagName === 'INPUT' && ['text', 'search', ''].includes(type)) reply.name = value;
    else reply.answers[fieldLabel(el, form)] = value;
  });
  reply.message = messages.join('\n\n');
  return reply;
}
