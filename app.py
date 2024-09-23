import os
from flask import Flask, request, render_template
import google.generativeai as genai
from docx import Document

# Cấu hình API key trực tiếp
API_KEY = "AIzaSyComkhfelpjniIQX8l7RB43N94tBO3rovc"  # Thay bằng API key thực tế của bạn
genai.configure(api_key=API_KEY)

# Hàm đọc nội dung từ file DOCX
def read_docx(file_path):
    doc = Document(file_path)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text

# Tải dữ liệu
file_path = "case study 1.docx"  # Thay bằng đường dẫn đến file của bạn
document_text = read_docx(file_path)

# Tạo cấu hình cho mô hình
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Tạo mô hình GenerativeModel
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# Khởi tạo Flask
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    user_input = request.form['user_input']
    if user_input.lower() == 'thoát':
        return "Kết thúc phiên trò chuyện."
    
    prompt = f"Dựa trên nội dung sau:\n{document_text}\nTrả lời câu hỏi: {user_input}"
    
    try:
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(prompt)
        return response.text
    except Exception as e:
        return f"Đã xảy ra lỗi: {e}"

if __name__ == '__main__':
    app.run(debug=True)
