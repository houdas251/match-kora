"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface StandingsProps {
    leagueId: any;
    homeTeamId?: number;
    awayTeamId?: number;
    lang: "ar" | "fr";
}

export default function StandingsFetch({ leagueId, homeTeamId, awayTeamId }: StandingsProps) {
    const [standings, setStandings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStandings = async () => {
            try {
                const res = await axios.get(`/api/standings?leagueId=${leagueId}`);
                setStandings(res.data.table || []);
            } catch (err) { 
                console.error("Standings Fetch Error:", err); 
            } finally { 
                setLoading(false); 
            }
        };
        if (leagueId) getStandings();
    }, [leagueId]);

    if (loading) return <div className="p-10 text-center animate-pulse text-zinc-700 text-[10px] font-black uppercase">Loading...</div>;

    return (
        <div className="bg-zinc-900/20 border border-white/5 rounded-[30px] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                        <tr className="text-zinc-500 text-[10px] uppercase font-black border-b border-white/5">
                            <th className="px-6 py-4">Pos</th>
                            <th className="px-4 py-4">Team</th>
                            <th className="px-4 py-4">P</th>
                            <th className="px-6 py-4">Pts</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-bold">
                        {standings.map((item: any) => {
                            const isCurrentMatch = item.team.id === homeTeamId || item.team.id === awayTeamId;
                            return (
                                <tr key={item.team.id} className={`border-b border-white/5 transition-colors ${isCurrentMatch ? 'bg-yellow-500/10' : 'hover:bg-white/5'}`}>
                                    <td className={`px-6 py-4 ${isCurrentMatch ? 'text-yellow-500' : 'text-zinc-500'}`}>{item.position}</td>
                                    <td className="px-4 py-4">
                                        <Link href={`/team/${item.team.id}`}>
                                            <div className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-8 h-8 rounded-lg bg-white/5 p-1.5 border ${isCurrentMatch ? 'border-yellow-500/50' : 'border-white/5'}`}>
                                                    <img src={item.team.crest} className="w-full h-full object-contain" alt={item.team.name} />
                                                </div>
                                                <span className={`${isCurrentMatch ? 'text-yellow-500' : 'text-zinc-300 group-hover:text-yellow-500'} transition-colors`}>
                                                    {item.team.shortName || item.team.name}
                                                </span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-4 py-4 text-zinc-400">{item.playedGames}</td>
                                    <td className={`px-6 py-4 font-black ${isCurrentMatch ? 'text-yellow-500' : 'text-white'}`}>{item.points}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}