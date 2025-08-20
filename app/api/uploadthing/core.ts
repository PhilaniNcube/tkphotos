import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  photoUploader: f({
    image: { maxFileSize: "32MB", maxFileCount: 10 },
  }).onUploadComplete(async ({ file }) => {
    // eslint-disable-next-line no-console
    console.log("Uploaded photo", { name: file.name, url: file.ufsUrl });
    return { url: file.ufsUrl };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
