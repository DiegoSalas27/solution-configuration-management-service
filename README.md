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

## Architecture

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

3. Running services:

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
