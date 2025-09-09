import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ใช้ service role ที่ฝั่ง server
);

// GET - ดึง project post ตาม project_id หรือทั้งหมด
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');

  let query = supabase
    .from('projectpost')
    .select(`
      *,
      projects!inner(*)
    `);

  if (projectId) {
    query = query.eq('project_id', projectId);
  }

  const { data, error } = await query.order('post_id', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - สร้าง project post ใหม่สำหรับโครงการ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { public_information, project_id } = body;

    if (!project_id) {
      return NextResponse.json(
        { error: 'project_id is required' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามี project post สำหรับโครงการนี้แล้วหรือไม่
    const { data: existingPost } = await supabase
      .from('projectpost')
      .select('post_id')
      .eq('project_id', project_id)
      .single();

    if (existingPost) {
      // ถ้ามีแล้ว ให้อัปเดต
      const { data, error } = await supabase
        .from('projectpost')
        .update({ public_information })
        .eq('project_id', project_id)
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data[0]);
    } else {
      // ถ้ายังไม่มี ให้สร้างใหม่
      const { data, error } = await supabase
        .from('projectpost')
        .insert([
          {
            public_information: public_information || '',
            project_id: project_id
          }
        ])
        .select();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data[0], { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }
}