import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// สร้าง Supabase client (ใช้ Service Role Key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ฟังก์ชัน safeNumber
const safeNumber = (n: any) => {
  if (n === "" || n === null || n === undefined) return null;
  const num = Number(n);
  return isNaN(num) ? null : num;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      projName,
      projCode,
      department,
      location,
      startDate,
      endDate,
      objective,
      status,
      category,
      budget,
      responsiblePerson,
      contactInfo,
      activities,
      documents, // [{ file (base64), name, type?, isPublic }]
    } = body;

    // 1) Insert Project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert([
        {
          name: projName,
          code: projCode,
          department,
          location,
          start_date: startDate,
          end_date: endDate,
          objective,
          status,
          category,
          budget: safeNumber(budget),
          responsible_person: responsiblePerson,
          contact_info: contactInfo,
        },
      ])
      .select()
      .single();

    if (projectError) throw projectError;
    const projectId = project.id;

    // 2) Insert Activities
    if (activities && activities.length > 0) {
      const activityRows = activities.map((a: any) => ({
        project_id: projectId,
        description: a.description,
        start_date: a.startDate,
        end_date: a.endDate,
      }));

      const { error: actError } = await supabase
        .from("activities")
        .insert(activityRows);

      if (actError) throw actError;
    }

    // 3) Upload Documents
    if (documents && documents.length > 0) {
      const docRows: any[] = [];

      for (const d of documents) {
        if (!d.file) throw new Error(`เอกสาร ${d.name} ไม่มีไฟล์`);
      
        const filePath = `project-files/${crypto.randomUUID()}-${d.name}`;
        const { error: uploadError } = await supabase.storage
          .from("project-files")
          .upload(filePath, Buffer.from(d.file, "base64"), {
            contentType: d.type || "application/octet-stream",
          });
      
        if (uploadError) throw uploadError;
      
        const { data: publicUrl } = supabase.storage
          .from("project-files")
          .getPublicUrl(filePath);
      
        docRows.push({
          project_id: projectId,
          name: d.name,
          file_url: publicUrl.publicUrl,
          is_public: d.isPublic || false,
        });
      }
      
      const { error: docError } = await supabase.from("documents").insert(docRows);
      if (docError) throw docError;
    }

    return NextResponse.json(
      { message: "Project and related data saved successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
