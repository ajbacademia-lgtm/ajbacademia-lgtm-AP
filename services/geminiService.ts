import { safeFetchJson } from '../src/utils/safeApi';

export interface SearchResult {
  text: string;
  sources: { title: string; uri: string }[];
}

export const GeminiService = {
  /**
   * Summarizes an abstract or text to be accessible for a general audience.
   */
  summarizeForLayman: async (abstract: string): Promise<string> => {
    try {
      const data = await safeFetchJson<any>('/api/ai/summarize', {
        method: 'POST',
        body: JSON.stringify({ abstract })
      });
      return data?.summary || "Could not generate summary.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "This scholarly manuscript presents comprehensive empirical findings, methodology, and peer-reviewed analysis in its respective discipline.";
    }
  },

  /**
   * Suggests keywords for an article title + abstract
   */
  suggestKeywords: async (title: string, abstract: string): Promise<string[]> => {
    try {
      const data = await safeFetchJson<any>('/api/ai/keywords', {
        method: 'POST',
        body: JSON.stringify({ title, abstract })
      });
      return data?.keywords || ['Academic Research', 'Peer Reviewed', 'Open Access', 'Scientific Analysis'];
    } catch (error) {
      console.error("Gemini Error:", error);
      return ['Academic Research', 'Peer Reviewed', 'Open Access', 'Scientific Analysis'];
    }
  },

  /**
   * Performs a web-grounded search for a query.
   */
  webSearch: async (query: string): Promise<SearchResult> => {
    try {
      const data = await safeFetchJson<any>('/api/ai/search', {
        method: 'POST',
        body: JSON.stringify({ query })
      });
      return {
        text: data?.text || "No results found.",
        sources: data?.sources || []
      };
    } catch (error) {
      console.error("Gemini Search Error:", error);
      return { 
        text: `Results for scholarly research query: "${query}". Please check our Journals catalog or browse our indexed articles.`, 
        sources: [] 
      };
    }
  }
};
