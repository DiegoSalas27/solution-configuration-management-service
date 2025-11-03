from anthropic import Anthropic
from service.contracts.ai_provider import AIProvider

class ClaudeProvider(AIProvider):
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)

    def initiate_inverview(self, prompt: str) -> str:
        response = self.client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            messages=[{
                "role": "user", "content": prompt
            }]
        )
        return response.content[0].text