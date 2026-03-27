import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Lit la variable d'environnement DATABASE_URL
# Si elle n'existe pas, utilise localhost (pour le développement local)
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+mysqlconnector://admin:admin123@localhost:3306/dit-library-bd"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)

session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
