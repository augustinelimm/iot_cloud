export default async function handler(req, res) {
  try {
    const response = await fetch('http://13.214.142.44:3000/api/live');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
