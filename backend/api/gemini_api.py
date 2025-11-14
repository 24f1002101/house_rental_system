import google.generativeai as genai

genai.configure(api_key="")


for m in genai.list_models():
    print(m.name)
def generate_response(query):
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(query)
        return response.text
    except Exception as e:
        print("Gemini Error:", e)
        raise e