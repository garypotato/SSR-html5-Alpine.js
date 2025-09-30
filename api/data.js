export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { counter, timestamp } = req.body;

    console.log('Received data:', { counter, timestamp });

    res.status(200).json({
      message: `Data received successfully! Counter was ${counter} at ${timestamp}`,
      received: { counter, timestamp },
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({
      error: 'Invalid JSON data',
      message: 'Please send valid JSON in the request body'
    });
  }
}