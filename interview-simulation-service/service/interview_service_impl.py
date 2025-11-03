from domain.contracts.interview_service import InterviewService
from service.contracts.ai_provider import AIProvider

class InterviewServiceImpl(InterviewService):
    def __init__(self, ai: AIProvider) -> None:
        self.ai = ai

    def initiate_interview(self, prompt: str) -> str:
        """
        Initiates an interview using an LLM given in a SimulationConfiguration.
        """
        return self.ai.initiate_inverview(prompt)