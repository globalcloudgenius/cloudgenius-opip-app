from sqlalchemy import BigInteger, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base

class Population(Base):
    __tablename__ = "population"
    __table_args__ = (UniqueConstraint("year", "municipality", name="uq_population_year_municipality"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    year: Mapped[int] = mapped_column(Integer, index=True)
    municipality: Mapped[str] = mapped_column(String(120), index=True)
    region: Mapped[str] = mapped_column(String(120), index=True)
    population: Mapped[int] = mapped_column(BigInteger)
