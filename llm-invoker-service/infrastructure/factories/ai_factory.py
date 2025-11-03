import os
from domain.value_objects.simulation_configuration import Model
from service.contracts.ai_provider import AIProvider
from infrastructure.providers.openai_provider import OpenAIProvider
from infrastructure.providers.claude_provider import ClaudeProvider

def get_env_var(name: str) -> str:
        value = os.getenv(name)
        if not value or not value.strip():
            raise RuntimeError("Something went wrong.")
        return value

class AiFactory:
    @staticmethod
    def create(provider_name: Model) -> AIProvider:
        if provider_name == Model.OPENAI.value:
            api_key = get_env_var("OPEN_API_KEY")
            return OpenAIProvider(api_key=api_key)
        
        if provider_name == Model.CLAUDE.value:
            api_key = get_env_var("ANTHROPIC_API_KEY")
            return ClaudeProvider(api_key=api_key)
        
        raise ValueError(f"Unknown AI provider: {provider_name}")