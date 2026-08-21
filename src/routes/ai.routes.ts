import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// POST /api/ai/summarize
router.post('/summarize', async (req: Request, res: Response) => {
  try {
    const { abstract } = req.body;
    if (!abstract || typeof abstract !== 'string') {
      return res.status(400).json({ error: 'Abstract text is required' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.json({ 
        summary: 'This scholarly manuscript presents comprehensive empirical findings, methodology, and peer-reviewed analysis in its respective discipline.' 
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Please summarize the following academic abstract for a general audience (layman summary). Keep it under 3 sentences.\n\nAbstract: ${abstract}`,
    });

    return res.json({ 
      summary: response.text?.trim() || 'Could not generate summary.' 
    });
  } catch (err: any) {
    console.error('AI Summarize Error:', err);
    return res.status(500).json({ error: 'Failed to generate summary', message: err?.message });
  }
});

// POST /api/ai/keywords
router.post('/keywords', async (req: Request, res: Response) => {
  try {
    const { title, abstract } = req.body;
    const ai = getAiClient();
    if (!ai) {
      return res.json({ keywords: ['Academic Research', 'Peer Reviewed', 'Open Access', 'Scientific Analysis'] });
    }

    const prompt = `Generate 5 academic keywords for the following article. Return ONLY the keywords as a comma-separated list.\n\nTitle: ${title || ''}\nAbstract: ${abstract || ''}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    const keywords = text.split(',').map(s => s.trim()).filter(Boolean);
    return res.json({ keywords });
  } catch (err: any) {
    console.error('AI Keywords Error:', err);
    return res.status(500).json({ error: 'Failed to generate keywords', message: err?.message });
  }
});

// POST /api/ai/search
router.post('/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        text: `Results for scholarly research query: "${query}". Please check our Journals catalog or browse our index.`,
        sources: []
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Search for and provide comprehensive scholarly information about: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || 'No results found.';
    const sources: { title: string; uri: string }[] = [];

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || chunk.web.uri,
            uri: chunk.web.uri
          });
        }
      });
    }

    // De-duplicate sources
    const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

    return res.json({
      text,
      sources: uniqueSources
    });
  } catch (err: any) {
    console.error('AI Search Error:', err);
    return res.status(500).json({ error: 'Search failed', message: err?.message });
  }
});

export default router;
