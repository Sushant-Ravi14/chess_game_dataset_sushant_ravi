import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { BookOpen } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Analytics = () => {
  const [growthData, setGrowthData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [openingsData, setOpeningsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [growthRes, hourlyRes, openingsRes] = await Promise.all([
          api.get('/analytics/player-growth'),
          api.get('/analytics/hourly-activity'),
          api.get('/analytics/opening-success-rates')
        ]);
        
        // Transform player growth data
        const rawGrowth = growthRes.data.data || growthRes.data;
        if (Array.isArray(rawGrowth)) {
          setGrowthData(rawGrowth.map(d => ({
            name: d._id || d.month || d.date || 'Unknown', 
            players: d.count || d.players || d.activePlayersCount || 0
          })));
        }

        // Transform hourly data
        const rawHourly = hourlyRes.data.data || hourlyRes.data;
        if (Array.isArray(rawHourly)) {
          setHourlyData(rawHourly.map(d => ({
            name: `${d.hour}:00`,
            matches: d.count
          })));
        }

        // Transform openings data
        const rawOpenings = openingsRes.data.data || openingsRes.data;
        if (Array.isArray(rawOpenings)) {
          setOpeningsData(rawOpenings);
        }
      } catch (error) {
        console.error('Failed to fetch analytics', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <Helmet>
        <title>Openings Theory | ChessAnalytics</title>
      </Helmet>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-100 dark:bg-slate-800 animate-pulse h-80 rounded-2xl"></div>
          <div className="bg-slate-100 dark:bg-slate-800 animate-pulse h-80 rounded-2xl"></div>
          <div className="bg-slate-100 dark:bg-slate-800 animate-pulse h-96 rounded-2xl md:col-span-1 lg:col-span-2"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Openings Theory Table */}
          <div className="md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Openings Theory</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">  </p>
            
            <div className="bg-white dark:bg-[#111420] rounded-[24px] border border-slate-200 dark:border-[#1a1f33] overflow-hidden">
              <div className="grid grid-cols-12 px-8 py-5 border-b border-slate-200 dark:border-[#1a1f33]">
                <div className="col-span-2 text-xs font-bold text-blue-500 tracking-wider">RANK</div>
                <div className="col-span-7 text-xs font-bold text-blue-500 tracking-wider">OPENING NAME</div>
                <div className="col-span-3 text-xs font-bold text-blue-500 tracking-wider text-right">TOTAL MATCHES</div>
              </div>
              
              <div className="divide-y divide-slate-200 dark:divide-[#1a1f33]">
                {openingsData.length > 0 ? (
                  openingsData.map((opening, index) => (
                    <div key={index} className="grid grid-cols-12 px-8 py-5 hover:bg-slate-50 dark:bg-[#161a28] transition-colors items-center">
                      <div className="col-span-2 text-slate-900 dark:text-white font-bold">#{index + 1}</div>
                      <div className="col-span-7 text-slate-900 dark:text-white font-medium">{opening.name || 'Unknown Opening'}</div>
                      <div className="col-span-3 text-blue-500 font-bold text-right">{opening.totalGames}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-8 py-10 text-center text-slate-500">No openings data available</div>
                )}
              </div>
            </div>
          </div>

          {/* Player Growth Chart */}
          <div className="bg-white dark:bg-[#111420] p-6 rounded-[24px] shadow-sm border border-slate-200 dark:border-[#1a1f33]">
            <div className="h-72 w-full">
              {growthData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1f33" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#161a28', border: '1px solid #1a1f33', borderRadius: '8px', color: '#f8fafc' }}
                    />
                    <Area type="monotone" dataKey="players" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPlayers)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">No data available</div>
              )}
            </div>
          </div>

          {/* Hourly Activity Chart */}
          <div className="bg-white dark:bg-[#111420] p-6 rounded-[24px] shadow-sm border border-slate-200 dark:border-[#1a1f33]">
            <div className="h-72 w-full">
              {hourlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1f33" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#161a28', border: '1px solid #1a1f33', borderRadius: '8px', color: '#f8fafc' }}
                    />
                    <Line type="monotone" dataKey="matches" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">No data available</div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Analytics;
