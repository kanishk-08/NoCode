import { GoogleGenAI } from "@google/genai";
import { Expense, Category } from '../types';

export const getFinancialAdvice = async (
  expenses: Expense[],
  categories: Category[],
  userName: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare data summary for the model
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryBreakdown = categories.map(cat => {
      const spent = expenses
        .filter(e => e.categoryId === cat.id)
        .reduce((sum, e) => sum + e.amount, 0);
      return `${cat.name}: Spent $${spent} / Budget $${cat.budget}`;
    }).join('\n');

    const prompt = `
      You are a helpful, professional, and concise financial advisor for a user named ${userName}.
      Analyze the following financial data:
      
      Total Spent: $${totalSpent}
      
      Category Breakdown:
      ${categoryBreakdown}
      
      Please provide 3 personalized, actionable tips or insights based on this data. 
      Focus on where they are over budget or doing well. 
      Keep the tone encouraging but practical. 
      Format the output as a clean list. Do not use markdown bolding too aggressively.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "I couldn't generate advice at this moment.";
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "Sorry, I'm having trouble connecting to the financial brain right now. Please try again later.";
  }
};