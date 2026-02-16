import { embedIPTCToJpeg } from '../../core/iptc';
import { setBatchDownloadLoading } from '../components/action-buttons';
import { renderGrid } from '../components/image-grid';
import { getImageById, updateImage } from '../state';

export async function embedAndDownload(imageId: string): Promise<void> {
  const image = getImageById(imageId);
  if (!image || !image.originalBase64) {
    throw new Error('Image not loaded');
  }

  if (!image.editedMetadata) {
    throw new Error('No metadata to embed');
  }

  updateImage(imageId, { status: 'embedding' });
  renderGrid();

  try {
    const embeddedBase64 = embedIPTCToJpeg(image.originalBase64, {
      title: image.editedMetadata.title,
      keywords: image.editedMetadata.keywords,
      caption: image.editedMetadata.caption,
    });

    await downloadFile(embeddedBase64, image.file.name);

    updateImage(imageId, { status: 'completed' });
    renderGrid();
  } catch (error) {
    console.error('IPTC embedding failed:', error);
    updateImage(imageId, {
      status: 'error',
      error: (error as Error).message,
    });
    renderGrid();
    throw error;
  }
}

export async function batchEmbedAndDownload(imageIds: string[]): Promise<void> {
  const total = imageIds.length;
  let completed = 0;

  for (const id of imageIds) {
    const image = getImageById(id);
    // Only download images that have metadata (ready or completed)
    if (!image || !image.editedMetadata || !image.originalBase64) {
      completed++;
      continue;
    }

    setBatchDownloadLoading(true, `Downloading ${completed + 1}/${total}...`);

    try {
      await embedAndDownload(id);
    } catch (error) {
      console.error(`Failed to download image ${id}:`, error);
      // Continue with next
    }

    completed++;
  }
}

function downloadFile(base64: string, fileName: string): Promise<void> {
  return new Promise((resolve) => {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);

    const taggedName = fileName.replace(/\.(jpe?g)$/i, '-tagged.jpg');

    chrome.downloads.download(
      {
        url,
        filename: taggedName,
        saveAs: false,
      },
      () => {
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        resolve();
      }
    );
  });
}
