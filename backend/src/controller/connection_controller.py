from fastapi import WebSocket
from typing import Dict
import json

class ConnectionController:
    instance=None
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {} # Dict[team_name, WebSocket]
    
    @classmethod
    async def get_instance(cls):
        if cls.instance is None:
            cls.instance = ConnectionController()
        return cls.instance

    async def connect(self, websocket: WebSocket, team_name: str):
        if self.active_connections.get(team_name,None) is not None:
            await self.active_connections[team_name].close()
            del self.active_connections[team_name]
        await websocket.accept()
        self.active_connections[team_name] = websocket

    def disconnect(self, team_name: str):
        if self.active_connections.get(team_name,None) is not None:
            del self.active_connections[team_name]    

    async def broadcast(self, message):
        for connection in self.active_connections.values():
            await connection.send_text(json.dumps(message))
    
    async def get_connection_count(self):
        return len(self.active_connections)
    
    async def get_active_connections(self):
        return list(self.active_connections.keys())
    
    async def get_team_match(self,team_name):
        return self.active_connections.get(team_name,None) is not None