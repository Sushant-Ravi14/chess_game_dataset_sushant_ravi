import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, CheckCircle2, MinusCircle, TrendingUp, ChevronDown, ChevronLeft, ChevronRight, Database } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Matches = () => {
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState({ label: 'All Matches', value: {} });
  const filterRef = useRef(null);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchAllMatches();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, activeFilter]);

  // Click outside filter menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAllMatches = async () => {
    setLoading(true);
    try {
      // Fetching all data at once (using a very large limit)
      const params = { 
        limit: 25000, 
        search: search || undefined,
        ...activeFilter.value
      };

      const response = await api.get('/matches', { params });
      const data = response.data.data || response.data;
      
      setAllMatches(data.matches || data.docs || data);
    } catch (error) {
      console.error('Failed to fetch matches', error);
      toast.error('Failed to load matches data');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(allMatches.length / rowsPerPage);
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const filterOptions = [
    { label: 'All Matches', value: {} },
    { type: 'header', label: '-- Filters --' },
    { label: 'Rated Only', value: { rated: 'true' } },
    { label: 'Unrated Only', value: { rated: 'false' } },
    { label: 'White Wins', value: { winner: 'white' } },
    { label: 'Black Wins', value: { winner: 'black' } },
    { label: 'Checkmates', value: { victory_status: 'mate' } },
    { type: 'header', label: '-- Sort By --' },
    { label: 'Longest Matches', value: { sort: '-turns' } },
    { label: 'Shortest Matches', value: { sort: 'turns' } },
    { label: 'Highest Rated', value: { sort: '-white_rating' } }
  ];

  const handleSelectFilter = (option) => {
    if (option.type === 'header') return;
    setActiveFilter(option);
    setFilterMenuOpen(false);
  };

  // Client-side pagination slicing
  const displayedMatches = allMatches.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalCount = allMatches.length;

  return (
    <div className="space-y-8 pb-10">
      <Helmet>
        <title>Matches | ChessAnalytics</title>
      </Helmet>
      
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2 border-b border-slate-200 dark:border-[#1a1f33] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Matches</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 relative">
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-xs font-bold text-slate-500 tracking-wider">ALL FIELDS</span>
            </div>
            <div className="absolute inset-y-0 left-24 pl-2 flex items-center pointer-events-none border-l border-slate-200 dark:border-[#1a1f33]">
              <Search className="h-4 w-4 text-slate-500 dark:text-slate-400 ml-2" />
            </div>
            <input
              type="text"
              className="w-full sm:w-80 pl-36 pr-4 py-2.5 bg-white dark:bg-[#111420] border border-slate-200 dark:border-[#1a1f33] rounded-2xl text-slate-700 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-inner"
              placeholder="Search matches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative w-full sm:w-auto" ref={filterRef}>
            <button 
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="w-full sm:w-48 flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#111420] hover:bg-slate-100 dark:bg-[#1a1f33] border border-blue-500/30 rounded-full text-slate-900 dark:text-white text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {activeFilter.label}
              <ChevronDown size={16} className={`text-slate-500 dark:text-slate-400 transition-transform ${filterMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {filterMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-50 dark:bg-[#161a28] border border-slate-200 dark:border-[#1a1f33] rounded-xl shadow-xl overflow-hidden z-50">
                <div className="py-2">
                  {filterOptions.map((opt, i) => (
                    opt.type === 'header' ? (
                      <div key={i} className="px-4 py-1.5 text-xs font-bold text-blue-500 text-center mt-1 bg-slate-100 dark:bg-[#1a1f33]/30">
                        {opt.label}
                      </div>
                    ) : (
                      <button
                        key={i}
                        onClick={() => handleSelectFilter(opt)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          activeFilter.label === opt.label 
                            ? 'bg-blue-500 text-white' 
                            : 'text-slate-300 hover:bg-slate-100 dark:bg-[#1a1f33] hover:text-slate-900 dark:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#111420] rounded-2xl border border-slate-200 dark:border-[#1a1f33] h-64 animate-pulse"></div>
          ))}
        </div>
      ) : displayedMatches.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-slate-600 mb-4 flex justify-center"><Database size={48} /></div>
          <h3 className="text-xl font-bold text-slate-300">No matches found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedMatches.map((match) => {
            const isWhiteWin = match.winner === 'white';
            const isBlackWin = match.winner === 'black';
            const isDraw = match.winner === 'draw';
            
            // Upset Logic (100+ rating diff win)
            const whiteRating = parseInt(match.white_rating) || 0;
            const blackRating = parseInt(match.black_rating) || 0;
            const isWhiteUpset = isWhiteWin && (whiteRating < blackRating - 100);
            const isBlackUpset = isBlackWin && (blackRating < whiteRating - 100);
            const isUpset = isWhiteUpset || isBlackUpset;
            
            const isMate = match.victory_status?.toLowerCase() === 'mate';

            return (
              <div 
                key={match._id || match.id} 
                className="group relative bg-white dark:bg-[#111420] rounded-[24px] border border-slate-200 dark:border-[#1a1f33] overflow-hidden flex flex-col"
              >
                {/* Top Status Bar */}
                <div className={`px-5 py-3 flex items-center justify-between ${
                  isWhiteWin || isBlackWin ? 'bg-emerald-50 dark:bg-[#0f291e]' : 'bg-slate-50 dark:bg-[#1a1c23]'
                }`}>
                  <div className={`flex items-center gap-2 text-xs font-bold tracking-wider ${
                    isWhiteWin || isBlackWin ? 'text-emerald-700 dark:text-[#34d399]' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {isWhiteWin || isBlackWin ? <CheckCircle2 size={14} className="text-emerald-600 dark:text-[#34d399]" /> : <MinusCircle size={14} />}
                    {isWhiteWin ? 'WHITE WON' : isBlackWin ? 'BLACK WON' : 'DRAW'}
                  </div>
                  
                  {isUpset && (
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/50 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
                      <TrendingUp size={12} /> UPSET
                    </div>
                  )}
                  {!isUpset && isMate && (
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-blue-500/50 text-blue-500 text-[10px] font-bold tracking-widest uppercase">
                      MATE
                    </div>
                  )}
                </div>

                {/* Match Center Content */}
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <div className="flex items-center justify-between relative">
                    {/* White Player */}
                    <div className="flex flex-col items-center w-1/3">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 dark:border-transparent text-slate-900 dark:text-[#111420] flex items-center justify-center text-2xl font-black mb-3 shadow-lg">
                        W
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate w-full text-center">{match.white_id}</span>
                      <span className="text-xs text-slate-500 font-medium mt-1">{whiteRating}</span>
                    </div>

                    {/* VS Info */}
                    <div className="flex flex-col items-center justify-center w-1/3 z-10">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest mb-2 uppercase">
                        {match.victory_status === 'outoftime' ? 'TIMEOUT' : match.victory_status || 'UNKNOWN'}
                      </span>
                      <div className="bg-blue-500 text-white text-xs font-black px-2 py-1 rounded shadow-[0_0_10px_rgba(59, 130, 246,0.3)] tracking-widest">
                        VS
                      </div>
                      <span className="text-[10px] font-medium text-slate-500 mt-2 tracking-widest">
                        {match.turns} TURNS
                      </span>
                    </div>

                    {/* Black Player */}
                    <div className="flex flex-col items-center w-1/3">
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-[#1a1f33] border border-slate-200 dark:border-[#2a304d] text-slate-900 dark:text-white flex items-center justify-center text-2xl font-black mb-3 shadow-lg">
                        B
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate w-full text-center">{match.black_id}</span>
                      <span className="text-xs text-slate-500 font-medium mt-1">{blackRating}</span>
                    </div>
                  </div>
                </div>

                {/* Opening Info */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-[#1a1f33]">
                  <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">OPENING</div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {match.opening_name || 'Unknown Opening'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-4 bg-white dark:bg-[#111420] border border-slate-200 dark:border-[#1a1f33] rounded-2xl px-2 py-1 shadow-lg">
            <button 
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white disabled:opacity-30 disabled:hover:text-slate-500 dark:text-slate-400 transition-colors rounded-xl hover:bg-slate-100 dark:bg-[#1a1f33]"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 py-2 text-sm font-medium">
              <span className="text-slate-900 dark:text-white">Page {page}</span>
              <span className="text-slate-500 mx-1.5">of</span>
              <span className="text-slate-500 dark:text-slate-400">{Math.ceil(totalCount / rowsPerPage)}</span>
            </div>
            <button 
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= Math.ceil(totalCount / rowsPerPage)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white disabled:opacity-30 disabled:hover:text-slate-500 dark:text-slate-400 transition-colors rounded-xl hover:bg-slate-100 dark:bg-[#1a1f33]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
