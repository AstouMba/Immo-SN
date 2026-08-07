declare module 'multer' {
  export const diskStorage: (...args: any[]) => any;
}

declare namespace Express {
  namespace Multer {
    interface File {
      filename: string;
      originalname: string;
      mimetype: string;
    }
  }
}
