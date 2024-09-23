const fs = require('fs');
const readline = require('readline');
const mammoth = require('mammoth');
const axios = require('axios');

// Hàm đọc nội dung từ file DOCX bằng mammoth
const readDocx = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error reading DOCX file:', error);
    throw error; // Để dừng chương trình khi đọc file thất bại
  }
};

// Tải dữ liệu
const filePath = 'D:\\NCKH\\case study 1.docx';  // Thay bằng đường dẫn đến file của bạn
let documentText = '';

readDocx(filePath).then(text => {
  documentText = text;
  console.log('Nội dung tài liệu đã được đọc thành công.');

  // Thiết lập giao diện chat
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("\nChào mừng bạn đến với chatbot AI! (Nhập 'thoát' để kết thúc)");

  rl.on('line', async (userInput) => {
    if (userInput.toLowerCase() === 'thoát') {
      rl.close();
    } else {
      const prompt = `Dựa trên nội dung sau:\n${documentText}\nTrả lời câu hỏi: ${userInput}`;
      const aiResponse = await askGenerativeAI(prompt);
      console.log(`AI: ${aiResponse}`);
    }
  });
}).catch(error => {
  console.error('Có lỗi xảy ra khi đọc tài liệu:', error);
});

// Hàm gửi câu hỏi tới Google Generative AI API
const askGenerativeAI = async (prompt) => {
  const API_KEY = 'AIzaSyComkhfelpjniIQX8l7RB43N94tBO3rovc';  // Thay bằng API key thực tế của bạn
  const url = `https://api.generativeai.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${API_KEY}`;

  const data = {
    prompt: prompt,
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };

  try {
    const response = await axios.post(url, data);
    return response.data.candidates[0].output;
  } catch (error) {
    console.error('Error generating text:', error);
    return 'Đã xảy ra lỗi trong quá trình gọi API';
  }
};
