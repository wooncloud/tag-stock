import {
  getAnalyzeBtn,
  getDownloadBtn,
  setAnalyzeLoading,
  setDownloadLoading,
} from './components/action-buttons';
import { initFilePicker } from './components/file-picker';
import { initMetadataEditor } from './components/metadata-editor';
import { analyzeImage } from './handlers/ai-handler';
import { embedAndDownload } from './handlers/iptc-handler';
import { getSelectedImageId } from './state';

export function setupEventListeners(): void {
  initFilePicker();
  initMetadataEditor();

  getAnalyzeBtn().addEventListener('click', async () => {
    const id = getSelectedImageId();
    if (!id) return;

    setAnalyzeLoading(true);
    try {
      await analyzeImage(id);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzeLoading(false);
    }
  });

  getDownloadBtn().addEventListener('click', async () => {
    const id = getSelectedImageId();
    if (!id) return;

    setDownloadLoading(true);
    try {
      await embedAndDownload(id);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloadLoading(false);
    }
  });
}
