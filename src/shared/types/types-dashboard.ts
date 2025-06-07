import { ContactInfo } from "./types-common";

export interface PageEntity {
  id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
}

export interface Artwork extends PageEntity {
  artistId?: string;
  artistName?: string;
  exhibitionId?: string;
  exhibitionName?: string;
  medium?: Record<string, string>;
  dimensions?: string;
  genreIds?: string[];
  genreNames?: string[];
  latitude?: number;
  longitude?: number;
}

export interface ArtworkDetail extends PageEntity {
  artworkId: string;
  artworkName: string;
}

export interface Artist extends PageEntity {
  dateOfBirth?: string;
  dateOfDeath?: string;
  genreIds?: string[];
  genreNames?: string[];
  imageDescriptions?: ImageDescription[];
  contactInfo?: ContactInfo;
}

export interface Genre extends PageEntity {
  imageDescriptions?: ImageDescription[];
}

export type ExhibitionScheduleType = "None" | "Fixed" | "Custom";

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
  genreIds?: string[];
  genreNames?: string[];
  imageDescriptions?: ImageDescription[];
  schedule?: ExhibitionSchedule;
  contactInfo?: ContactInfo;
}

export type ImageDescription = {
  [languageCode: string]: string;
};
