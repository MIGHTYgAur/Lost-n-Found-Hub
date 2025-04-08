import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';
dotenv.config();

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} buffer - The image file buffer
 * @param {Object} options - Optional Cloudinary config (e.g., folder, tags)
 * @returns {Promise<string>} The uploaded image URL
 */

// const uploadToCloudinary = (buffer, options = {}) => {
//  //configure cloudinary
//     cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET,
//     });

//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       { resource_type: 'auto' },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result.secure_url);
//         }
//       }
//     );
//     const bufferStream = new PassThrough();
//     bufferStream.end(buffer);
//     bufferStream.pipe(uploadStream);
//   });
// };
const uploadToCloudinary = async (buffer) => {

    const photoUpload = await new Promise((resolve, reject) => {  //upload to cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
                if (error) {
                    reject(error); // Reject the promise on error
                } else {
                    resolve(result); // Resolve the promise with the upload result
                }
            }
        );
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer); // Pass the buffer into the stream
        bufferStream.pipe(uploadStream); // Pipe the file stream to Cloudinary
    });
    const photoUrl = photoUpload.secure_url;
    console.log(photoUrl); // Log the URL of the uploaded image

    return photoUrl; // Return the URL of the uploaded image
    

}
export default uploadToCloudinary;