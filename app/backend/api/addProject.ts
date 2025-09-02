import supabase from '@/app/backend/services/supabaseservice'; // นำเข้า Supabase connection
import type { NextApiRequest, NextApiResponse } from 'next';


// การจัดการการเพิ่มโปรเจกต์ใหม่
const addProject = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { proj_name, pj_key, agency, location, p_start, p_end, proj_information, category_id, budget, projectowner, contact } = req.body;

      // ส่งข้อมูลไปที่ Supabase
      const { data, error } = await supabase
        .from('project')
        .insert([
          {
            proj_name,
            pj_key,
            agency,
            location,
            p_start,
            p_end,
            proj_information,
            category_id,
            budget,
            projectowner,
            contact
          }
        ]);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Project added successfully', data });
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default addProject;
