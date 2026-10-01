'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Investor Diligence');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            Contact Vestiq
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto">
            Questions regarding platform due diligence, founder submissions, or compliance review.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Information Column */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <Mail className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="text-sm font-bold text-slate-900 mb-1">Direct Inquiries</h3>
              <p className="text-xs text-slate-600">contact@vestiq.com</p>
              <p className="text-xs text-slate-600">compliance@vestiq.com</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <MapPin className="w-5 h-5 text-blue-600 mb-2" />
              <h3 className="text-sm font-bold text-slate-900 mb-1">Registered Entity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vestiq Platforms Inc.<br />
                Financial Technology Tower, 4th Floor<br />
                Bengaluru, Karnataka 560001
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600 mb-2" />
              <p className="font-semibold mb-1">Legal Notice:</p>
              <p className="leading-relaxed">
                Vestiq is a non-custodial software discovery platform. We do not provide financial advice, broker investments, or accept deposits.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Message Transmitted</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Thank you, {name}. A member of our team will review your inquiry and follow up within 1 business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Vikram Mehta"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-500"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Investor Diligence &amp; Research Tool</option>
                      <option>Startup Listing &amp; Verification</option>
                      <option>Legal &amp; Regulatory Inquiry</option>
                      <option>Technical Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-500"
                      placeholder="Please share details regarding your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
