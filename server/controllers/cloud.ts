import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw Error("Cloudinary API Keys are missing");
}

cloudinary.config({
  cloud_name: "dimm9mwzp",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = async (filePath: string) => {
  try {
    const results = await cloudinary.uploader.upload(filePath, {
      transformation: [{ height: 40, width: 40, crop: "limit" }],
    });
    return results.url;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { upload };
