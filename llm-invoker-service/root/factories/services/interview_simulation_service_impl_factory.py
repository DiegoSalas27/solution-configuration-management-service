from domain.contracts.interview_service import InterviewService
from service.interview_service_impl import InterviewServiceImpl
from service.contracts.ai_provider import AIProvider

def make_interview_simulation_service_impl(ai_provider: AIProvider) -> InterviewService:
    return InterviewServiceImpl(ai_provider)