from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.hidden import router as hidden_router
from app.routers.outreach import router as outreach_router
from app.routers.rankings import router as rankings_router
from app.routers.resume_match import router as resume_match_router
from app.routers.startups import router as startups_router
from app.routers.legitimacy import router as legitimacy_router
from app.routers.recruiter_check import router as recruiter_check_router
from app.routers.company_check import router as company_check_router
from app.routers.applications import router as applications_router
from app.routers.tailoring import router as tailoring_router
from app.routers.tracker import router as tracker_router
from app.routers.interview_prep import router as interview_prep_router
from app.routers.dashboard import router as dashboard_router
from app.routers.planner import router as planner_router
from app.routers.analytics import router as analytics_router
from app.routers.tasks import router as tasks_router
from app.routers.priorities import router as priorities_router
from app.routers.daily_brief import router as daily_brief_router
from app.routers.nudges import router as nudges_router
from app.routers.reminders import router as reminders_router
from app.routers.preferences import router as preferences_router
from app.routers.activity_feed import router as activity_feed_router
from app.routers.network import router as network_router
from app.routers.connections import router as connections_router
from app.routers.outreach_hub import router as outreach_hub_router
from app.routers.warm_paths import router as warm_paths_router
from app.routers.relationship_health import router as relationship_health_router

app = FastAPI(title="Startup Scout API", version="0.6.0")

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
app.include_router(legitimacy_router)
app.include_router(recruiter_check_router)
app.include_router(company_check_router)
app.include_router(applications_router)
app.include_router(tailoring_router)
app.include_router(tracker_router)
app.include_router(interview_prep_router)
app.include_router(dashboard_router)
app.include_router(planner_router)
app.include_router(analytics_router)
app.include_router(tasks_router)
app.include_router(priorities_router)
app.include_router(daily_brief_router)
app.include_router(nudges_router)
app.include_router(reminders_router)
app.include_router(preferences_router)
app.include_router(activity_feed_router)
app.include_router(network_router)
app.include_router(connections_router)
app.include_router(outreach_hub_router)
app.include_router(warm_paths_router)
app.include_router(relationship_health_router)
