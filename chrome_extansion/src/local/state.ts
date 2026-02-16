import type { LocalImageFile, UserProfile } from '../shared/types';

let images: LocalImageFile[] = [];
let selectedImageId: string | null = null;
let currentProfile: UserProfile | null = null;

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
  if (selectedImageId === id) {
    selectedImageId = null;
  }
}

export function getSelectedImageId(): string | null {
  return selectedImageId;
}

export function setSelectedImageId(id: string | null): void {
  selectedImageId = id;
}

export function getCurrentProfile(): UserProfile | null {
  return currentProfile;
}

export function setCurrentProfile(profile: UserProfile | null): void {
  currentProfile = profile;
}
