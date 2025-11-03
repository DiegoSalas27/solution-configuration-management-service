# Take2 AI Home Assessment Solution Diego Salas Noain

### Summary

This repository contains the solution for Take2 AI Home Assessment. This monorepo contains both NodeJS (state management) service and Python (interview simulation service) projects. Both projects call OpenAPI GPT-4o as well as Claude Sonnet 4.x APIs. The state management service is in charge of performing health checks on LLM APIs which can be done in two different ways: through an API call, and through a health check monitor which runs every minute to ensure LLM APIs are reachable. On the other hand, the interview simulation service receives a simulation configuration which includes the model id (stored in SQLite `llm` master table) in order to decide if it should use a secondary model instead of the primary model when the primary model is unhealthy which happens when the model id is found in the `fall_back_event` table.

## Solid Principles
* Single responsibility principle:
  * Modules have a single reason to change.
* Open closed principle:
  * Used decorator pattern to extend the functionality of my controller to handle global exceptions without modifying the controller code.
* Interface segregation principle:
  * Every controller, service and repository implement in full their interfaces.
* Dependency Inversion principle:
  * Depdnencies are abstractions rather than croncrete classes

## Design Patterns
* Factory
* Decorator
* Adapter
* Dependency Injection
* Composition root

## Methodologies
* TDD
* Clean architecture
* Conventional Commits
* Object Oriented Design

## Features
* Error handling
* Unit test
* Coverage test
* Extensible code

## Tech Stack
* Typescript
* NodeJS / Express
* Python / Fast API
* SQLite

## Environment variables
```
OPENAI_API_KEY          # API Key for OpenAI 
ANTHROPIC_API_KEY       # API Key for Anthropic
```

## Testing

1. Clone this project.
2. create .env file in the root of the workspace and add these values (will be sent via email)
```
OPENAI_API_KEY=<API Key>
ANTHROPIC_API_KEY=<API Key>
```
3. Install dependencies:

### state management service
```
cd state-management-service
git init (issue with husky needs to have .git folder in the root of state-management-service. This is to quickly unblock yourself)
npm install
```

### interview simulation service
```
cd interview-simulation-service
pip install -r requirements.txt
```

4. Running services:

### state management service
```
cd state-management-service
npm run build (transpiles typescript to javascript)
npm run start:dev
```

### interview-simulation-service
```
cd interview-simulation-service
python main.py
```

5. Test with postman

### state management service
method: `POST`
path: `http://127.0.0.1:3001/api/llms/check-health`
body:
```
{
    "company": "openai",
    "model": "gpt-4o"
}
```
or
```
{
    "company": "anthropic",
    "model": "claude-sonnet-4-5"
}
```

### To test a model being unreachable:
1. Uncomment the following lines of code: https://github.com/DiegoSalas27/solution-configuration-management-service/blob/main/state-management-service/src/service/impl/llm-service-impl.ts#L18-L20
2. Build the project again: `npm run build`
3. Run the server: `npm run start:dev`

By, uncommenting the code as mentioned above, a `FallBackEvent saved` will appear in the logs when the health check monitor runs:
```
FallBackEvent saved:  {
  "create_date": "2025-11-03 01:10:25.352000",
  "llm": "4de44421-e8da-4d67-88ff-e3f8e42bab80", # <- copy this id and use it in the `simulation_configuration` payload for the `initiate_interview` endpoint.
  ...
```

### interview simulation service
method: `POST`
path: `http://127.0.0.1:3000/initiate_interview`
body:
```
{
    "simulation_configuration": {
        "id": "4de44421-e8da-4d67-88ff-e3f8e42bab80", # <- If you need to test the secondary model being used, paste here the primary model id which you should have obtained from the previous step.
        "primary_model": "claude",
        "secondary_model": "openai",
        "expected_max_latency": 200
    },
    "prompt": "What is your name?"
}
```

Once called, the system will try to call the primary model it the `simulation_configuration.id` is not found in the `fall_back_event` table; otherwise the secondary model will be called.

## Repository structure
The solution is structured as follows:
```

├── src                 # Source files of the solution
    ├── service         # Handles all business logic of the solution
    ├── domain          # Defines business logic protocols, models, and errors
    ├── infrastructure  # Implements third-party libraries, access db
    ├── main            # Performs composition root by creating a dependency graph
    └── presentation    # Handles incoming requests
```
