export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const messages = [
    "Welcome to Alpine.js with SSR!",
    "Your data is being served fresh from the server.",
    "Client-side reactivity is working perfectly!",
    "This message was fetched dynamically via API.",
    "Server-side rendering provides excellent SEO benefits.",
    "Alpine.js makes client interactions smooth and simple."
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  res.status(200).json({
    message: randomMessage,
    timestamp: new Date().toISOString()
  });
}