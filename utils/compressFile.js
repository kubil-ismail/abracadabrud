import imageCompression from 'browser-image-compression';

const compressFile = async (file) => {
    const options = {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    };
    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.log(error);
    }
};

export default compressFile;