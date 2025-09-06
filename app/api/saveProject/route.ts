import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ฟังก์ชันช่วยแปลงตัวเลข
const safeNumber = (n: any) => {
  if (n === "" || n === null || n === undefined) return null;
  const num = Number(n);
  return isNaN(num) ? null : num;
};

// ฟังก์ชันช่วยแปลงวันที่
const safeDate = (d: any) => {
  if (!d || d === "" || d === "00/00/00") return null;
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString().split("T")[0]; // YYYY-MM-DD
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
      documents,
    } = body;

    // Step 1: Insert Project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert([
        {
          name: projName,
          code: projCode,
          department,
          location,
          start_date: safeDate(startDate),
          end_date: safeDate(endDate),
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

    // Step 2: Insert Activities
    if (activities && activities.length > 0) {
      const activityRows = activities.map((a: any) => ({
        project_id: projectId,
        description: a.description,
        start_date: safeDate(a.startDate),
        end_date: safeDate(a.endDate),
      }));

      const { error: activityError } = await supabase
        .from("activities")
        .insert(activityRows);

      if (activityError) throw activityError;
    }

    // Step 3: Insert Documents
    if (documents && documents.length > 0) {
      const docRows = documents.map((d: any) => ({
        project_id: projectId,
        name: d.name,
        file_url: d.fileUrl,
        is_public: d.isPublic || false,
      }));

      const { error: docError } = await supabase
        .from("documents")
        .insert(docRows);

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
