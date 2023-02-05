export type SupabaseProfile = {
  id: string;
  service_id: string;
  service: 'spotify';
  updated_at: string;
  username: string | null;
  avatar_url: string | null;
  website: string | null;
};

export type Profile = {
  id: string;
  serviceId: string;
  service: 'spotify';
  username: string | null;
  avatarUrl: string | null;
  isPremium: boolean;
};
