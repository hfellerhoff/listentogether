export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.VERCEL_ENV === 'preview'
    ? process.env.VERCEL_URL
    : 'https://www.listentogether.app';

export const buildListenTogetherAPIUrl = (url: string) => `${BASE_URL}${url}`;

const ListenTogetherAPI = {
  Routes: {},
  Cookies: {},
  Secrets: {},
  BASE_URL,
};

export default ListenTogetherAPI;
