import ImageKit, { toFile } from '@imagekit/nodejs';
import config from '../config/config.js';

const client = new ImageKit({
  privateKey: config.ImageKitPrivateKey, // This is the default and can be omitted
});
export async function uploadToImageKit(fileName, buffer) {
  try {
    const saved = await client.files.upload({
      folder: "/baddie-thrift",
      file: await toFile(buffer, fileName),
      fileName
    });
 
    return saved.url;
  } catch (err) {
    console.error("Image upload failed:", err);
    throw new Error("Image upload failed");
  }
}