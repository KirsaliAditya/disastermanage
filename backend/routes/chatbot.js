const express = require('express');
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require('langchain_google_genai');
const { FAISS } = require('langchain_community.vectorstores');
const { load_qa_chain, PromptTemplate } = require('langchain');
const router = express.Router();
require('dotenv').config();

const embeddings = new GoogleGenerativeAIEmbeddings({ model: 'models/text-embedding-004' });
const model = new ChatGoogleGenerativeAI({ model: 'gemini-pro', temperature: 0.3 });
const promptTemplate = new PromptTemplate({
    template: `Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:`,
    inputVariables: ['context', 'question']
});
const chain = load_qa_chain(model, { chain_type: 'stuff', prompt: promptTemplate });

// Load the vector store
const vectorStore = FAISS.load_local('faiss_index', embeddings, { allow_dangerous_deserialization: true });

router.post('/chat', async (req, res) => {
    const { user_message } = req.body;

    try {
        const docs = vectorStore.similarity_search(user_message);

        const response = await chain.run({
            input_documents: docs,
            question: user_message
        });

        res.json({ answer: response.output_text });
    } catch (error) {
        res.status(500).send('Error processing the message.');
    }
});

// Add this route in scraperRoute.js or a separate file in your routes folder
router.get('/scrapedData', async (req, res) => {
    try {
      const data = await ScrapedData.find(); // Fetch all scraped data
      res.json(data);
    } catch (error) {
      res.status(500).send('Error fetching scraped data: ' + error);
    }
  });
  

module.exports = router;
