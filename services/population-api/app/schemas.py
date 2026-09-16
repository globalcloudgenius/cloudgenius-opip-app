from pydantic import BaseModel, ConfigDict

class PopulationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    year: int
    municipality: str
    region: str
    population: int

class SummaryOut(BaseModel):
    year: int
    total_population: int
    municipalities: int
