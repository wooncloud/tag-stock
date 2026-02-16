import {
  getBatchAnalyzeBtn,
  getBatchDownloadBtn,
  getModalAnalyzeBtn,
  getModalDownloadBtn,
  initActionButtons,
  setBatchAnalyzeLoading,
  setBatchDownloadLoading,
} from './components/action-buttons';
import { getCurrentModalImageId, initDetailModal } from './components/detail-panel';
import { initFilePicker } from './components/file-picker';
import { initHelpPopover } from './components/help-popover';
import { renderGrid } from './components/image-grid';
import { initMetadataEditor } from './components/metadata-editor';
import { analyzeImage, batchAnalyze } from './handlers/ai-handler';
import { batchEmbedAndDownload, embedAndDownload } from './handlers/iptc-handler';
import { getCheckedIds } from './state';

export function setupEventListeners(): void {
  initFilePicker();
  initMetadataEditor();
  initDetailModal();
  initActionButtons();
  initHelpPopover();

  // Batch AI Analyze
  getBatchAnalyzeBtn().addEventListener('click', async () => {
    const checkedIds = Array.from(getCheckedIds());
    if (checkedIds.length === 0) return;

    setBatchAnalyzeLoading(true);
    try {
      await batchAnalyze(checkedIds);
    } catch (error) {
      console.error('Batch analysis failed:', error);
    } finally {
      setBatchAnalyzeLoading(false);
      renderGrid();
    }
  });

  // Batch Download
  getBatchDownloadBtn().addEventListener('click', async () => {
    const checkedIds = Array.from(getCheckedIds());
    if (checkedIds.length === 0) return;

    setBatchDownloadLoading(true);
    try {
      await batchEmbedAndDownload(checkedIds);
    } catch (error) {
      console.error('Batch download failed:', error);
    } finally {
      setBatchDownloadLoading(false);
      renderGrid();
    }
  });

  // Modal: Individual AI Analyze
  getModalAnalyzeBtn().addEventListener('click', async () => {
    const id = getCurrentModalImageId();
    if (!id) return;

    const btn = getModalAnalyzeBtn();
    btn.disabled = true;
    btn.textContent = 'Analyzing...';
    try {
      await analyzeImage(id);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      btn.disabled = false;
      btn.textContent = 'AI Analyze';
      renderGrid();
    }
  });

  // Modal: Individual Download
  getModalDownloadBtn().addEventListener('click', async () => {
    const id = getCurrentModalImageId();
    if (!id) return;

    const btn = getModalDownloadBtn();
    btn.disabled = true;
    btn.textContent = 'Embedding...';
    try {
      await embedAndDownload(id);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Embed & Download';
      renderGrid();
    }
  });
}
