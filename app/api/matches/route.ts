import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const API_TOKEN = '6d431e89cefa47388ddd65c3b4bdd5aa';

    try {
        // الكود اللي أنت بتثق فيه وبجيب نتائج فعلاً
        const url = `https://api.football-data.org/v4/matches?date=${date}`;
        
        const res = await fetch(url, {
            headers: { 'X-Auth-Token': API_TOKEN },
            next: { revalidate: 0 } // لضمان وصول النتائج الحية (Live Scores)
        });

        const data = await res.json();
        
        // طباعة في السيرفر للتأكد
        console.log(`Date Requested: ${date} | Matches Found: ${data.matches?.length || 0}`);

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ matches: [] }, { status: 500 });
    }
}