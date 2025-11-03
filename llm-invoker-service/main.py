import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from pathlib import Path

from domain.value_objects.simulation_configuration import SimulationConfiguration
from infrastructure.factories.ai_factory import AiFactory
from infrastructure.repositories.sqlite_fallback_event_repository import  SQLiteFallBackEventRepository
from root.factories.controllers.interview_simulation_controller_factory import make_interview_simulation_controller

dotenv_path = Path('../.env')
load_dotenv(dotenv_path=dotenv_path)

app = FastAPI()
class InitiateInterviewRquest(BaseModel):
    simulation_configuration: SimulationConfiguration
    prompt: str
    
@app.post("/initiate_interview")
def initiate_interview(req: InitiateInterviewRquest):
    # Check that primary model is healthy
    result = SQLiteFallBackEventRepository.getFallBackEvent(req.simulation_configuration.id)
    primary_model = req.simulation_configuration.primary_model
    # Use secondary model if there a fallback event exists for a given llm model id
    if len(result) > 0:
        primary_model = req.simulation_configuration.secondary_model
    print(f"result: {result}")
    ai_provider = AiFactory.create(primary_model)
    interview_simulation_controller = make_interview_simulation_controller(ai_provider)
    response = interview_simulation_controller.handle_initiate_interview(req.prompt)
    return {
      "response": response
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=3000)