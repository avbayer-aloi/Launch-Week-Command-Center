import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface AIPromptRequest {
  type: 'announcement' | 'social' | 'developer' | 'faq' | 'competitive'
  inputs: Record<string, string>
}

export async function generateAIContent(request: AIPromptRequest): Promise<string> {
  const prompts = {
    announcement: `Create a launch announcement for a feature called "${request.inputs.featureName}" with key benefit: "${request.inputs.keyBenefit}" and technical details: "${request.inputs.techDetails}". 

Format as a professional product announcement with:
- Compelling headline
- Brief overview
- Key benefits (2-3 bullet points)
- Technical highlights
- Call to action

Keep it concise and exciting, around 200-300 words.`,

    social: `Create social media content variants for a launch titled "${request.inputs.title}" with description: "${request.inputs.description}".

Generate:
1. **Twitter/X Post** (under 280 chars, include relevant hashtags)
2. **LinkedIn Post** (professional tone, 2-3 paragraphs)
3. **Dev.to Snippet** (developer-focused, technical angle)

Make each variant engaging and appropriate for its platform.`,

    developer: `Transform this feature description into developer-focused messaging: "${request.inputs.description}"

Create compelling copy that emphasizes:
- Technical benefits and capabilities
- Developer experience improvements
- Integration possibilities
- Performance or efficiency gains

Target audience: Software engineers and technical decision makers.`,

    faq: `Generate a comprehensive FAQ section for this feature: "${request.inputs.featureInfo}"

Create 5-7 frequently asked questions covering:
- What it is and how it works
- Key benefits and use cases
- Technical requirements or limitations
- Pricing or availability
- Implementation guidance

Format as Q&A pairs with clear, helpful answers.`,

    competitive: `Analyze positioning against competitor "${request.inputs.competitor}" for our feature: "${request.inputs.feature}"

Provide:
- Key differentiators (3-4 points)
- Competitive advantages
- Positioning recommendations
- Messaging suggestions

Focus on unique value propositions and market positioning.`
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompts[request.type]
        }
      ]
    })

    return response.content[0].type === 'text' ? response.content[0].text : 'Error generating content'
  } catch (error) {
    console.error('Error generating AI content:', error)
    throw new Error('Failed to generate AI content')
  }
}