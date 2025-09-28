import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
// ❗ ใช้ Service Role Key สำหรับ insert/delete (เก็บฝั่ง server เท่านั้น)
const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/comment?project_id=1
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');

    if (!projectId) {
      return NextResponse.json({ error: 'project_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('comment')
      .select('*')
      .eq('project_id', projectId)
      .order('comm_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/comment
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, citizen_name, project_id } = body;

    if (!content || !citizen_name || !project_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('comment')
      .insert([
        {
          content,
          citizen_name,
          project_id,
          comm_date: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
