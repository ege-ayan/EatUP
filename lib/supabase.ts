import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImage = async (file: File, bucket: string = "offerings") => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;
  const filePath = fileName;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return publicUrl;
};

export const deleteImage = async (
  imageUrl: string,
  bucket: string = "offerings"
) => {
  const urlParts = imageUrl.split("/");
  const fileName = urlParts[urlParts.length - 1];
  const filePath = fileName;

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw error;
  }
};
