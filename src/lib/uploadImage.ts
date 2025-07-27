import { v2 as cloudinary } from "cloudinary";
import { File } from "formidable";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: "avatars",
    });
    return result.secure_url;
  } catch (error) {
    throw new Error("Erro ao fazer upload da imagem");
  }
}