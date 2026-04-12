"use client";
import React, { useState } from 'react';
import FootFetch from './Components/FootFetch';

// --- 1. الـ Abstraction بتاع اللغات (القاموس) ---
const translations = {
    ar: {
        yesterday: "مباريات الامس",
        today: "مباريات اليوم",
        tomorrow: "مباريات الغد",
        title: "ماتش",
        subtitle: "كورة",
        langBtn: "Français",
        modeLight: "الوضع الفاتح",
        modeDark: "الوضع الليلي"
    },
    fr: {
        yesterday: " MATCHES Hier",
        today: "MATCHES Aujourd'hui",
        tomorrow: " MATCHES Demain",
        title: "MATCH",
        subtitle: "KORA",
        langBtn: "العربية",
        modeLight: "Mode Clair",
        modeDark: "Mode Sombre"
    }
};

// --- 2. الـ Abstraction بتاع الأيقونات ---
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="ml-2">
        <circle cx={12} cy={12} r={4} /><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="ml-2">
        <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </svg>
);

export default function Home() {
    // States
    const [darkmode, setmode] = useState(true);
    const [lang, setLang] = useState<'ar' | 'fr'>('ar');

    // دالة تنسيق التاريخ بناءً على وقت جهاز المستخدم
    const getFormattedDate = (offset: number) => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        return d.toISOString().split('T')[0];
    };

    const [selectedDate, setSelectedDate] = useState(getFormattedDate(0));

    // استخراج النصوص والأيقونات بناءً على الحالة الحالية
    const t = translations[lang];
    const ModeIcon = darkmode ? SunIcon : MoonIcon;

    const dateTabs = [
        { label: t.yesterday, value: getFormattedDate(-1) },
        { label: t.today, value: getFormattedDate(0) },
        { label: t.tomorrow, value: getFormattedDate(1) },
    ];

    return (
        <main 
            className={`min-h-screen transition-all duration-500 ${darkmode ? "bg-black text-white" : 'bg-[#EFEFEF] text-[#000000]'}`} 
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
            {/* شريط التحكم (اللغة والمود) */}
            <div className='max-w-4xl mx-auto flex justify-between items-center p-6'>
                <button 
                    onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
                    className={`px-4 py-1.5 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                        darkmode ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black' : 'border-black text-black bg-white hover:bg-black hover:text-white'
                    }`}
                >
                    {t.langBtn}
                </button>

                <button 
                    onClick={() => setmode(!darkmode)} 
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-black transition-all ${
                        darkmode ? "bg-white/10 text-white hover:bg-white/20" : "bg-white border border-black text-black font-size-40 shadow-sm"
                    }`}
                >
                    <ModeIcon />
                    <span className="mr-2">{darkmode ? t.modeLight : t.modeDark}</span>
                </button>
            </div>

            {/* الهيدر */}
            <header className="p-10 text-center">
                <h1 className={`text-5xl font-black italic tracking-tighter uppercase ${!darkmode ? 'text-black' : ''}`}>
                    {t.title} <span className="text-yellow-500">{t.subtitle}</span>
                </h1>
            </header>

            {/* شريط الأيام (Tabs) */}
            <div className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
                darkmode ? "bg-black/80 border-white/5" : "bg-white/90 border-black"
            }`}>
                <div className="flex max-w-4xl mx-auto">
                    {dateTabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setSelectedDate(tab.value)}
                            className={`flex-1 py-6 text-sm font-black transition-all border-b-4 ${
                                selectedDate === tab.value 
                                ? 'border-yellow-500 text-yellow-500 bg-yellow-500/5' 
                                : `border-transparent ${darkmode ? "text-zinc-600 hover:text-zinc-400" : "text-[#000000] opacity-60 hover:opacity-100"}`
                            }`}
                        >
                            {tab.label}
                            <span className={`block text-[10px] mt-1 font-bold ${darkmode ? 'opacity-40' : 'text-[#000000] font-black'}`}>
                                {tab.value}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* عرض المباريات */}
            {/* ضفنا هنا كلاس يجبر أي نصوص داخلية تكون سوداء في وضع النهار */}
          <div className="max-w-4xl mx-auto p-4 md:p-10">
    {/* نمرر حالة المود للمكون المسؤول عن الماتشات */}
    <FootFetch date={selectedDate} darkmode={darkmode} lang={lang} />
</div>

        </main>
    );
}