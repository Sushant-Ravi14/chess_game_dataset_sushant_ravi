import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Users, Swords, TrendingUp, Trophy } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [colorData, setColorData] = useState([]);
  const [openingsData, setOpeningsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, colorRes, openingsRes] = await Promise.all([
          api.get('/stats'),
          api.get('/analytics/color-advantage'),
          api.get('/analytics/opening-success-rates')
        ]);

        setStats(statsRes.data.data || statsRes.data);

        const rawColor = colorRes.data.data || colorRes.data;
        if (rawColor) {
          setColorData([
            { name: 'White Wins', count: rawColor.white?.count || 0, color: '#3B82F6' },
            { name: 'Black Wins', count: rawColor.black?.count || 0, color: '#64748b' },
            { name: 'Draws', count: rawColor.draw?.count || 0, color: '#94a3b8' },
          ]);
        }

        const rawOpenings = openingsRes.data.data || openingsRes.data;
        if (Array.isArray(rawOpenings)) {
          setOpeningsData(rawOpenings.slice(0, 5));
        }

      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        toast.error('Failed to load overview statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalMatchesCount = colorData.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const whiteWinsValue = colorData.find(d => d.name === 'White Wins')?.count || 0;
  const whiteWinPercentage = Math.round((whiteWinsValue / totalMatchesCount) * 100) || 0;

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Overview | ChessAnalytics</title>
      </Helmet>

      {/* Header */}
      <div className="relative overflow-hidden mb-8 mt-2">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight relative z-10">Dashboard Overview</h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-[#111420] p-6 rounded-2xl border border-slate-200 dark:border-[#1a1f33] animate-pulse h-32"></div>
          ))
        ) : (
          <>
            <div className="bg-white dark:bg-[#111420] p-6 rounded-3xl border border-slate-200 dark:border-[#1a1f33] shadow-lg flex flex-col justify-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#1a1f33] flex items-center justify-center mb-4">
                <Swords className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider mb-1 uppercase">Total Matches</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalMatches?.toLocaleString() || 0}</h3>
            </div>

            <div className="bg-white dark:bg-[#111420] p-6 rounded-3xl border border-slate-200 dark:border-[#1a1f33] shadow-lg flex flex-col justify-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#1a1f33] flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider mb-1 uppercase">Unique Players</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalPlayers?.toLocaleString() || 0}</h3>
            </div>

            <div className="bg-white dark:bg-[#111420] p-6 rounded-3xl border border-slate-200 dark:border-[#1a1f33] shadow-lg flex flex-col justify-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#1a1f33] flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider mb-1 uppercase">Average Rating</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{Math.round(stats?.averageRating || 0).toLocaleString()}</h3>
            </div>

            <div className="bg-white dark:bg-[#111420] p-6 rounded-3xl border border-slate-200 dark:border-[#1a1f33] shadow-lg flex flex-col justify-center relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Trophy className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider mb-1 uppercase">White Win Rate</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats?.rates?.whiteWinRate ? Math.round(stats.rates.whiteWinRate) : 0}%
              </h3>
            </div>
          </>
        )}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* Win Rate Distribution */}
        <div className="bg-white dark:bg-[#111420] p-6 rounded-3xl border border-slate-200 dark:border-[#1a1f33] shadow-lg">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Win Rate Distribution</h2>
          <div className="h-64 w-full relative flex items-center justify-center">
            {loading ? (
              <div className="animate-pulse rounded-full bg-slate-100 dark:bg-[#1a1f33] w-48 h-48"></div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={colorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="count"
                      stroke="none"
                    >
                      {colorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1f33', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">White Wins</span>
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">{whiteWinPercentage}%</span>
                </div>
              </>
            )}
          </div>
          {/* Custom Legend */}
          {!loading && (
            <div className="flex justify-center gap-6 mt-4">
              {colorData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Openings */}
        <div className="bg-white dark:bg-[#111420] p-6 rounded-3xl border border-slate-200 dark:border-[#1a1f33] shadow-lg">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Top Openings</h2>
          <div className="space-y-4">
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-slate-100 dark:bg-[#1a1f33] rounded-lg animate-pulse"></div>)
            ) : openingsData.length > 0 ? (
              openingsData.map((opening, i) => {
                const maxGames = openingsData[0]?.totalGames || 1;
                const widthPercent = Math.max((opening.totalGames / maxGames) * 100, 10);
                // Top 2 openings get yellow background, others get slate
                const isTop = i < 2;
                return (
                  <div key={i} className="relative h-10 w-full rounded-lg overflow-hidden bg-slate-50 dark:bg-[#161a28]">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-lg transition-all duration-1000 ${isTop ? 'bg-blue-500' : 'bg-slate-500'}`}
                      style={{ width: `${widthPercent}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center px-4 justify-between z-10 pointer-events-none">
                      <span className="text-sm font-bold truncate pr-4 text-slate-900 dark:text-white">
                        {opening._id}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white/90">
                        {opening.totalGames.toLocaleString()} games
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-slate-500 py-10">No openings data available</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;
