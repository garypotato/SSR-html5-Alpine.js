export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stats = {
    users: Math.floor(Math.random() * 1000) + 500,
    posts: Math.floor(Math.random() * 100) + 50,
    comments: Math.floor(Math.random() * 500) + 200
  };

  res.status(200).json({ stats, timestamp: new Date().toISOString() });
}