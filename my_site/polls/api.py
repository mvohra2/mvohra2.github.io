from openai import OpenAI
import os
from dotenv import load_dotenv

from .models import Question  # Assuming you have a Django model to store this data

def process_response_text(response_text):

    load_dotenv("app.env")
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