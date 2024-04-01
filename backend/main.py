from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routers.websocket_router import ws_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ws_router)

@app.get("/")
def health_check():
    return {"message": "Hello World"}