from abc import ABC, abstractmethod

class InterviewService(ABC):
    @abstractmethod
    def initiate_interview(self, prompt: str) -> str:
        """
        Initiates an interview using an LLM given in a SimulationConfiguration.
        """
        pass
