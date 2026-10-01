'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Shield, ArrowLeft, RefreshCw, Clock } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 inline-block">
              &larr; Admin Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Audit Logs
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Immutable ledger of administrative decisions, verification badges, status updates, and weight modifications.
            </p>
          </div>

          <button
            onClick={fetchLogs}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading audit records...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-sm">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No audit entries found</h3>
            <p className="text-xs text-slate-500">
              Administrative changes will be recorded here automatically.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Admin</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Entity</th>
                    <th className="p-4">Previous Value</th>
                    <th className="p-4">New Committed Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="p-4 whitespace-nowrap text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-900 whitespace-nowrap">
                        {log.admin?.name || 'Administrator'}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {log.admin?.email}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                        {log.entityType} ({log.entityId.slice(0, 8)}...)
                      </td>
                      <td className="p-4 max-w-xs truncate text-[11px] font-mono text-slate-500">
                        {log.previousValue ? log.previousValue : 'None / Initial'}
                      </td>
                      <td className="p-4 max-w-xs truncate text-[11px] font-mono text-emerald-700 font-semibold">
                        {log.newValue ? log.newValue : 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
