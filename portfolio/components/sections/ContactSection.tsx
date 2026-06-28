'use client';

import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send, CheckCircle2, Link, Rss, MessageCircle } from 'lucide-react';
import { SectionWrapper, SectionHeader } from '@/components/ui/SectionWrapper';
import { useContact } from '@/hooks/useContact';

const contactMethods = [
  { icon: Mail, label: 'Email', value: 'alex@devfolio.com', href: 'mailto:alex@devfolio.com', color: 'from-violet-600 to-blue-600' },
  { icon: MessageSquare, label: 'WhatsApp', value: '+234 800 000 0000', href: 'https://wa.me/2348000000000', color: 'from-green-600 to-teal-600' },
  { icon: MapPin, label: 'Location', value: 'Lagos, Nigeria 🇳🇬', href: '#', color: 'from-pink-600 to-rose-600' },
];

const socials = [
  { icon: Link, href: 'https://github.com', label: 'GitHub' },
  { icon: Rss, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: MessageCircle, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Mail, href: 'mailto:alex@devfolio.com', label: 'Email' },
];

export function ContactSection() {
  const { sending, sent, error, fieldErrors, submit, reset } = useContact();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await submit({
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      subject: fd.get('subject') as string,
      message: fd.get('message') as string,
    });
  };

  return (
    <SectionWrapper id="contact" className="max-w-7xl mx-auto">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.08)_0%,transparent_60%)] pointer-events-none" />

      <SectionHeader
        eyebrow="Get In Touch"
        title="Let's build"
        titleHighlight="together"
        description="Have a project in mind? I'm open to freelance, full-time roles, and consulting. Let's make something great."
      />

      <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Left: info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-3">Ready to work together?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Whether it's a startup MVP, a fintech platform, or an AI-powered tool — I bring the
              technical depth and product thinking to ship software that makes an impact.
            </p>
          </div>

          {/* Contact methods */}
          <div className="space-y-3">
            {contactMethods.map((m, i) => (
              <motion.a
                key={i}
                href={m.href}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 glass border border-white/6 rounded-xl hover:border-violet-500/25 transition-all duration-300 group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <m.icon size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">{m.label}</div>
                  <div className="text-sm text-white font-medium group-hover:text-violet-300 transition-colors">{m.value}</div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Socials */}
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-4">Elsewhere</p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl glass border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/30 transition-all duration-300"
                >
                  <Icon size={17} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {sent ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass border border-green-500/20 rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center gap-4"
            >
              <CheckCircle2 size={48} className="text-green-400" />
              <h3 className="text-xl font-bold text-white">Message Sent!</h3>
              <p className="text-gray-400 text-sm">I'll get back to you within 24 hours.</p>
              <button
                onClick={reset}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                Send another →
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="glass border border-white/8 rounded-2xl p-6 space-y-4"
            >
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { field: 'name', label: 'Name', placeholder: 'Alex Chen', type: 'text' },
                  { field: 'email', label: 'Email', placeholder: 'alex@company.com', type: 'email' },
                ].map(({ field, label, placeholder, type }) => (
                  <div key={field}>
                    <label className="block text-xs text-gray-500 mb-1.5 font-medium">{label}</label>
                    <input
                      type={type}
                      name={field}
                      required
                      placeholder={placeholder}
                      className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all duration-200"
                    />
                    {fieldErrors[field] && (
                      <p className="text-xs text-red-400 mt-1">{fieldErrors[field][0]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Project inquiry / Let's collaborate"
                  className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all duration-200"
                />
                {fieldErrors.subject && (
                  <p className="text-xs text-red-400 mt-1">{fieldErrors.subject[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project, timeline, and budget..."
                  className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all duration-200 resize-none"
                />
                {fieldErrors.message && (
                  <p className="text-xs text-red-400 mt-1">{fieldErrors.message[0]}</p>
                )}
              </div>

              {/* Honeypot */}
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow duration-300 disabled:opacity-70"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
