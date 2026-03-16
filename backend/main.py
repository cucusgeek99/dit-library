from fastapi import FastAPI

app = FastAPI(
    title="DIT Library API",
    description="API pour gérer la bibliothèque de l'établissement DIT",
    version="1.0.0",
)

@app.get("/")
def index():
    return {"message": "Bienvenue à la DIT Library API!"}