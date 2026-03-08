from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.hidden import router as hidden_router
from app.routers.outreach import router as outreach_router
from app.routers.rankings import router as rankings_router
from app.routers.resume_match import router as resume_match_router
from app.routers.startups import router as startups_router

app = FastAPI(title="Startup Scout API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


app.include_router(startups_router)
app.include_router(rankings_router)
app.include_router(outreach_router)
app.include_router(hidden_router)
app.include_router(resume_match_router)
