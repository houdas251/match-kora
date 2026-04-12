"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation'; // أضفنا useSearchParams
import StandingsFetch from '../../Components/StandingsFetch';

// 1. قاموس الترجمة الخاص بالصفحة
const translations = {
    ar: {
        back: "← رجوع",
        liveStream: "بث مباشر",
        stats: "الإحصائيات ↗",
        lineup: "التشكيلة ↗",
        notFound: "المباراة غير موجودة",
        server: "سيرفر",
        status: {
            'FINISHED': 'انتهت',
            'FT': 'انتهت',
            'LIVE': 'مباشر',
            'IN_PLAY': 'مباشر',
            'TIMED': 'لم تبدأ',
            'SCHEDULED': 'لم تبدأ'
        }
    },
    fr: {
        back: "← RETOUR",
        liveStream: "EN DIRECT",
        stats: "STATS ↗",
        lineup: "COMPOSITION ↗",
        notFound: "Match Non Trouvé",
        server: "S",
        status: {
            'FINISHED': 'TERMINÉ',
            'FT': 'TERMINÉ',
            'LIVE': 'EN DIRECT',
            'IN_PLAY': 'EN DIRECT',
            'TIMED': 'PROGRAMMÉ',
            'SCHEDULED': 'PROGRAMMÉ'
        }
    }
};

export default function MatchDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // الحصول على اللغة من الـ URL (مثلاً ?lang=fr) أو افتراض العربي
    const lang = (searchParams.get('lang') as 'ar' | 'fr') || 'ar';
    const t = translations[lang];

    const [match, setMatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeServer, setActiveServer] = useState<string>("");

    // دالة ترجمة حالة المباراة
    const getTranslatedStatus = (status: string) => {
        return t.status[status as keyof typeof t.status] || status;
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`/api/match-details?id=${id}`);
                setMatch(res.data);
                setActiveServer(`https://v3.sportsonline.to/channels/hd/hd1.php`); 
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchDetails();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-black flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-500"></div>
        </div>
    );

    if (!match) return (
        <div className="bg-black min-h-screen text-white flex justify-center items-center font-black italic uppercase tracking-widest">
            {t.notFound}
        </div>
    );
