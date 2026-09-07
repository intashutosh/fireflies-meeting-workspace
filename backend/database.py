import os
import libsql_experimental as libsql
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

TURSO_DATABASE_URL = os.getenv("TURSO_DATABASE_URL")
TURSO_AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN")

if TURSO_DATABASE_URL and TURSO_AUTH_TOKEN:
    # Bulletproof Turso Connection: Bypass SQLAlchemy's URL parser entirely
    def get_turso_connection():
        return libsql.connect(TURSO_DATABASE_URL, auth_token=TURSO_AUTH_TOKEN)

    engine = create_engine(
        "sqlite+libsql://", 
        creator=get_turso_connection,
    )
else:
    # Local fallback for development (file-based SQLite)
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fireflies.db")
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
    )

SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()