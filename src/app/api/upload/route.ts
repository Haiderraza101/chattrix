import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";
import { tmpdir } from "os";
import path from "path";

cloudinary.v2.config({
  cloud_name: "dwzkz0xeg",
  api_key: "166855461558453",
  api_secret: "DTvYZ_vUHKzIRGDEewPsljpTIaQ",
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save temp file
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempPath = path.join(tmpdir(), file.name);
    await fs.writeFile(tempPath, buffer);

    // Upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(tempPath, {
      folder: "nextjs_uploads",
      upload_preset: "chattrix",
    });

    await fs.unlink(tempPath);

    return NextResponse.json({
      url: result.secure_url || null,
      originalName: file.name,
      type: file.type,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
