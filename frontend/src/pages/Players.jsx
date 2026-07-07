import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Shield } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Users = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlayers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/players', {
        params: { limit: 50, search: search || undefined }
      });
      const data = response.data.data || response.data;
      setPlayers(data);
      setTotalCount(response.data.meta?.total || data.length || 0);
    } catch (error) {
      console.error('Failed to fetch players', error);
      toast.error('Failed to fetch players');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Top Players | ChessAnalytics</title>
      </Helmet>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Top Players </h1>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#161a28] border border-slate-200 dark:border-[#1a1f33] rounded-xl text-slate-700 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200 dark:border-[#1a1f33] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1a1f33] bg-slate-50 dark:bg-[#161a28]/50">
                <th className="py-4 px-6 text-xs font-black tracking-widest text-blue-500 uppercase">ID</th>
                <th className="py-4 px-6 text-xs font-black tracking-widest text-blue-500 uppercase">Grandmaster Name</th>
                <th className="py-4 px-6 text-xs font-black tracking-widest text-blue-500 uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#1a1f33]">
              {loading ? (
                // Loading Skeleton
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="h-4 bg-slate-100 dark:bg-[#1a1f33] rounded w-12"></div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-[#1a1f33] rounded-full"></div>
                        <div className="h-4 bg-slate-100 dark:bg-[#1a1f33] rounded w-32"></div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="h-6 bg-slate-100 dark:bg-[#1a1f33] rounded-full w-20 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : players.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-12 text-center text-slate-500 dark:text-slate-400">
                    No players found matching "{search}"
                  </td>
                </tr>
              ) : (
                players.map((player, index) => (
                  <tr key={player.username} className="hover:bg-slate-50 dark:bg-[#161a28] transition-colors group">
                    <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                      #{String(index + 1).padStart(3, '0')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-b from-[#93C5FD] to-[#3B82F6] text-white font-black text-sm shadow-[0_0_10px_rgba(59, 130, 246,0.2)] shrink-0">
                          {player.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-900 dark:text-white font-bold">{player.username}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-wider">
                        <Shield size={12} className="text-emerald-400" />
                        ACTIVE
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
