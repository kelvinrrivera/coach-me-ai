import OpenAI from 'openai';
import { supabase } from '../lib/supabase';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface CoachProfile {
  name: string;
  expertise: string[];
  personality: string;
  coaching_style: string;
}

export const openaiService = {
  async conductInitialInterview(goalDescription: string) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert AI interviewer for a coaching platform. Your role is to:
              1. Ask detailed questions to understand the user's goal
              2. Assess their current situation and challenges
              3. Understand their motivation and commitment level
              4. Evaluate their available resources and constraints
              5. Determine the most suitable type of coach for their needs
              
              Format your responses as a conversation, asking one question at a time and waiting for the user's response.`
          },
          {
            role: "user",
            content: goalDescription
          }
        ],
        temperature: 0.7
      });

      return completion.choices[0]?.message?.content;
    } catch (error) {
      console.error('OpenAI Interview Error:', error);
      throw new Error('Failed to conduct initial interview');
    }
  },

  async createCoachAssistant(interviewData: string, goalDetails: any): Promise<{ assistant_id: string, coach: CoachProfile }> {
    try {
      // First, determine the ideal coach profile
      const coachProfileCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Based on the interview data, create a detailed coach profile that would be perfect for this client. Include:
              1. A unique and appropriate name for the coach
              2. Their areas of expertise
              3. Personality traits
              4. Coaching style and approach
              
              Return the response as a JSON object with the following structure:
              {
                "name": "Coach's name",
                "expertise": ["area1", "area2", ...],
                "personality": "description",
                "coaching_style": "description"
              }`
          },
          {
            role: "user",
            content: interviewData
          }
        ],
        temperature: 0.8
      });

      const coachProfile: CoachProfile = JSON.parse(coachProfileCompletion.choices[0]?.message?.content || '{}');

      // Create a file with the interview data
      const interviewFile = await openai.files.create({
        file: new Blob([interviewData], { type: 'text/plain' }),
        purpose: 'assistants'
      });

      // Create the assistant with the coach's profile
      const assistant = await openai.beta.assistants.create({
        name: coachProfile.name,
        instructions: `You are ${coachProfile.name}, a professional coach with expertise in ${coachProfile.expertise.join(', ')}. 
          Your personality is ${coachProfile.personality} and your coaching style is ${coachProfile.coaching_style}.
          
          You have access to the client's initial interview and goal details. Your role is to:
          1. Create a detailed roadmap to help the client achieve their goal
          2. Break down the goal into manageable milestones
          3. Provide ongoing support, motivation, and accountability
          4. Adjust the plan based on the client's progress and feedback
          
          Always maintain your unique coaching personality and style in your interactions.`,
        model: "gpt-4-turbo-preview",
        tools: [{ type: "retrieval" }],
        file_ids: [interviewFile.id]
      });

      return {
        assistant_id: assistant.id,
        coach: coachProfile
      };
    } catch (error) {
      console.error('OpenAI Assistant Creation Error:', error);
      throw new Error('Failed to create coach assistant');
    }
  },

  async interactWithCoach(assistantId: string, message: string) {
    try {
      const thread = await openai.beta.threads.create();
      
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: message
      });

      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId
      });

      // Poll for completion
      let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      while (runStatus.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];

      return lastMessage.content[0].text.value;
    } catch (error) {
      console.error('OpenAI Interaction Error:', error);
      throw new Error('Failed to interact with coach');
    }
  }
};