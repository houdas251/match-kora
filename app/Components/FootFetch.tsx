"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface FootFetchProps {
    date: string;
    darkmode: boolean; 
    lang: 'ar' | 'fr';
}

// القائمة المحدثة (شيلنا Championship وخلينا الصفوة بس)
const PRIORITY_LEAGUES = [
    'Premier League',           // الدوري الإنجليزي الممتاز
    'UEFA Champions League',
    'Primera Division',    // دوري أبطال أوروبا
    'La Liga',                  // الدوري الإسباني
    'Bundesliga',               // الدوري الألماني
    'Serie A',                  // الدوري الإيطالي
    'Ligue 1',                  // الدوري الفرنسي
    'Egyptian Premier League'   // الدوري المصري
];

export default function FootFetch({ date, darkmode, lang }: FootFetchProps) {
    const [groupedMatches, setGroupedMatches] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const formatMatchTime = (utcDate: string) => {
        const dateObj = new Date(utcDate);
        return dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const fetchMatches = async () => {
        if (Object.keys(groupedMatches).length === 0) setLoading(true);
        setErrorMsg(null);
        try {
            const res = await axios.get(`/api/matches?date=${date}`);
            if (res.data.error) {
                setErrorMsg(res.data.error);
            } else if (res.data.matches && res.data.matches.length > 0) {
                const groups = res.data.matches.reduce((acc: any, match: any) => {
                    const leagueName = match.competition.name;
                    if (!acc[leagueName]) acc[leagueName] = [];
                    acc[leagueName].push(match);
                    return acc;
                }, {});
                setGroupedMatches(groups);
            } else {
                setGroupedMatches({});
            }
        } catch (err: any) {
            setErrorMsg("Connection to server failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
        const interval = setInterval(fetchMatches, 60000);
        return () => clearInterval(interval);
    }, [date]);

    const translateStatus = (status: string) => {
        const translations: { [key: string]: { ar: string, fr: string } } = {
            'LIVE': { ar: 'مباشر', fr: 'EN DIRECT' },
            'IN_PLAY': { ar: 'مباشر', fr: 'EN DIRECT' },
            'FINISHED': { ar: 'انتهت', fr: 'TERMINÉ' },
            'FT': { ar: 'انتهت', fr: 'TERMINÉ' },
            'PAUSED': { ar: 'استراحة', fr: 'MI-TEMPS' },
            'TIMED': { ar: 'لم تبدأ', fr: 'PROGRAMMÉ' },
            'SCHEDULED': { ar: 'لم تبدأ', fr: 'PROGRAMMÉ' },
            'POSTPONED': { ar: 'مؤجلة', fr: 'REPORTÉ' }
        };
        return translations[status] ? translations[status][lang] : status;
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center p-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            <p className="text-yellow-500 font-black animate-pulse">Fetching Live Data...</p>
        </div>
    );

    if (errorMsg) return (
        <div className={`text-center p-10 border rounded-[40px] mx-4 ${darkmode ? 'border-red-500/30 bg-red-500/5' : 'border-red-600 bg-red-100'}`}>
            <p className="text-red-500 font-bold italic">{errorMsg}</p>
            <button onClick={() => fetchMatches()} className="mt-4 text-xs bg-red-500/20 px-4 py-2 rounded-full hover:bg-red-500/40 transition-all">Retry Now</button>
        </div>
    );

    // ترتيب الدوريات: الأولويات أولاً
    const leagues = Object.keys(groupedMatches).sort((a, b) => {
        const indexA = PRIORITY_LEAGUES.indexOf(a);
        const indexB = PRIORITY_LEAGUES.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    if (leagues.length === 0) return (
        <div className={`text-center p-20 text-xl font-black italic border rounded-[40px] ${darkmode ? 'text-zinc-600 border-white/5' : 'text-black border-black/20 bg-white'}`}>
            No matches scheduled for {date}
        </div>
    );

    return (
        <div className="space-y-10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {leagues.map((league) => (
                <div key={league} className={`rounded-[35px] border overflow-hidden shadow-2xl transition-all ${
                    darkmode ? "bg-zinc-900/40 border-white/5" : "bg-white border-black/10"
                }`}>
                    
                    {/* LEAGUE HEADER */}
                    <div className={`px-8 py-5 flex items-center justify-between border-b ${
                        darkmode ? "bg-white/5 border-white/5" : "bg-zinc-100 border-black/10"
                    }`}>
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-5 bg-yellow-500 rounded-full shadow-[0_0_10px_#eab308]"></div>
                            <h2 className={`text-base font-black italic tracking-widest uppercase ${
                                darkmode ? "text-white" : "text-black"
                            }`}>
                                {league}
                            </h2>
                        </div>
                        {groupedMatches[league][0].competition.emblem && (
                            <img src={groupedMatches[league][0].competition.emblem} alt="league badge" className="w-8 h-8 object-contain" />
                        )}
                    </div>

                    {/* MATCHES LIST */}
                    <div className={`divide-y ${darkmode ? "divide-white/[0.03]" : "divide-black/[0.05]"}`}>
                        {groupedMatches[league].map((m: any) => (
                            <Link 
                                href={`/match/${m.id}?lang=${lang}&mode=${darkmode ? 'dark' : 'light'}`}
                                key={m.id}
                                className={`flex flex-row items-center justify-between p-5 md:p-7 transition-all group relative ${
                                    darkmode ? "hover:bg-white/5" : "hover:bg-zinc-50"
                                }`}
                            >
                                {/* HOME TEAM */}
                                <div className="flex-1 flex flex-col md:flex-row items-center gap-2 md:gap-4 overflow-hidden text-center md:text-left">
                                    <div className={`w-10 h-10 md:w-16 md:h-16 flex-shrink-0 rounded-xl p-1.5 flex items-center justify-center border transition-all ${
                                        darkmode ? "bg-white/[0.03] border-white/5" : "bg-white border-black/10 shadow-sm"
                                    }`}>
                                        <img src={m.homeTeam.crest} alt={m.homeTeam.name} className="w-full h-full object-contain" loading="lazy" />
                                    </div>
                                    <span className={`text-[10px] md:text-lg font-black uppercase tracking-tight w-full md:w-auto ${
                                        darkmode ? "text-zinc-300 group-hover:text-white" : "text-black"
                                    }`}>
                                        {m.homeTeam.shortName || m.homeTeam.name}
                                    </span>
                                </div>
                                
                                {/* SCORE & STATUS */}
                                <div className="flex flex-col items-center gap-2 md:gap-3 px-2 min-w-[90px] md:min-w-[160px]">
                                    <div className={`px-3 py-1.5 md:px-6 md:py-3 rounded-2xl shadow-inner text-center border transition-all ${
                                        darkmode ? "bg-black border-yellow-500/10" : "bg-black border-black shadow-md"
                                    }`}>
                                        {m.status === 'TIMED' || m.status === 'SCHEDULED' ? (
                                            <span className="text-yellow-500 font-black text-[10px] md:text-lg tracking-tighter whitespace-nowrap">
                                                {formatMatchTime(m.utcDate)}
                                            </span>
                                        ) : (
                                            <div className="flex justify-center items-center gap-1.5 md:gap-4">
                                                <span className="text-white font-black text-lg md:text-3xl leading-none">
                                                    {m.score.fullTime.home ?? 0}
                                                </span>
                                                <span className="text-yellow-500/50 font-black text-sm md:text-xl">-</span>
                                                <span className="text-white font-black text-lg md:text-3xl leading-none">
                                                    {m.score.fullTime.away ?? 0}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* STATUS BADGE */}
                                    <div className="flex items-center justify-center min-h-[20px]">
                                        {m.status === 'IN_PLAY' || m.status === 'LIVE' ? (
                                            <span className="flex items-center gap-1.5 text-[9px] md:text-sm text-red-500 font-black animate-pulse uppercase tracking-wider bg-red-500/5 px-2.5 py-0.5 rounded-full border border-red-500/10">
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_red]"></span> 
                                                {translateStatus('LIVE')}
                                            </span>
                                        ) : m.status === 'FINISHED' || m.status === 'FT' ? (
                                            <span className={`text-[8px] md:text-sm font-black italic uppercase tracking-[0.1em] px-3 py-1 rounded-lg border ${
                                                darkmode ? "text-zinc-300 border-white/10 bg-white/5" : "text-zinc-700 border-black/5 bg-zinc-100"
                                            }`}>
                                                {translateStatus('FT')}
                                            </span>
                                        ) : (
                                            <span className="text-[8px] md:text-xs text-zinc-500 font-black uppercase tracking-widest">
                                                {translateStatus(m.status)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* AWAY TEAM */}
                                <div className="flex-1 flex flex-col md:flex-row-reverse items-center gap-2 md:gap-4 overflow-hidden text-center md:text-right">
                                    <div className={`w-10 h-10 md:w-16 md:h-16 flex-shrink-0 rounded-xl p-1.5 flex items-center justify-center border transition-all ${
                                        darkmode ? "bg-white/[0.03] border-white/5" : "bg-white border-black/10 shadow-sm"
                                    }`}>
                                        <img src={m.awayTeam.crest} alt={m.awayTeam.name} className="w-full h-full object-contain" loading="lazy" />
                                    </div>
                                    <span className={`text-[10px] md:text-lg font-black uppercase tracking-tight w-full md:w-auto ${
                                        darkmode ? "text-zinc-300 group-hover:text-white" : "text-black"
                                    }`}>
                                        {m.awayTeam.shortName || m.awayTeam.name}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}