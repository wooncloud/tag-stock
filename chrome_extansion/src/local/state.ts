import type { LocalImageFile, UserProfile } from '../shared/types';

let images: LocalImageFile[] = [];
let checkedIds: Set<string> = new Set();
let lastClickedId: string | null = null;
let currentProfile: UserProfile | null = null;
let detailImageId: string | null = null;

// ── Image CRUD ──

export function getImages(): LocalImageFile[] {
  return images;
}

export function addImage(image: LocalImageFile): void {
  images.push(image);
}

export function getImageById(id: string): LocalImageFile | undefined {
  return images.find((img) => img.id === id);
}

export function updateImage(id: string, updates: Partial<LocalImageFile>): void {
  const index = images.findIndex((img) => img.id === id);
  if (index !== -1) {
    images[index] = { ...images[index], ...updates };
  }
}

export function removeImage(id: string): void {
  images = images.filter((img) => img.id !== id);
  checkedIds.delete(id);
}

// ── Multi-Selection (Checkboxes) ──

export function getCheckedIds(): Set<string> {
  return checkedIds;
}

export function isChecked(id: string): boolean {
  return checkedIds.has(id);
}

export function toggleChecked(id: string): void {
  if (checkedIds.has(id)) {
    checkedIds.delete(id);
  } else {
    checkedIds.add(id);
  }
  lastClickedId = id;
}

export function checkRange(fromId: string, toId: string): void {
  const fromIndex = images.findIndex((img) => img.id === fromId);
  const toIndex = images.findIndex((img) => img.id === toId);
  if (fromIndex === -1 || toIndex === -1) return;

  const start = Math.min(fromIndex, toIndex);
  const end = Math.max(fromIndex, toIndex);

  for (let i = start; i <= end; i++) {
    checkedIds.add(images[i].id);
  }
  lastClickedId = toId;
}

export function checkAll(): void {
  images.forEach((img) => checkedIds.add(img.id));
}

export function uncheckAll(): void {
  checkedIds.clear();
}

export function getCheckedImages(): LocalImageFile[] {
  return images.filter((img) => checkedIds.has(img.id));
}

export function getLastClickedId(): string | null {
  return lastClickedId;
}

export function setLastClickedId(id: string | null): void {
  lastClickedId = id;
}

// ── Detail Modal ──

export function getDetailImageId(): string | null {
  return detailImageId;
}

export function setDetailImageId(id: string | null): void {
  detailImageId = id;
}

// ── Profile ──

export function getCurrentProfile(): UserProfile | null {
  return currentProfile;
}

export function setCurrentProfile(profile: UserProfile | null): void {
  currentProfile = profile;
}
