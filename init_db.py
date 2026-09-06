from database import engine, Base
import models  # noqa: this import is required even though unused directly

Base.metadata.create_all(bind=engine)
print("Tables created successfully!")