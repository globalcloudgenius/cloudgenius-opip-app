import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from sqlalchemy import func, select, text
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import Population
from .schemas import PopulationOut, SummaryOut


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="CloudGenius OPIP Population API",
    description="Population intelligence API for the CloudGenius OPIP training platform.",
    version="1.0.0",
    lifespan=lifespan,
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)
Instrumentator().instrument(app).expose(app)


@app.get("/health", tags=["Operations"])
def health():
    return {"status": "healthy", "service": "population-api"}


@app.get("/ready", tags=["Operations"])
def ready(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ready", "database": "reachable"}


@app.get("/api/v1/population", response_model=list[PopulationOut], tags=["Population"])
def population(
    municipality: str | None = None,
    year: int | None = None,
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    stmt = select(Population)
    if municipality:
        stmt = stmt.where(func.lower(Population.municipality) == municipality.lower())
    if year:
        stmt = stmt.where(Population.year == year)
    return db.scalars(
        stmt.order_by(Population.year.desc(), Population.population.desc()).limit(limit)
    ).all()


@app.get("/api/v1/summary", response_model=SummaryOut, tags=["Population"])
def summary(db: Session = Depends(get_db)):
    latest = db.scalar(select(func.max(Population.year)))
    if latest is None:
        return SummaryOut(year=0, total_population=0, municipalities=0)
    total = db.scalar(
        select(func.sum(Population.population)).where(Population.year == latest)
    ) or 0
    count = db.scalar(
        select(func.count(func.distinct(Population.municipality))).where(
            Population.year == latest
        )
    ) or 0
    return SummaryOut(year=latest, total_population=total, municipalities=count)
