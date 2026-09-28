import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, isMongoConnected } from './config/database';
import chatRoutes from './routes/chatRoutes';
import ticketRoutes from './routes/ticketRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// API Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    product: 'Nexura AI Customer Support Agent',
    database: isMongoConnected ? 'MongoDB' : 'In-Memory Fast Store',
    demoMode: !process.env.GEMINI_API_KEY && !process.env.AI_API_KEY ? 'Enabled' : 'Hybrid (API Active)',
    timestamp: new Date().toISOString(),
  });
});

// Register API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server and Connect DB
const startServer = async () => {
  const mongoStatus = await connectDatabase();

  app.listen(PORT, () => {
    const hasApiKey = Boolean(process.env.GEMINI_API_KEY || process.env.AI_API_KEY);
    console.log('\n======================================================');
    console.log('🤖 NEXURA AI — AUTONOMOUS CUSTOMER SUPPORT AGENT');
    console.log('   "Support that understands. Resolves. Remembers."');
    console.log('======================================================');
    console.log(`Server running on:`);
    console.log(`http://localhost:${PORT}`);
    console.log(`\nDatabase:`);
    console.log(mongoStatus ? 'Connected (MongoDB)' : 'Connected (In-Memory Fast Store with Seeded Records)');
    console.log(`\nDemo Mode:`);
    console.log(hasApiKey ? 'Hybrid (Live LLM with Demo Engine Fallback)' : 'Enabled (Zero-API Key Hackathon Mode)');
    console.log('======================================================\n');
  });
};

startServer();
