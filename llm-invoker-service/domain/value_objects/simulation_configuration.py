from uuid import UUID
from dataclasses import dataclass
from enum import Enum

class Model(str, Enum):
    OPENAI = "openai"
    CLAUDE = "claude"

@dataclass(frozen=True)
class SimulationConfiguration:
    """
    The configuration used for an interview simulation which contains primary and secondary LLMs to use
    and the expected latency at which the primary model should peform.
    """
    id: UUID
    primary_model: Model
    secondary_model: Model
    expected_max_latency: int # expected max latency in milliseconds
