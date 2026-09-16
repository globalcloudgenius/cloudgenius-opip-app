import os
os.environ["DATABASE_URL"] = "sqlite:///./test_opip.db"

from fastapi.testclient import TestClient
from app.database import Base, engine, SessionLocal
from app.main import app
from app.models import Population

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
with SessionLocal() as db:
    db.add_all([
        Population(year=2025, municipality="Toronto", region="Toronto", population=2928000),
        Population(year=2025, municipality="Ottawa", region="Ottawa", population=1074000),
    ])
    db.commit()

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_population_filter():
    response = client.get("/api/v1/population?municipality=Toronto&year=2025")
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["municipality"] == "Toronto"

def test_summary():
    response = client.get("/api/v1/summary")
    assert response.status_code == 200
    assert response.json() == {"year": 2025, "total_population": 4002000, "municipalities": 2}
