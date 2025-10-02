import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const optimizeImage = async (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

export const uploadImage = async (file: File, bucket: string = "offerings") => {
  const optimizedBlob = await optimizeImage(file);

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.jpg`;
  const optimizedFile = new File([optimizedBlob], fileName, {
    type: "image/jpeg",
  });

  const filePath = fileName;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, optimizedFile, {
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

  const filePath = fileName.replace(/\.[^/.]+$/, ".jpg");

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    throw error;
  }
};
