from openai import OpenAI
from service.contracts.ai_provider import AIProvider

class OpenAIProvider(AIProvider):
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

    def initiate_inverview(self, prompt: str) -> str:
        print("sending request to openai")
        response = self.client.responses.create(
            model="gpt-4o",
            input=prompt
        )
        return response.output_text