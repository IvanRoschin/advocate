export interface CloudinaryUploadResult {
  event: 'success';
  info: {
    secure_url: string;
    public_id: string;
    width?: number;
    height?: number;
    format?: string;
  };
}
