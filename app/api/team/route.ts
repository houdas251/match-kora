import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // استخدم نفس التوكن اللي شغال معاك في الـ routes التانية
    const API_TOKEN = '6d431e89cefa47388ddd65c3b4bdd5aa';

    if (!id) {
        return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    try {
        const url = `https://api.football-data.org/v4/teams/${id}`;
        
        const res = await fetch(url, {
            headers: { 'X-Auth-Token': API_TOKEN },
            next: { revalidate: 3600 } 
        });

        const data = await res.json();

        if (!res.ok) {
            // لو الموقع رجع 403 أو غيره، هنعرف السبب من هنا
            console.error("API Error Response:", data);
            return NextResponse.json({ error: data.message }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}