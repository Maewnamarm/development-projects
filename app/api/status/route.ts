import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 📌 GET: ดึง status ทั้งหมด
export async function GET() {
  const { data, error } = await supabase
    .from('status')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}


export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { project_id, activity_id, problem, solving, action, reporter, picture, role } = body;
  
      if (!project_id || !problem || !reporter) {
        return NextResponse.json(
          { error: 'project_id, problem และ reporter จำเป็นต้องมี' },
          { status: 400 }
        );
      }
  
      const { data, error } = await supabase
        .from('status')
        .insert([
          {
            project_id,
            activity_id,
            problem,
            solving,
            action,
            reporter,
            picture,
            role,
            stat_date: new Date(), // auto insert timestamp
          },
        ])
        .select('*')
        .single();
  
      if (error) throw error;
  
      return NextResponse.json({ message: 'บันทึกสำเร็จ', status: data });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }
  
  