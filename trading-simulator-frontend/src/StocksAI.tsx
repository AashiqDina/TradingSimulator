import { HfInference } from '@huggingface/inference'


const hf = new HfInference("apikey")

export async function StocksAI(_Prompt: String, _StockData: any){
    try {

        const formattedStockData = JSON.stringify(_StockData, null, 2);
        const SystemPrompt = `You are an AI assistant for a Trading Simulator website. You have access to the following stock data: ${formattedStockData}. Your role is to help users by answering questions, offering insights, and providing helpful explanations based on this information. You may use any data you know about this stock/company to help answer. If possible, try to keep your responses concise—ideally just a couple of sentences. If data is missing ignore it and aswer the question`;
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SystemPrompt },
                { role: "user", content: `With this current Data ${_StockData}. Can you answer ${_Prompt}` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch {
        console.error("Somethingwent wrong")
    }
}