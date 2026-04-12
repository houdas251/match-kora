import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get('leagueId');
    const API_TOKEN = '6d431e89cefa47388ddd65c3b4bdd5aa';

    if (!leagueId) {
        return NextResponse.json({ error: "League ID is required" }, { status: 400 });
    }

    try {
        // بنطلب ترتيب الدوري (Standings) بناءً على الـ ID اللي جاي من الصفحة
        const url = `https://api.football-data.org/v4/competitions/${leagueId}/standings`;
        
        const res = await fetch(url, {
            headers: { 'X-Auth-Token': API_TOKEN },
            next: { revalidate: 3600 } // الجدول مش بيتغير كل ثانية، فبنعمل كاش لمدة ساعة (3600 ثانية) لتوفير الـ API
        });

        const data = await res.json();

        // الـ API ده بيرجع مصفوفة اسمها standings، إحنا محتاجين أول جدول فيها (الترتيب العام)
        const table = data.standings?.[0]?.table || [];

        return NextResponse.json({ table });
    } catch (error) {
        console.error("Standings API Error:", error);
        return NextResponse.json({ error: "Failed to fetch standings" }, { status: 500 });
    }
}