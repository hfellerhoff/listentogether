export type SupabaseProfile = {
  id: string;
  service: 'spotify';
  service_id: string;
  service_avatar_url: string | null;
  service_display_name: string | null;
  display_name: string | null;
  updated_at: string;
};

export type Profile = {
  id: string;
  service: 'spotify';
  isPremium: boolean;
  displayName?: string;
  avatarUrl?: string;
};
