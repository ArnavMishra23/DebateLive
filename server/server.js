import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fluvioModule from '@fluvio/client';

console.log('Successfully imported @fluvio/client');

const fluvioClient = fluvioModule.default;
const { OffsetFrom } = fluvioModule;

dotenv.config();

const PORT = process.env.PORT || 3000;
const FLUVIO_TOPICS = ['live-debates', 'debate-streams', 'debate-votes'];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '..', 'public');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let fluvio;
let producers = {};
let consumers = {};

const clients = new Map();

console.log('✨ DebateLive backend initializing...');

// 1. Check Fluvio Connection
async function checkFluvioConnection() {
  try {
    fluvio = new fluvioClient();
    console.log('Fluvio client created successfully');
    await fluvio.connect();
    console.log('Fluvio client connected successfully');

    const admin = await fluvio.admin();
    console.log('✅ Fluvio Admin connected successfully!');
    console.log('Admin methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(admin)));

    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Fluvio:', error.message);
    return false;
  }
}

// 2. Connect Fluvio and Initialize
async function connectToFluvio() {
  try {
    console.log('Connecting to Fluvio client...');
    fluvio = new fluvioClient();
    await fluvio.connect();
    console.log('✅ Fluvio Client connected successfully');

    const admin = await fluvio.admin();
    
    let topics = [];
    try {
      const topicList = await admin.listTopic();
      console.log('Using admin.listTopic() method');
      if (Array.isArray(topicList)) {
        topics = topicList.map(topic => typeof topic === 'object' && topic.name ? topic.name : topic);
      } else if (topicList && typeof topicList === 'object') {
        topics = Object.keys(topicList);
      }
      console.log('Available topics:', JSON.stringify(topicList));
    } catch (err) {
      console.log('Could not list topics:', err.message);
      topics = [];
    }
    console.log('Extracted topic names:', topics);

    for (const topic of FLUVIO_TOPICS) {
      if (!topics.includes(topic)) {
        console.log(`Creating missing topic: ${topic}`);
        try {
          await admin.createTopic(topic);
          console.log(`Topic ${topic} created successfully`);
        } catch (error) {
          console.log(`Error creating topic ${topic}:`, error.message);
        }
      }
    }

    for (const topic of FLUVIO_TOPICS) {
      try {
        producers[topic] = await fluvio.topicProducer(topic);
        console.log(`Producer initialized for topic: ${topic}`);
      } catch (error) {
        console.error(`Failed to create producer for ${topic}:`, error.message);
      }
    }

    for (const topic of FLUVIO_TOPICS) {
      try {
        consumers[topic] = await fluvio.partitionConsumer(topic, 0);
        console.log(`Consumer methods for ${topic}:`, Object.getOwnPropertyNames(Object.getPrototypeOf(consumers[topic])));
        console.log(`Consumer initialized for topic: ${topic}`);
        startConsuming(topic);
      } catch (error) {
        console.error(`Failed to create consumer for ${topic}:`, error.message);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Failed during Fluvio client setup:', error.message);
    return false;
  }
}

// 3. Start consuming messages from Fluvio
async function startConsuming(topic) {
  try {
    console.log(`🟠 Starting consumer for topic: ${topic}`);
    
    const streamConfig = {
      autoCommit: true,
      startFrom: {
        type: OffsetFrom.End,
        index: 0
      }
    };
    
    console.log(`Creating stream for ${topic} with config:`, streamConfig);
    
    try {
      console.log(`Using streamWithConfig for ${topic}`);
      const stream = await consumers[topic].streamWithConfig(streamConfig);
      
      for await (const record of stream) {
        try {
          const value = record.valueString();
          const data = JSON.parse(value);
          console.log(`📥 Received from Fluvio [${topic}]`, data);
          broadcastMessage(topic, data);
        } catch (err) {
          console.error(`Error processing record from ${topic}:`, err);
        }
      }
    } catch (streamErr) {
      console.error(`streamWithConfig failed: ${streamErr.message}`);
      console.log(`Falling back to basic stream() for ${topic}`);
      try {
        const stream = await consumers[topic].stream(0);
        for await (const record of stream) {
          try {
            const value = record.valueString();
            const data = JSON.parse(value);
            console.log(`📥 Received from Fluvio [${topic}]`, data);
            broadcastMessage(topic, data);
          } catch (err) {
            console.error(`Error processing record from ${topic}:`, err);
          }
        }
      } catch (fallbackErr) {
        console.error(`Fallback approach failed: ${fallbackErr.message}`);
        console.log(`Using fetch polling for ${topic} as last resort`);
        setInterval(async () => {
          try {
            const records = await consumers[topic].fetch(0, -1);
            for (const record of records) {
              const value = record.valueString();
              const data = JSON.parse(value);
              console.log(`📥 Received from Fluvio [${topic}]`, data);
              broadcastMessage(topic, data);
            }
          } catch (err) {
            console.error(`Error fetching from ${topic}:`, err);
          }
        }, 1000);
      }
    }
  } catch (error) {
    console.error(`Error consuming from ${topic}:`, error);
    setTimeout(() => startConsuming(topic), 5000);
  }
}

// 4. Produce message to Fluvio
async function produceMessage(topic, data) {
  try {
    if (!producers[topic]) {
      throw new Error(`No producer for topic: ${topic}`);
    }

    const messageWithTimestamp = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    await producers[topic].send(JSON.stringify(messageWithTimestamp));
    console.log(`✅ Message sent to Fluvio [${topic}]`, messageWithTimestamp);

    return true;
  } catch (error) {
    console.error(`❌ Error producing to Fluvio [${topic}]:`, error);
    return false;
  }
}

// 5. Broadcast to all WebSocket clients
function broadcastMessage(topic, data) {
  const message = JSON.stringify({
    type: 'update',
    topic,
    data,
  });

  clients.forEach((clientData, client) => {
    if (client.readyState === 1 && clientData.subscriptions.has(topic)) {
      client.send(message);
    }
  });
}

// 6. WebSocket connections
wss.on('connection', (ws, req) => {
  const clientId = req.headers['sec-websocket-key'] || `client-${Date.now()}`;
  console.log(`🔵 WebSocket client connected: ${clientId}`);

  clients.set(ws, {
    id: clientId,
    subscriptions: new Set(['live-debates']),
  });

  ws.send(JSON.stringify({
    type: 'connection',
    status: 'connected',
    clientId,
    message: 'Connected to DebateLive server',
  }));

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'debate_message') {
        await produceMessage('live-debates', data);
      } else if (data.type === 'subscribe') {
        const clientData = clients.get(ws);
        if (data.topics && Array.isArray(data.topics)) {
          data.topics.forEach(topic => {
            if (FLUVIO_TOPICS.includes(topic)) {
              clientData.subscriptions.add(topic);
            }
          });
        }
        ws.send(JSON.stringify({
          type: 'subscription_update',
          subscriptions: Array.from(clientData.subscriptions),
        }));
      } else if (data.type === 'unsubscribe') {
        const clientData = clients.get(ws);
        if (data.topics && Array.isArray(data.topics)) {
          data.topics.forEach(topic => {
            clientData.subscriptions.delete(topic);
          });
        }
        ws.send(JSON.stringify({
          type: 'subscription_update',
          subscriptions: Array.from(clientData.subscriptions),
        }));
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`🔴 WebSocket client disconnected: ${clients.get(ws)?.id}`);
    clients.delete(ws);
  });
});

// 7. API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    fluvio: fluvio ? 'connected' : 'disconnected',
    topics: FLUVIO_TOPICS,
    clients: clients.size,
  });
});

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 8. Start the server
async function startServer() {
  const fluvioConnected = await checkFluvioConnection();
  
  if (!fluvioConnected) {
    console.error('❌ Fluvio setup failed. Exiting.');
    process.exit(1);
  }
  
  const fluvioReady = await connectToFluvio();
  if (!fluvioReady) {
    console.error('❌ Fluvio setup failed. Exiting.');
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`🚀 DebateLive backend server running at http://localhost:${PORT}`);
    console.log(`🔵 WebSocket server ready at ws://localhost:${PORT}`);
  });
}

startServer();

// 9. Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Gracefully shutting down...');

  wss.clients.forEach(client => client.terminate());
  server.close();

  for (const topic in producers) {
    if (producers[topic]) {
      await producers[topic].close();
    }
  }

  for (const topic in consumers) {
    if (consumers[topic]) {
      await consumers[topic].close();
    }
  }

  if (fluvio) {
    await fluvio.close();
  }

  console.log('✅ Shutdown complete');
  process.exit(0);
});
