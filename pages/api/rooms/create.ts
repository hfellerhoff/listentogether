const redirectURI =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/rooms/'
    : 'http://listentogether.app/rooms/';

export default function handler(req, res) {
  const roomID = 0;

  // TODO: Initialize Room

  res.redirect(redirectURI + roomID);
}
