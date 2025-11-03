from abc import ABC, abstractmethod

class AIProvider(ABC):
    @abstractmethod
    def initiate_inverview(self, prompt: str) -> str:
        """
        Initiates interview using selected AI Provider.
        """
        pass
