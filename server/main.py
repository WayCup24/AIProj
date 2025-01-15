from flask import Flask, request, jsonify
import json
from openai import OpenAI

api = "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"

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=api
)

req = "добавь занятие в тренажёрном зале в свободный вечер, продолжительностью в час"

empty_schedule = [
    { "name" :"Понедельник", "date":"13.01.2024", "tasks":[{
          "duration": 60,
          "endTime": "21:00",
          "startTime": "20:00",
          "task": "Плавание"
        }]},
    { "name": "Вторник", "date": "14.01.2024", "tasks": [{
          "duration": 60,
          "endTime": "21:00",
          "startTime": "20:00",
          "task": "Плавание"
        }] },
    { "name": "Среда", "date": "15.01.2024", "tasks": [{
          "duration": 60,
          "endTime": "21:00",
          "startTime": "20:00",
          "task": "Плавание"
        }] },
    { "name": "Четверг", "date": "16.01.2024", "tasks": [] },
    { "name": "Пятница", "date": "17.01.2024", "tasks": [{
          "duration": 60,
          "endTime": "21:00",
          "startTime": "20:00",
          "task": "Плавание"
        }] },
    { "name": "Суббота", "date": "18.01.2024", "tasks": [{
          "duration": 60,
          "endTime": "21:00",
          "startTime": "20:00",
          "task": "Плавание"
        }] },
    { "name": "Воскресенье", "date": "19.01.2024", "tasks": [{
          "duration": 60,
          "endTime": "21:00",
          "startTime": "20:00",
          "task": "Плавание"
        }]}
]

filled_schedule = {
    "answer": "Готово!",
    "days": [ 
        { 
            "name": "Понедельник", "date": "13.01.2024", "tasks": [ 
                { "task": "Покушать", "startTime": "09:00", "endTime": "10:00", "duration": 60 },
                { "task": "", "startTime": "", "endTime": "", "duration": 0 }
            ]
        },
        {
            "name": "Вторник", "date": "14.01.2024", "tasks": [ 
                { "task": "", "startTime": "", "endTime": "", "duration": 0 },
                { "task": "", "startTime": "", "endTime": "", "duration": 0 }
            ]
        },
        {
            "name": "Среда", "date": "15.01.2024", "tasks": [ 
                { "task": "", "startTime": "", "endTime": "", "duration": 0 },
                { "task": "", "startTime": "", "endTime": "", "duration": 0 }
            ]
        },
        {
            "name": "Четверг", "date": "16.01.2024", "tasks": [ 
                { "task": "", "startTime": "", "endTime": "", "duration": 0 },
                { "task": "", "startTime": "", "endTime": "", "duration": 0 }
            ]
        },
        {
            "name": "Пятница", "date": "17.01.2024", "tasks": [ 
                { "task": "", "startTime": "", "endTime": "", "duration": 0 },
                { "task": "", "startTime": "", "endTime": "", "duration": 0 }
            ]
        },
        {
            "name": "Суббота", "date": "18.01.2024", "tasks": [ 
                { "task": "", "startTime": "", "endTime": "", "duration": 0 },
                { "task": "", "startTime": "", "endTime": "", "duration": 0 }
            ]
        },
        {
            "name": "Воскресенье", "date": "19.01.2024", "tasks": [ 
                { "task": "", "startTime": "", "endTime": "", "duration": 0 },
                { "task": "", "startTime": "", "endTime": "", "duration": 0 }
            ]
        } 
    ]
}

prompt = f"Измени текущее расписание, чтобы оно удовлетворяло запросу: \"{req}\". Текущее расписание: {json.dumps(empty_schedule, ensure_ascii=False)}. Отвечай такой структурой (тут данные заполнены для примера, убедись, что не используешь данные из примера и что не добавляешь случайно новые дни, оставь tasks пустым, если задач на день нет, не добавляй пустые задачи. убедись, что структура json в твоём ответе правильная и используй двойные кавычки вместо одинарных): {json.dumps(filled_schedule, ensure_ascii=False)}"

app = Flask(__name__)

@app.route("/")
def home():
    completion = client.chat.completions.create(
        extra_headers={},
        model="meta-llama/llama-3.2-90b-vision-instruct:free",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    )
    resp = completion.choices[0].message.content
    try:
        resp = json.loads(resp)
    except:
        print("ошибка")
    print(resp)
    return resp

@app.route("/api", methods=["POST"])
def api():
    data = request.get_json()
    requ = data.get("request")
    sched = data.get("schedule")
    prom = f"Измени текущее расписание, чтобы оно удовлетворяло запросу: \"{requ}\". Текущее расписание: {json.dumps(sched, ensure_ascii=False)}. Отвечай такой структурой (тут данные заполнены для примера, убедись, что не используешь данные из примера и что не добавляешь случайно новые дни, оставь tasks пустым, если задач на день нет, не добавляй пустые задачи. убедись, что структура json в твоём ответе правильная и используй двойные кавычки вместо одинарных): {json.dumps(filled_schedule, ensure_ascii=False)}"
    completion = client.chat.completions.create(
        extra_headers={},
        model="meta-llama/llama-3.2-90b-vision-instruct:free",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prom
                    }
                ]
            }
        ]
    )
    resp = completion.choices[0].message.content
    try:
        resp = json.loads(resp)
    except:
        print("ошибка")
    print(resp)
    return resp

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)