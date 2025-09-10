import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      activities (*),
      documents (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: body.projName,
        code: body.projCode,
        department: body.department,
        location: body.location,
        start_date: body.startDate,
        end_date: body.endDate,
        objective: body.objective,
        status: body.status,
        category: body.category,
        budget: body.budget,
        responsible_person: body.responsiblePerson,
        contact_info: body.contactInfo,
      })
      .select()
      .single();

    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 500 });
    }

    // Insert activities
    if (body.activities && body.activities.length > 0) {
      const activities = body.activities
        .filter(activity => activity.description.trim() !== '')
        .map(activity => ({
          project_id: project.id,
          description: activity.description,
          start_date: activity.startDate || null,
          end_date: activity.endDate || null,
        }));

      if (activities.length > 0) {
        const { error: activitiesError } = await supabase
          .from('activities')
          .insert(activities);

        if (activitiesError) {
          console.error('Activities insert error:', activitiesError);
        }
      }
    }

    // Insert documents
    if (body.documents && body.documents.length > 0) {
      const documents = body.documents.map(doc => ({
        project_id: project.id,
        name: doc.name,
        file_url: `data:${doc.type};base64,${doc.file}`,
        is_public: doc.isPublic || false,
      }));

      const { error: documentsError } = await supabase
        .from('documents')
        .insert(documents);

      if (documentsError) {
        console.error('Documents insert error:', documentsError);
      }
    }

    return NextResponse.json({ 
      message: 'บันทึกโครงการสำเร็จ',
      project 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'เกิดข้อผิดพลาดในการบันทึกโครงการ' 
    }, { status: 500 });
  }
}