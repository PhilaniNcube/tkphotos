import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  photoUploader: f({
    image: { maxFileSize: "32MB", maxFileCount: 10 },
  }).onUploadComplete(async ({ file, metadata }) => {
    // eslint-disable-next-line no-console
    console.log("Uploaded photo", {
      name: file.name,
      url: file.ufsUrl,
      customId: file.customId,
      size: file.size,
      type: file.type,
      metadata: metadata,
    });
    return {
      url: file.ufsUrl,
      customId: file.customId,
      size: file.size,
      type: file.type,
      metadata: metadata,
    };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
