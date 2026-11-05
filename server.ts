import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for AI sales summary
app.post('/api/sales/summary', async (req, res) => {
  try {
    const { regionalQ2Q3Data, totalQ2Revenue, totalQ3Revenue } = req.body;

    const prompt = `You are an expert sales data analyst. Based strictly on the following calculated sales performance numbers for Q2 and Q3 across regions, write a precise three-sentence summary explaining which region changed most from Q2 to Q3, and why, using only numbers the app calculated.
    
Calculated Data:
Total Q2 Revenue: $${totalQ2Revenue?.toLocaleString() || 'N/A'}
Total Q3 Revenue: $${totalQ3Revenue?.toLocaleString() || 'N/A'}

Regional Q2 to Q3 Breakdown:
${JSON.stringify(regionalQ2Q3Data, null, 2)}

Strict Rules:
1. You MUST write EXACTLY THREE sentences.
2. State clearly which region changed the most in revenue (absolute and percentage) from Q2 to Q3.
3. Explain the reason or contributing factors using ONLY the numbers and calculated changes provided in the data above.
4. Do not invent any outside numbers, facts, or assumptions.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a professional corporate finance and sales analyst. Output strictly a three-sentence summary based exclusively on the provided data numbers. No bullet points, exactly three sentences.',
      }
    });

    const summary = response.text || 'Unable to generate summary at this time.';
    res.json({ summary });
  } catch (error: any) {
    console.error('Error generating AI summary:', error);
    res.status(500).json({ error: error.message || 'Failed to generate AI summary' });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
