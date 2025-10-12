const { OpenAI } = require('openai');

async function testOpenAI() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    console.log('🧪 Testing OpenAI API...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Test message" }],
      max_tokens: 50
    });

    console.log('✅ OpenAI API working:', completion.choices[0].message.content);
  } catch (error) {
    console.error('❌ OpenAI Error:', error.message);
    if (error.code === 'insufficient_quota') {
      console.error('💳 Billing issue: Add payment method to OpenAI account');
    }
    if (error.code === 'invalid_api_key') {
      console.error('🔑 API key issue: Check OpenAI dashboard');
    }
  }
}

testOpenAI();
