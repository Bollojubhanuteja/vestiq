'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  Briefcase,
  UserCheck,
  Shield,
  Layers,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
  Bookmark,
  Scale,
  Send,
  HelpCircle
} from 'lucide-react';

interface CurrentUser {
  userId: string;
  email: string;
  role: 'INVESTOR' | 'BUSINESS' | 'ADMIN';
  name: string;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickDemoLogin = async (role: 'INVESTOR' | 'BUSINESS' | 'ADMIN') => {
    let email = 'investor@vestiq.com';
    if (role === 'ADMIN') email = 'admin@vestiq.com';
    if (role === 'BUSINESS') email = 'contact@agripulse.demo';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'Password123!' }),
      });
      if (res.ok) {
        await fetchSession();
        if (role === 'INVESTOR') router.push('/dashboard/investor');
        else if (role === 'BUSINESS') router.push('/dashboard/business');
        else if (role === 'ADMIN') router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-blue-700 transition">
                V
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">VESTIQ</span>
                <span className="block text-[10px] tracking-wider uppercase font-semibold text-slate-500 -mt-1">
                  Discovery &amp; Research
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
              <Link
                href="/explore"
                className={`px-3 py-2 rounded-md hover:text-blue-600 hover:bg-slate-50 transition ${
                  pathname === '/explore' ? 'text-blue-600 bg-blue-50/50 font-semibold' : ''
                }`}
              >
                Explore Opportunities
              </Link>
              <Link
                href="/how-it-works"
                className={`px-3 py-2 rounded-md hover:text-blue-600 hover:bg-slate-50 transition ${
                  pathname === '/how-it-works' ? 'text-blue-600 bg-blue-50/50 font-semibold' : ''
                }`}
              >
                How It Works
              </Link>
              <Link
                href="/for-investors"
                className={`px-3 py-2 rounded-md hover:text-blue-600 hover:bg-slate-50 transition ${
                  pathname === '/for-investors' ? 'text-blue-600 bg-blue-50/50 font-semibold' : ''
                }`}
              >
                For Investors
              </Link>
              <Link
                href="/for-businesses"
                className={`px-3 py-2 rounded-md hover:text-blue-600 hover:bg-slate-50 transition ${
                  pathname === '/for-businesses' ? 'text-blue-600 bg-blue-50/50 font-semibold' : ''
                }`}
              >
                For Businesses
              </Link>
              <Link
                href="/about"
                className={`px-3 py-2 rounded-md hover:text-blue-600 hover:bg-slate-50 transition ${
                  pathname === '/about' ? 'text-blue-600 bg-blue-50/50 font-semibold' : ''
                }`}
              >
                About
              </Link>
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Demo Switcher Pill */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80 text-xs">
              <span className="px-2 font-medium text-slate-500">Quick Test:</span>
              <button
                onClick={() => handleQuickDemoLogin('INVESTOR')}
                className={`px-2 py-1 rounded transition font-medium ${
                  user?.role === 'INVESTOR' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                }`}
                title="Log in as Demo Investor (Vikram)"
              >
                Investor
              </button>
              <button
                onClick={() => handleQuickDemoLogin('BUSINESS')}
                className={`px-2 py-1 rounded transition font-medium ${
                  user?.role === 'BUSINESS' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                }`}
                title="Log in as Demo Startup (AgriPulse)"
              >
                Startup
              </button>
              <button
                onClick={() => handleQuickDemoLogin('ADMIN')}
                className={`px-2 py-1 rounded transition font-medium ${
                  user?.role === 'ADMIN' ? 'bg-amber-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                }`}
                title="Log in as Lead Admin (Elena)"
              >
                Admin
              </button>
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-sm font-medium text-slate-800 shadow-sm transition"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {user.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                    </div>

                    {user.role === 'INVESTOR' && (
                      <>
                        <Link
                          href="/dashboard/investor"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Compass className="w-4 h-4 text-blue-500" /> Investor Dashboard
                        </Link>
                        <Link
                          href="/dashboard/investor/watchlist"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Bookmark className="w-4 h-4 text-blue-500" /> Saved Watchlist
                        </Link>
                        <Link
                          href="/dashboard/investor/compare"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Scale className="w-4 h-4 text-blue-500" /> Compare Tools
                        </Link>
                        <Link
                          href="/dashboard/investor/requests"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Send className="w-4 h-4 text-blue-500" /> Information Requests
                        </Link>
                        <Link
                          href="/dashboard/investor/preferences"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Sparkles className="w-4 h-4 text-blue-500" /> Match Preferences
                        </Link>
                      </>
                    )}

                    {user.role === 'BUSINESS' && (
                      <>
                        <Link
                          href="/dashboard/business"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Briefcase className="w-4 h-4 text-emerald-500" /> Business Dashboard
                        </Link>
                        <Link
                          href="/dashboard/business/opportunity"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Layers className="w-4 h-4 text-emerald-500" /> Opportunity Profile
                        </Link>
                        <Link
                          href="/dashboard/business/requests"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Send className="w-4 h-4 text-emerald-500" /> Inbound Inquiries
                        </Link>
                      </>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 font-semibold hover:bg-amber-50"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Shield className="w-4 h-4 text-amber-600" /> Admin Oversight Portal
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition"
                >
                  Join Vestiq
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="grid gap-1 font-medium text-slate-700 text-base">
            <Link
              href="/explore"
              className="px-3 py-2 rounded-md hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Opportunities
            </Link>
            <Link
              href="/how-it-works"
              className="px-3 py-2 rounded-md hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/for-investors"
              className="px-3 py-2 rounded-md hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Investors
            </Link>
            <Link
              href="/for-businesses"
              className="px-3 py-2 rounded-md hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Businesses
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 rounded-md hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/faq"
              className="px-3 py-2 rounded-md hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs font-semibold uppercase text-slate-400 mb-2">Switch Demo Persona</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  handleQuickDemoLogin('INVESTOR');
                  setMobileMenuOpen(false);
                }}
                className="py-1.5 text-xs font-medium rounded border border-slate-200 bg-slate-50 text-slate-700 text-center"
              >
                Investor
              </button>
              <button
                onClick={() => {
                  handleQuickDemoLogin('BUSINESS');
                  setMobileMenuOpen(false);
                }}
                className="py-1.5 text-xs font-medium rounded border border-slate-200 bg-slate-50 text-slate-700 text-center"
              >
                Startup
              </button>
              <button
                onClick={() => {
                  handleQuickDemoLogin('ADMIN');
                  setMobileMenuOpen(false);
                }}
                className="py-1.5 text-xs font-medium rounded border border-amber-200 bg-amber-50 text-amber-800 text-center"
              >
                Admin
              </button>
            </div>
          </div>

          {user ? (
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="text-sm font-semibold text-slate-800">
                {user.name} ({user.role})
              </div>
              {user.role === 'INVESTOR' && (
                <Link
                  href="/dashboard/investor"
                  className="block px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Investor Dashboard
                </Link>
              )}
              {user.role === 'BUSINESS' && (
                <Link
                  href="/dashboard/business"
                  className="block px-3 py-2 text-sm text-emerald-600 bg-emerald-50 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Business Dashboard
                </Link>
              )}
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 text-sm text-amber-700 bg-amber-50 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Portal
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 flex gap-2">
              <Link
                href="/login"
                className="flex-1 py-2 text-center text-sm font-medium border border-slate-300 rounded-lg text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="flex-1 py-2 text-center text-sm font-medium bg-blue-600 text-white rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Vestiq
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
