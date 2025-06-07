import { ContactInfo } from "./types-common";

export interface PageEntity {
  id: string;
  name: string;
  description?: string;
  mainImageAspectRatio?: number;
  isFavorite?: boolean;
  isOwner?: boolean;
  descriptionLanguageCode: string;
}

export interface Artwork extends PageEntity {
  artistId?: string;
  artistName: string;
  exhibitionId?: string;
  exhibitionName?: string;
  medium?: string;
  dimensions?: string;
  genres?: Map<string, string>;
  latitude?: number;
  longitude?: number;
}

export interface ArtworkDetail extends PageEntity {
  artworkId: string;
  artworkName: string;
}

export interface Artist extends PageEntity {
  dateOfBirth: string;
  dateOfDeath: string;
  genres?: Map<string, string>;
  imageDescriptions?: string[];
  contactInfo?: ContactInfo;
  
}

export type ExhibitionScheduleType = "Fixed" | "Custom";

export interface FixedScheduleEntry {
  day: string;
  startTime: string;
  endTime: string;
  isNonStop?: boolean;
}

export interface CustomScheduleEntry {
  date: string;
  startTime: string;
  endTime: string;
  isNonStop?: boolean;
}

export interface ExhibitionSchedule {
  scheduleType: ExhibitionScheduleType;
  fixedEntries: FixedScheduleEntry[];
  customEntries: CustomScheduleEntry[];
}

export interface Exhibition extends PageEntity {
  latitude?: number;
  longitude?: number;
  address?: string;
  genres?: Map<string, string>;
  imageDescriptions?: string[];
  schedule?: ExhibitionSchedule;
  contactInfo?: ContactInfo;

}

export interface Genre extends PageEntity {
  imageDescriptions?: string[];
}

export interface ResourceTableItem {
  label: string;
  value: string[];
  link?: string[];
}
