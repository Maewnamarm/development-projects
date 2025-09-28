import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // ใช้ service_role เพื่อ bypass RLS
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { project, activities, documents } = body;

    if (!project?.id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // ✅ Update project
    const { error: projectError } = await supabase
      .from("projects")
      .update({
        name: project.name,
        code: project.code,
        department: project.department,
        location: project.location,
        start_date: project.start_date,
        end_date: project.end_date,
        objective: project.objective,
        category: project.category,
        budget: Number(project.budget) || null,
        responsible_person: project.responsible_person,
        contact_info: project.contact_info,
        status: project.status,
      })
      .eq("id", project.id);

    if (projectError) throw projectError;

    // ✅ Upsert activities
    if (activities && activities.length > 0) {
      const { error: activitiesError } = await supabase
        .from("activities")
        .upsert(
          activities.map((a: any) => ({
            id: a.id || undefined,
            project_id: project.id,
            description: a.description,
            start_date: a.start_date,
            end_date: a.end_date,
          })),
          { onConflict: "id" }
        );

      if (activitiesError) throw activitiesError;
    }

    // ✅ Upsert documents
    if (documents && documents.length > 0) {
      const { error: documentsError } = await supabase
        .from("documents")
        .upsert(
          documents.map((d: any) => ({
            id: d.id || undefined,
            project_id: project.id,
            name: d.name,
            file_url: d.file_url,
            is_public: d.is_public ?? false,
          })),
          { onConflict: "id" }
        );

      if (documentsError) throw documentsError;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("updateProject error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

