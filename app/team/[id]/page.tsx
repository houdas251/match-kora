"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Globe, Hash, ExternalLink, Calendar } from 'lucide-react';

export default function TeamProfile() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const [team, setTeam] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // دالة سحرية لحساب العمر من تاريخ الميلاد
    const calculateAge = (birthDate: string) => {
        if (!birthDate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    useEffect(() => {
        if (!id) return;
        const fetchTeam = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await axios.get(`/api/team?id=${id}`);
                if (res.data) {
                    setTeam(res.data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Client Fetch Error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="animate-spin h-10 w-10 border-t-2 border-yellow-500 rounded-full"></div>
        </div>
    );

    if (error || !team) return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
            <div className="text-center border border-white/10 p-10 rounded-[40px] bg-zinc-900/50">
                <h2 className="text-xl font-black uppercase italic mb-4 text-red-500">Team Not Found</h2>
                <button onClick={() => window.location.reload()} className="bg-yellow-500 text-black px-8 py-3 rounded-2xl font-black text-xs">TRY AGAIN</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-10">
                
                {/* زر العودة */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-500 hover:text-yellow-500 transition-all group w-fit"
                >
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-yellow-500/10">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Standings</span>
                </button>

                <header className="flex flex-col items-center text-center space-y-6">
                    <div className="w-32 h-32 bg-white/5 p-6 rounded-[35px] border border-white/10 shadow-xl shadow-yellow-500/5">
                        <img src={team.crest} className="w-full h-full object-contain" alt={team.name} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">{team.name}</h1>
                </header>

                <div className="space-y-6">
                    <h2 className="text-xl font-black uppercase italic text-yellow-500 border-l-4 border-yellow-500 pl-4 tracking-widest">Squad List</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {team.squad?.map((player: any) => (
                            <div key={player.id} className="bg-zinc-900/40 border border-white/5 p-6 rounded-[35px] hover:border-yellow-500/40 transition-all group relative overflow-hidden">
                                
                                <div className="absolute -right-2 -bottom-6 text-7xl font-black text-white/[0.02] italic pointer-events-none">
                                    {player.shirtNumber || ''}
                                </div>

                                <div className="flex justify-between items-start mb-5">
                                    <span className="bg-yellow-500/10 text-yellow-500 text-[9px] font-black px-3 py-1.5 rounded-xl uppercase italic border border-yellow-500/20">
                                        {player.position || 'Player'}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        {/* عرض العمر هنا */}
                                        <div className="flex items-center gap-1 text-zinc-400">
                                            <Calendar size={12} className="text-zinc-600" />
                                            <span className="text-xs font-bold">{calculateAge(player.dateOfBirth)} Yrs</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <a 
                                        href={`https://www.google.com/search?q=${encodeURIComponent(player.name + ' ' + team.name + ' player')}&tbm=isch`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-lg font-bold group-hover:text-yellow-500 transition-colors uppercase italic hover:underline decoration-yellow-500/30"
                                    >
                                        {player.name}
                                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500" />
                                    </a>
                                </div>
                                
                                <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                    <Globe size={14} className="text-zinc-700" />
                                    <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">
                                        {player.nationality}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}