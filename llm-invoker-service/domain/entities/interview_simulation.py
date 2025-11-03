from dataclasses import dataclass
from domain.value_objects.simulation_configuration import SimulationConfiguration

@dataclass
class IntervewSimulation:
    """
    InterviewSimulation entity encapsultates all data attributes required to initiate interviews 
    leveraging LLMs based on a given configuration.
    """
    id: int
    name: str
    configuration: SimulationConfiguration