// تأكد إن الدالة دي موجودة فوق الـ return
const openExternalSearch = (type: string) => {
    const query = type === "stats" 
        ? `${match.homeTeam.name} vs ${match.awayTeam.name} stats`
        : `${match.homeTeam.name} vs ${match.awayTeam.name} lineup`;
    
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
};
    return (
        <main 
            className="min-h-screen bg-[#050505] text-white p-4 md:p-10" 
            dir={lang === 'ar' ? 'rtl' : 'ltr'} // تغيير اتجاه الصفحة بناءً على اللغة
        >
            <div className="max-w-5xl mx-auto">
                
                {/* 1. Header */}
                <div className="flex justify-between items-center mb-6 md:mb-10">
                    <button 
                        onClick={() => router.back()} 
                        className="px-4 md:px-6 py-2 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase hover:bg-yellow-500 hover:text-black transition-all"
                    >
                        {t.back}
                    </button>
                    <div className={lang === 'ar' ? 'text-left' : 'text-right'}>
                        <span className="text-yellow-500 font-black italic text-[9px] md:text-[10px] uppercase tracking-widest block">
                            {match.competition?.name}
                        </span>
                        <span className="text-zinc-600 text-[7px] md:text-[8px] uppercase font-bold tracking-[0.2em]">
                            {match.area?.name}
                        </span>
                    </div>
                </div>

               
          {/* 2. Scoreboard */}
<div className="bg-zinc-900/30 rounded-[35px] md:rounded-[60px] p-6 md:p-10 border border-white/5 mb-8 md:mb-10 text-center relative overflow-hidden">
    {/* تأكد إن الـ grid مرتبة 1 - 2 - 3 */}
    <div className="grid grid-cols-3 items-center relative z-10 gap-2 md:gap-4">
        
        {/* 1. صاحب الأرض (Home) - دايماً مربوط بـ homeTeam */}
        <div className="flex flex-col items-center gap-2 md:gap-4">
            <img src={match.homeTeam.crest} className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain" alt="" />
            <h2 className="font-black text-[9px] sm:text-[11px] md:text-sm uppercase tracking-tighter leading-tight text-center">
                {match.homeTeam.name}
            </h2>
        </div>
        
        {/* 2. النتيجة (Score) - هنا القفلة الصح */}
        <div className="flex flex-col items-center">
            {/* إجبار الاتجاه يكون ltr للرقمين دول بس عشان الـ Home يفضل شمال الـ Away برمجياً */}
            <div 
                className="text-3xl sm:text-5xl md:text-8xl font-black italic flex items-center justify-center gap-2 md:gap-4 tracking-tighter" 
                style={{ direction: 'ltr' }} 
            >
                <span>{match.score?.fullTime?.away ?? 0}</span>
                <span className="text-zinc-800">:</span>
                <span>{match.score?.fullTime?.home ?? 0}</span>
            </div>
            
            <div className="mt-4 md:mt-6 bg-yellow-500 text-black px-3 md:px-6 py-1 rounded-full text-[7px] md:text-[9px] font-black uppercase whitespace-nowrap">
                {getTranslatedStatus(match.status)}
            </div>
        </div>

        {/* 3. الفريق الضيف (Away) - دايماً مربوط بـ awayTeam */}
        <div className="flex flex-col items-center gap-2 md:gap-4">
            <img src={match.awayTeam.crest} className="w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain" alt="" />
            <h2 className="font-black text-[9px] sm:text-[11px] md:text-sm uppercase tracking-tighter leading-tight text-center">
                {match.awayTeam.name}
            </h2>
        </div>
    </div>
</div>
                {/* 3. Navigation Tabs */}
                <div className="grid grid-cols-3 gap-2 md:flex md:justify-center md:gap-4 mb-8">
                    <button className="py-2.5 md:px-8 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase transition-all border bg-yellow-500 text-black border-yellow-500 shadow-lg">
                        {t.liveStream}
                    </button>
                    <button onClick={() => openExternalSearch("stats")} className="py-2.5 md:px-8 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase border bg-white/5 text-zinc-500 border-white/10 hover:border-yellow-500 hover:text-yellow-500 transition-all">
                        {t.stats}
                    </button>
                    <button onClick={() => openExternalSearch("lineup")} className="py-2.5 md:px-8 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase border bg-white/5 text-zinc-500 border-white/10 hover:border-yellow-500 hover:text-yellow-500 transition-all">
                        {t.lineup}
                    </button>
                </div>

                {/* 4. Stream Area */}
                <div className="mb-10 rounded-[30px] md:rounded-[45px] overflow-hidden bg-black border border-white/5 shadow-2xl relative">
                    <div className="bg-zinc-900/80 p-3 md:p-4 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 px-6 md:px-8">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                            <span className="text-[9px] md:text-[10px] font-black uppercase text-red-500 italic">{t.liveStream}</span>
                        </div>
                        <div className="flex gap-1.5 md:gap-2">
                            {[1, 2, 3, 4].map((num) => (
                                <button 
                                    key={num}
                                    onClick={() => setActiveServer(`https://v3.sportsonline.to/channels/hd/hd${num}.php`)} 
                                    className={`text-[8px] md:text-[9px] font-black uppercase px-3 md:px-4 py-1.5 rounded-lg md:rounded-xl transition-all ${activeServer.includes(`hd${num}`) ? 'bg-yellow-500 text-black' : 'bg-white/5 hover:bg-white/10'}`}
                                >
                                    {t.server}{num}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="aspect-video bg-zinc-900">
                        <iframe src={activeServer} className="w-full h-full border-0" allowFullScreen scrolling="no"></iframe>
                    </div>
                </div>

                {/* 5. Standings */}
                <div className="mt-8 md:mt-12 overflow-x-auto">
                    <StandingsFetch 
                        leagueId={match.competition?.id} 
                        homeTeamId={match.homeTeam?.id} 
                        awayTeamId={match.awayTeam?.id} 
                        lang={lang} // نمرر اللغة لمكون ترتيب الجدول أيضاً
                    />
                </div>
            </div>
        </main>
    );
}