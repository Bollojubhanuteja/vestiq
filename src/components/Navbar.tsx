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
  HelpCircle,
  Bell,
  CheckCircle2,
  FileText,
  BadgePercent,
  TrendingUp,
  Percent
} from 'lucide-react';

interface CurrentUser {
  userId: string;
  email: string;
  role: 'INVESTOR' | 'BUSINESS' | 'ADMIN';
  name: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user) {
          fetchNotifications();
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
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

  const handleMarkNotificationsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleQuickDemoLogin = async (role: 'INVESTOR' | 'BUSINESS_FIXED' | 'BUSINESS_EQUITY' | 'ADMIN') => {
    let email = 'investor@vestiq.com';
    let password = 'Investor@2026!';

    if (role === 'ADMIN') {
      email = 'vestiq21@gmail.com';
      password = 'Vestiq@Launch2026!';
    } else if (role === 'BUSINESS_FIXED') {
      email = 'founder@zenithclean.demo';
      password = 'Vestiq@Launch2026!';
    } else if (role === 'BUSINESS_EQUITY') {
      email = 'founder@auramed.demo';
      password = 'Vestiq@Launch2026!';
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        await fetchSession();
        if (role === 'INVESTOR') router.push('/dashboard/investor');
        else if (role === 'BUSINESS_FIXED' || role === 'BUSINESS_EQUITY') router.push('/dashboard/business');
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
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-7">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-blue-700 transition">
                V
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">VESTIQ</span>
                <span className="block text-[10px] tracking-wider uppercase font-semibold text-slate-500 -mt-1">
                  B2B Investment Platform
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
                href="/investment-models"
                className={`px-3 py-2 rounded-md hover:text-blue-600 hover:bg-slate-50 transition flex items-center gap-1 ${
                  pathname === '/investment-models' ? 'text-blue-600 bg-blue-50/50 font-semibold' : ''
                }`}
              >
                <Percent className="w-3.5 h-3.5 text-emerald-600" />
                Investment Models
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
                Raise Capital
              </Link>
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Demo Switcher Pill */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80 text-xs">
              <span className="px-1.5 font-medium text-slate-500">Quick Test:</span>
              <button
                onClick={() => handleQuickDemoLogin('INVESTOR')}
                className={`px-2 py-1 rounded transition font-medium ${
                  user?.role === 'INVESTOR' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                }`}
                title="Log in as Demo Institutional Investor (Vikramaditya)"
              >
                Investor
              </button>
              <button
                onClick={() => handleQuickDemoLogin('BUSINESS_FIXED')}
                className={`px-2 py-1 rounded transition font-medium ${
                  user?.role === 'BUSINESS' && user?.email.includes('zenith') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                }`}
                title="Log in as Fixed Return Business Founder (Zenith CleanEnergy)"
              >
                Fixed Return
              </button>
              <button
                onClick={() => handleQuickDemoLogin('BUSINESS_EQUITY')}
                className={`px-2 py-1 rounded transition font-medium ${
                  user?.role === 'BUSINESS' && user?.email.includes('auramed') ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                }`}
                title="Log in as Equity Business Founder (AuraMed Diagnostics)"
              >
                Equity
              </button>
              <button
                onClick={() => handleQuickDemoLogin('ADMIN')}
                className={`px-2 py-1 rounded transition font-medium ${
                  user?.role === 'ADMIN' ? 'bg-amber-600 text-white' : 'hover:bg-slate-200 text-slate-700'
                }`}
                title="Log in as Platform Admin (Bhanu Teja)"
              >
                Admin
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      if (!notificationsOpen && unreadCount > 0) {
                        handleMarkNotificationsRead();
                      }
                    }}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 relative text-slate-600"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Notifications & Diligence Alerts</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkNotificationsRead}
                            className="text-[11px] text-blue-600 hover:underline font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <Link
                              key={n.id}
                              href={n.link || '#'}
                              onClick={() => setNotificationsOpen(false)}
                              className={`block px-4 py-2.5 text-xs hover:bg-slate-50 transition ${
                                !n.isRead ? 'bg-blue-50/40 font-medium' : ''
                              }`}
                            >
                              <div className="font-semibold text-slate-900">{n.title}</div>
                              <div className="text-slate-600 line-clamp-2 mt-0.5">{n.message}</div>
                              <div className="text-[10px] text-slate-400 mt-1">
                                {new Date(n.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
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
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
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
                            href="/dashboard/investor/requests"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <Send className="w-4 h-4 text-emerald-500" /> Diligence &amp; Interests
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
                            <Scale className="w-4 h-4 text-blue-500" /> Deal Comparison
                          </Link>
                          <Link
                            href="/dashboard/investor/preferences"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <Sparkles className="w-4 h-4 text-indigo-500" /> Investment Criteria
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
                            <Briefcase className="w-4 h-4 text-emerald-500" /> Founder Dashboard
                          </Link>
                          <Link
                            href="/dashboard/business/opportunity"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <Layers className="w-4 h-4 text-emerald-500" /> Funding Campaign
                          </Link>
                          <Link
                            href="/dashboard/business/requests"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <FileText className="w-4 h-4 text-blue-500" /> Investor Interests &amp; Agreements
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
              href="/investment-models"
              className="px-3 py-2 rounded-md hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Percent className="w-4 h-4" />
              Investment Models (Fixed Return vs Equity)
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
              Raise Capital
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 rounded-md hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-2">Quick Test Switcher:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  handleQuickDemoLogin('INVESTOR');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded bg-slate-100 font-medium text-slate-700 text-center"
              >
                Investor (Vikram)
              </button>
              <button
                onClick={() => {
                  handleQuickDemoLogin('BUSINESS_FIXED');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded bg-emerald-50 text-emerald-800 font-medium text-center"
              >
                Fixed Return (Zenith)
              </button>
              <button
                onClick={() => {
                  handleQuickDemoLogin('BUSINESS_EQUITY');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded bg-indigo-50 text-indigo-800 font-medium text-center"
              >
                Equity (AuraMed)
              </button>
              <button
                onClick={() => {
                  handleQuickDemoLogin('ADMIN');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded bg-amber-50 text-amber-800 font-medium text-center"
              >
                Admin (Bhanu Teja)
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            {user ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-500">
                  Logged in as <strong className="text-slate-800">{user.email}</strong> ({user.role})
                </div>
                {user.role === 'INVESTOR' && (
                  <Link
                    href="/dashboard/investor"
                    className="block text-sm font-semibold text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Go to Investor Dashboard →
                  </Link>
                )}
                {user.role === 'BUSINESS' && (
                  <Link
                    href="/dashboard/business"
                    className="block text-sm font-semibold text-emerald-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Go to Business Dashboard →
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="block text-sm font-semibold text-amber-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Go to Admin Portal →
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 py-2 px-3 text-xs text-rose-600 border border-rose-200 rounded-lg text-center"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="py-2.5 rounded-lg border border-slate-200 text-center text-sm font-medium text-slate-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="py-2.5 rounded-lg bg-blue-600 text-center text-sm font-medium text-white shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Vestiq
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
