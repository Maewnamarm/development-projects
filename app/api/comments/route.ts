import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ใช้ service role ที่ฝั่ง server
);

// GET - ดึงคอมเมนต์ตาม post_id
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('post_id');

  if (!postId) {
    return NextResponse.json({ error: 'post_id is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('comment')
    .select('*')
    .eq('post_id', postId)
    .order('comm_date', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - เพิ่มคอมเมนต์ใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, citizen_name, post_id } = body;

    if (!content || !post_id) {
      return NextResponse.json(
        { error: 'content and post_id are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('comment')
      .insert([
        {
          content: content,
          citizen_name: citizen_name || 'ผู้ไม่ประสงค์ออกนาม',
          post_id: post_id
        }
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }
}