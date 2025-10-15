import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// --- Custom Types for Strong Typing ---

type ActivityData = {
  description: string;
  startDate: string;
  endDate: string;
};

type DocumentUploadData = {
  file?: string; // Base64 string
  name: string;
  type?: string;
  isPublic?: boolean;
};

type DocumentRow = {
  project_id: number;
  name: string;
  file_url: string;
  is_public: boolean;
};

// --- Supabase and Utility Setup ---

// สร้าง Supabase client (ใช้ Service Role Key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * แปลงค่า input เป็นตัวเลขอย่างปลอดภัย หากไม่ใช่ตัวเลขจะคืนค่า null
 * @param n ค่า input ที่อาจเป็น string, number, null, หรือ undefined
 */
const safeNumber = (n: unknown): number | null => {
  if (n === "" || n === null || n === undefined) return null;
  const num = Number(n);
  return isNaN(num) ? null : num;
};

/**
 * ดึงนามสกุลไฟล์จากชื่อไฟล์
 */
const getFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot) : '';
};

// --- API Handler ---

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
      activities, // ActivityData[]
      documents, // DocumentUploadData[]
    }: {
      projName: string,
      projCode: string,
      department: string,
      location: string,
      startDate: string,
      endDate: string,
      objective: string,
      status: string,
      category: string,
      budget: unknown,
      responsiblePerson: string,
      contactInfo: string,
      activities?: ActivityData[],
      documents?: DocumentUploadData[],
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
      .select("id")
      .single();

    if (projectError) throw projectError;
    const projectId = project.id as number; 

    // 2) Insert Activities
    if (activities && activities.length > 0) {
      const activityRows = activities.map((a: ActivityData) => ({ 
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
      const docRows: DocumentRow[] = [];

      for (const d of documents) {
        if (!d.file) {
          console.error(`เอกสาร ${d.name} ไม่มีไฟล์`);
          continue; // ข้ามไฟล์นี้แทนการ throw error
        }
      
        try {
          const fileBuffer = Buffer.from(d.file.replace(/^data:.+;base64,/, ''), "base64");
          
          // ใช้ UUID เป็นชื่อไฟล์หลัก และเก็บนามสกุลไฟล์เดิม
          const fileExtension = getFileExtension(d.name);
          const uniqueFileName = `${crypto.randomUUID()}${fileExtension}`;
          const filePath = `project-files/${uniqueFileName}`;

          const { error: uploadError } = await supabase.storage
            .from("project-files")
            .upload(filePath, fileBuffer, {
              contentType: d.type || "application/octet-stream",
              upsert: false
            });
        
          if (uploadError) {
            console.error(`Error uploading file ${d.name}:`, uploadError);
            throw new Error(`ไม่สามารถอัปโหลดไฟล์ ${d.name}: ${uploadError.message}`);
          }
        
          const { data: publicUrl } = supabase.storage
            .from("project-files")
            .getPublicUrl(filePath);
        
          docRows.push({
            project_id: projectId,
            name: d.name, // เก็บชื่อภาษาไทยไว้ใน database
            file_url: publicUrl.publicUrl,
            is_public: d.isPublic || false,
          });
        } catch (fileError) {
          console.error(`Error processing file ${d.name}:`, fileError);
          throw new Error(`เกิดข้อผิดพลาดในการประมวลผลไฟล์ ${d.name}`);
        }
      }
      
      if (docRows.length > 0) {
        const { error: docError } = await supabase.from("documents").insert(docRows);
        if (docError) {
          console.error("Error inserting documents:", docError);
          throw new Error(`ไม่สามารถบันทึกข้อมูลเอกสารได้: ${docError.message}`);
        }
      }
    }

    return NextResponse.json(
      { message: "Project and related data saved successfully", ok: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/saveProject:", error);
    const errorMessage = error instanceof Error ? 
      error.message : 
      "Internal Server Error: An unknown error occurred.";
      
    return NextResponse.json(
      { message: errorMessage, ok: false },
      { status: 500 }
    );
  }
}