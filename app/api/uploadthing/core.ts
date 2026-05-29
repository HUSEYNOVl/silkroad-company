import {createUploadthing, type FileRouter} from 'uploadthing/next';

const f = createUploadthing();

export const uploadRouter = {
  quoteFiles: f({
    image: {maxFileSize: '16MB', maxFileCount: 5},
    pdf: {maxFileSize: '16MB', maxFileCount: 5}
  }).onUploadComplete(({file}) => ({url: file.url, name: file.name}))
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
