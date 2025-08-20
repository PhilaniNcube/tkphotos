declare module "@uploadthing/react/hooks" {
  import type { FileRouter } from "uploadthing/server";
  export function generateReactHelpers<TRouter extends FileRouter>(): {
    useUploadThing: (
      route: keyof TRouter,
      opts?: {
        onClientUploadComplete?: (res: { name: string; url: string }[]) => void;
        onUploadError?: (err: { file?: File; message: string }) => void;
        onUploadProgress?: (progress: number) => void;
      }
    ) => {
      startUpload: (files: File[]) => Promise<void>;
    };
  };
}
