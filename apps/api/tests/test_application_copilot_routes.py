from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_get_applications_and_detail() -> None:
    list_response = client.get("/applications")
    assert list_response.status_code == 200
    applications = list_response.json()
    assert applications

    app_id = applications[0]["id"]
    detail_response = client.get(f"/applications/{app_id}")
    assert detail_response.status_code == 200
    assert detail_response.json()["id"] == app_id


def test_fit_summary_route() -> None:
    response = client.post(
        "/applications/app_nimbus_ai/fit-summary",
        json={
            "resumeText": "Built FastAPI services, ranking APIs, and strong automated testing.",
            "keySkills": ["python", "fastapi", "ranking"],
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["applicationId"] == "app_nimbus_ai"
    assert 0 <= payload["fitScore"] <= 100
    assert payload["evidence"]


def test_tailoring_analyze_route() -> None:
    response = client.post(
        "/tailoring/analyze",
        json={
            "applicationId": "app_aurora_backend",
            "jobDescription": "ignored when applicationId is present",
            "resumeText": "Owned Python APIs and testing strategy for backend services.",
            "keySkills": ["python", "api design"],
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert 0 <= payload["matchScore"] <= 100
    assert isinstance(payload["keywordAnalysis"], list)


def test_tracker_update_and_followups_routes() -> None:
    tracker_response = client.get("/tracker")
    assert tracker_response.status_code == 200
    assert tracker_response.json()["total"] >= 1

    update_response = client.post(
        "/tracker/update",
        json={"applicationId": "app_delta_platform", "stage": "screening", "note": "Recruiter replied"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["item"]["stage"] == "screening"

    followups_response = client.get("/tracker/followups")
    assert followups_response.status_code == 200
    assert isinstance(followups_response.json()["items"], list)


def test_interview_prep_generate_route() -> None:
    response = client.post(
        "/interview-prep/generate",
        json={
            "applicationId": "app_vertex_data",
            "resumeText": "Built FastAPI systems and led reliability improvements.",
            "focusAreas": ["system design", "leadership"],
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["applicationId"] == "app_vertex_data"
    assert len(payload["likelyQuestions"]) >= 3
