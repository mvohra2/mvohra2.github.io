from openai import OpenAI
import os

from .models import Question  # Assuming you have a Django model to store this data

def process_response_text(response_text):
    
    api_key = os.getenv("OPENAI_API_KEY")
    
    client = OpenAI(api_key=api_key)
    
    assistant = client.beta.assistants.create(
    name="Text Interpretor",
    instructions="Extract a list verbs, people mentioned, and emotions from the given text.",
    tools=[{"type": "code_interpreter"}],
    model="gpt-4-turbo-preview",
    )
    thread = client.beta.threads.create()

    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=response_text
    )

    run = client.beta.threads.runs.create_and_poll(
    thread_id=thread.id,
    assistant_id=assistant.id,
    instructions="Extract the main verbs, people mentioned, and emotions from the given text. \
  Return lists in the format: \
- A list of a maximum of 3 main themes or actions (e.g., [dinosaurs, running]), \
- A list of a maximum of 3 mentioned people (e.g., [Alice, Bob]), \
- A list of a maximum of 3 emotions (e.g., [happy, sad]). \
Format your response like [] [] []. Do not repeat words. Do not include 'I'"
    )


    if run.status == 'completed': 
        messages = client.beta.threads.messages.list(
            thread_id=thread.id
        )
        response = messages.data[0].content[0].text.value
        l1 = response.split(']')
        actions = l1[0].replace('[', '').replace(' ', '').split(',')
        people = l1[1].replace('[', '').replace(' ', '').split(',')
        emotions = l1[2].replace('[', '').replace(' ', '').split(',')
        if people == ['']:
            people = []
        if actions == ['']:
            actions = []
        if emotions == ['']:
            emotions = []

        return actions, people, emotions
    
    return [], [], []


# def process_response_text(response_text, question_id):
    
#     # openai.api_key = settings.OPENAI_API_KEY
#     try:
#         response = openai.ChatCompletion.create(
#             model="gpt-4",
#             messages=[
#                 {"role": "system", "content": "Extract the main verbs, people mentioned, and emotions from the given text."},
#                 {"role": "user", "content": response_text}
#             ],
#             max_tokens=150
#         )
        
#         if 'choices' in response and response['choices']:
#             messages = response['choices'][0].get('messages', [])
#             if messages and messages[-1]['role'] == 'assistant':
#                 output_text = messages[-1]['content']
#                 lines = output_text.split('\n')
#                 actions = lines[0].split(': ')[1].strip('[]').replace("'", "").split(', ')
#                 people = lines[1].split(': ')[1].strip('[]').replace("'", "").split(', ')
#                 emotions = lines[2].split(': ')[1].strip('[]').replace("'", "").split(', ')
                
#                 # Assuming you have a Django model instance to update
#                 question = Question.objects.get(id=question_id)
#                 question.actions = actions
#                 question.people = people
#                 question.emotions = emotions
#                 question.save()

#                 return actions, people, emotions
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         # Handle or log the error appropriately

#     return ['chased'], ['scared'], []