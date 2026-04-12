import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const API_TOKEN = '6d431e89cefa47388ddd65c3b4bdd5aa';

    try {
        const url = `https://api.football-data.org/v4/matches/${id}`;
        const res = await fetch(url, {
            headers: { 'X-Auth-Token': API_TOKEN },
            next: { revalidate: 10 } // تحديث سريع كل 10 ثواني
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch details" }, { status: 500 });
    }
}