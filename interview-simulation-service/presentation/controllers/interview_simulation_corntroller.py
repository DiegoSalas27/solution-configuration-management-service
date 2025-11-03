from dataclasses import dataclass

from domain.contracts.interview_service import InterviewService

@dataclass
class InterviewSimulationController:
    def __init__(self, interview_service: InterviewService):
        self.interview_service = interview_service

    def handle_initiate_interview(self, prompt: str) -> str:
        if not prompt or prompt.strip() == "":
            raise ValueError("Prompt is empty")
        return self.interview_service.initiate_interview(prompt)
        
    
