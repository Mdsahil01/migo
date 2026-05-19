export type EventMode =
  | "online"
  | "offline"
  | "hybrid";

export type OrganizerType =
  | "college"
  | "startup"
  | "company"
  | "community";

/** Supabase `events` row — intelligence + legacy fields. */
export type EventRecord = {
  id: string;
  title: string;
  location: string;
  starts_at: string;
  status: string;
  registration_link?: string | null;
  source_url?: string | null;
  organizer_name?: string | null;
  /** Legacy summary; kept for backward compatibility. */
  description?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  mode?: EventMode | string | null;
  latitude?: number | null;
  longitude?: number | null;
  max_team_size?: number | null;
  min_team_size?: number | null;
  registration_deadline?: string | null;
  organizer_type?: OrganizerType | string | null;
  prize_pool?: string | null;
  tags?: string[] | null;
  source_platform?: string | null;
  resources?: string | null;
  created_by?: string | null;
  calendar_added?: boolean | null;
};

export type EventIntelligenceInsert = {
  title: string;
  description: string;
  short_description: string;
  full_description: string;
  location: string;
  mode: EventMode;
  latitude: number | null;
  longitude: number | null;
  max_team_size: number | null;
  min_team_size: number | null;
  registration_deadline: string | null;
  organizer_name: string | null;
  organizer_type: OrganizerType | null;
  prize_pool: string | null;
  tags: string[];
  source_platform: string;
  registration_link: string;
  source_url: string;
  starts_at: string;
  status: "reviewing";
};

export type DevfolioTheme = {
  theme?: {
    name?: string;
  };
};

export type DevfolioListHackathon = {
  slug: string;
  name: string;
  starts_at: string;
  is_online: boolean;
  themes?: DevfolioTheme[];
  settings?: {
    external_apply_url?: string | null;
  };
};

export type DevfolioHackathonDetail = {
  slug: string;
  name: string;
  tagline?: string;
  desc?: string;
  starts_at: string;
  is_online: boolean;
  city?: string | null;
  country?: string | null;
  location?: string | null;
  team_min?: number;
  team_max?: number;
  team_size?: number;
  themes?: DevfolioTheme[];
  faqs?: Array<{
    question?: string;
    answer?: string;
  }>;
  hackathon_setting?: {
    external_apply_url?: string | null;
    subdomain?: string;
    reg_ends_at?: string | null;
    is_hybrid?: boolean;
    location_latitude?: number | null;
    location_longitude?: number | null;
  };
};
