from fastapi import APIRouter, WebSocket
from fastapi.responses import JSONResponse
from src.controller.connection_controller import ConnectionController
from src.controller.booking_controller import BookingController
from src.schemas.connection_schemas import WSResponse, WSRequest
import json

ws_router = APIRouter()

@ws_router.websocket(path="/ws/{teamName}")
async def connect(websocket: WebSocket, teamName: str):
    connection_controller  = await ConnectionController.get_instance()
    booking_controller = await BookingController.get_instance(12)
    # check if the team name is already in use
    if await connection_controller.get_team_match(teamName):
        await websocket.close()
        return
    await connection_controller.connect(websocket, teamName)
    try:
        await connection_controller.broadcast(WSResponse(type="team_update", data={"user_count": await connection_controller.get_connection_count()}).dict())
        await connection_controller.broadcast(WSResponse(type="booking_update", data={"bookings": await booking_controller.get_bookings()}).dict())
        while True:
            # this while loop will keep the connection alive
            # and listen for incoming messages
            req = await websocket.receive_text()
            data = WSRequest(**json.loads(req))
            if data.type == 'booking_update':
                if (await booking_controller.book(data.data['booking_id'], teamName)) == True:
                    await connection_controller.broadcast(WSResponse(type="booking_update", data={"bookings": await booking_controller.get_bookings()}).dict())
    except Exception as e:
        pass
    finally:
        connection_controller.disconnect(teamName)
        await booking_controller.cancel_user(teamName)
        await connection_controller.broadcast(WSResponse(type="team_update", data={"user_count": await connection_controller.get_connection_count()}).dict())
    
@ws_router.get("/active_connections_count/")
async def active_connections_count():
    connection_controller  = await ConnectionController.get_instance()
    return JSONResponse(content={"active_connections_count":await connection_controller.get_connection_count()})


@ws_router.get("/check_team_name/{team_name}")
async def check_team_name(team_name:str):
    connection_controller  = await ConnectionController.get_instance()
    return JSONResponse(content={"team_match":await connection_controller.get_team_match(team_name)})