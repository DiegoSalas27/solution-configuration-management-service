from dataclasses import dataclass

@dataclass
class LLM:
    """
    Represents the master table for LLMS which specifies names and versions.
    """
    id: int
    name: str
    version: str
