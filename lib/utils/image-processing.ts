import imageCompression from 'browser-image-compression';

export async function processAndCompressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const options = {
    maxSizeMB: 0.9,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
    initialQuality: 0.7,
    preserveExif: true,
  };

  try {
    // 원본에서 EXIF 추출 (JPG인 경우)
    let exifData: string | null = null;
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      try {
        const piexif = (await import('piexifjs')).default;
        const reader = new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.readAsDataURL(file);
        });
        const dataUrl = await reader;
        exifData = piexif.load(dataUrl);
      } catch (e) {
        console.warn('Failed to extract EXIF:', e);
      }
    }

    const compressedBlob = await imageCompression(file, options);
    let finalFile = new File([compressedBlob], file.name, { type: compressedBlob.type });

    // EXIF 다시 주입 (JPG인 경우)
    if (exifData && (finalFile.type === 'image/jpeg' || finalFile.type === 'image/jpg')) {
      try {
        const piexif = (await import('piexifjs')).default;
        const reader = new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.readAsDataURL(finalFile);
        });
        const dataUrl = await reader;
        const inserted = piexif.insert(exifData, dataUrl);

        // Base64 to Blob
        const byteString = atob(inserted.split(',')[1]);
        const mimeString = inserted.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let j = 0; j < byteString.length; j++) {
          ia[j] = byteString.charCodeAt(j);
        }
        finalFile = new File([ab], file.name, { type: mimeString });
      } catch (e) {
        console.warn('Failed to reinject EXIF:', e);
      }
    }

    return finalFile;
  } catch (error) {
    console.error('Compression error:', error);
    return file;
  }
}
