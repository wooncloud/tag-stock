import { getImageById, updateImage } from '../state';
import { escapeHtml } from '../utils';

const titleInput = document.getElementById('titleInput') as HTMLInputElement;
const keywordInput = document.getElementById('keywordInput') as HTMLInputElement;
const keywordTags = document.getElementById('keywordTags')!;
const keywordCount = document.getElementById('keywordCount')!;
const captionInput = document.getElementById('captionInput') as HTMLTextAreaElement;

let currentEditingId: string | null = null;

export function initMetadataEditor(): void {
  titleInput.addEventListener('input', () => {
    saveCurrentMetadata();
  });

  keywordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = keywordInput.value.trim();
      if (value) {
        addKeyword(value);
        keywordInput.value = '';
      }
    }
  });

  captionInput.addEventListener('input', () => {
    saveCurrentMetadata();
  });
}

function saveCurrentMetadata(): void {
  if (!currentEditingId) return;

  const image = getImageById(currentEditingId);
  if (!image) return;

  updateImage(currentEditingId, {
    editedMetadata: {
      title: titleInput.value,
      keywords: image.editedMetadata?.keywords || [],
      caption: captionInput.value || undefined,
    },
  });
}

export function renderEditor(imageId: string): void {
  currentEditingId = imageId;

  const image = getImageById(imageId);
  if (!image) return;

  const metadata = image.editedMetadata || {
    title: image.metadata?.title || '',
    keywords: image.metadata?.keyword || [],
    caption: '',
  };

  titleInput.value = metadata.title;
  captionInput.value = metadata.caption || '';
  renderKeywords(metadata.keywords);
}

function renderKeywords(keywords: string[]): void {
  keywordCount.textContent = `(${keywords.length})`;

  keywordTags.innerHTML = keywords
    .map(
      (kw, index) => `
      <div class="keyword-tag">
        <span>${escapeHtml(kw)}</span>
        <button data-index="${index}" class="remove-keyword">&times;</button>
      </div>
    `
    )
    .join('');

  keywordTags.querySelectorAll('.remove-keyword').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index')!);
      removeKeyword(index);
    });
  });
}

function addKeyword(keyword: string): void {
  if (!currentEditingId) return;

  const image = getImageById(currentEditingId);
  if (!image) return;

  const currentKeywords = image.editedMetadata?.keywords || image.metadata?.keyword || [];

  if (currentKeywords.includes(keyword)) return;

  const newKeywords = [...currentKeywords, keyword];
  updateImage(currentEditingId, {
    editedMetadata: {
      title: titleInput.value,
      keywords: newKeywords,
      caption: captionInput.value || undefined,
    },
  });

  renderKeywords(newKeywords);
}

function removeKeyword(index: number): void {
  if (!currentEditingId) return;

  const image = getImageById(currentEditingId);
  if (!image) return;

  const keywords = [...(image.editedMetadata?.keywords || [])];
  keywords.splice(index, 1);

  updateImage(currentEditingId, {
    editedMetadata: {
      title: titleInput.value,
      keywords,
      caption: captionInput.value || undefined,
    },
  });

  renderKeywords(keywords);
}
