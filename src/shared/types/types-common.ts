export type EntityType =
  | "artwork"
  | "artworkDetail"
  | "exhibition"
  | "artist"
  | "genre";

export interface ContactInfo {
    phoneNumber?: string;
    email?: string;
    website?: string;
    socialMedia?: Partial<Record<SocialMediaPlatform, string>>;
}

export enum SocialMediaPlatform {
    Facebook = "Facebook",
    Instagram = "Instagram",
    X = "X",
    LinkedIn = "LinkedIn",
}
