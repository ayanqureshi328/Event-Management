import 'dotenv/config';
import express from 'express';
import { MongoClient } from 'mongodb';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_URI;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mongoClient;

app.use(express.json());

app.post('/api/inquiries', async (request, response) => {
  const { name, email, event, guests, message } = request.body ?? {};

  if (!name?.trim() || !email?.trim() || !event?.trim()) {
    return response.status(400).json({ error: 'Name, email, and event are required.' });
  }

  if (!mongoUri) {
    return response.status(503).json({ error: 'Inquiry storage is not configured yet.' });
  }

  try {
    mongoClient ??= new MongoClient(mongoUri);
    await mongoClient.connect();
    const collection = mongoClient.db(process.env.MONGODB_DATABASE || 'eventra').collection('inquiries');
    const result = await collection.insertOne({
      name: name.trim(),
      email: email.trim(),
      event: event.trim(),
      guests: Number(guests) || 1,
      message: message?.trim() || '',
      createdAt: new Date(),
    });

    return response.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error('Could not save inquiry:', error.message);
    return response.status(500).json({ error: 'We could not save your inquiry. Please try again.' });
  }
});

const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*path', (_request, response) => response.sendFile(path.join(distPath, 'index.html')));

app.listen(port, () => console.log(`Eventra API listening on http://localhost:${port}`));