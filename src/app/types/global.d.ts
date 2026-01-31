export {};

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: unknown) => void
      ) => {
        open: () => void;
        close: () => void;
      };
    };
  }
}
