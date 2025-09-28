import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectIdStr = searchParams.get('id');
    const projectId = projectIdStr ? Number(projectIdStr) : null;

    if (!projectId) {
      return NextResponse.json({ error: 'Missing project id' }, { status: 400 });
    }

    console.log('👉 projectId param:', projectId);

    // ดึง project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();

    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 500 });
    }
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // ดึง activities
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .eq('project_id', projectId);

    if (activitiesError) {
      return NextResponse.json({ error: activitiesError.message }, { status: 500 });
    }

    // ดึง statusUpdates
    const { data: statusUpdates, error: updatesError } = await supabase
      .from('status')
      .select('*')
      .eq('project_id', projectId);

    if (updatesError) {
      return NextResponse.json({ error: updatesError.message }, { status: 500 });
    }

    // ดึง documents
    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select('*')
      .eq('project_id', projectId);

    if (documentsError) {
      return NextResponse.json({ error: documentsError.message }, { status: 500 });
    }

    return NextResponse.json({
      project,
      activities: activities ?? [],
      statusUpdates: statusUpdates ?? [],
      documents: documents ?? [],
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
