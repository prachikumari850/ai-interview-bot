from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import router
from app.db import Base, engine
from app.services.llm import LLMError

Base.metadata.create_all(engine)

app = FastAPI(title="AI Interview Bot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)


@app.exception_handler(LLMError)
async def llm_error_handler(request: Request, error: LLMError):
    return JSONResponse(status_code=502, content={"detail": str(error)})


@app.get("/api/health")
def health():
    return {"status": "ok"}