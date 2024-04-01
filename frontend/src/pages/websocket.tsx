import React, { useEffect, useRef } from 'react'
import { BookingUpdate, TeamUpdate, WSMessageReceive, WebSocketPageProps } from '../types';


const WebSocketPage = ({teamName,setTeamName}:WebSocketPageProps) => {
    const ws = useRef<WebSocket | null>(null)
    const [isDisconnected, setIsDisconnected] = React.useState<boolean>(false)
    const [userCount, setUserCount] = React.useState<number>(0)
    const [selectedBox, setSelectedBox] = React.useState<{[gameNumber:number]:string|null}>({
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
        7: null,
        8: null,
        9: null,
    })
    useEffect(()=>{

        if (teamName===''){
            if (sessionStorage.getItem('teamName')!==null){
                setTeamName(sessionStorage.getItem('teamName') as string)
            }
            else{
                window.location.href = '/'
            }
        }
        else{
            // websocket connection
            ws.current = new WebSocket('ws://localhost:8000/ws/'+teamName)
            ws.current.onopen = () => {
                console.log('connected')
                setIsDisconnected(false)
            }
            ws.current.onmessage = (e: MessageEvent) => {
                const data:WSMessageReceive = JSON.parse(e.data)
                console.log(data)
                if (data.type==='team_update'){
                    console.log(data.data)
                    const teamUpdate:TeamUpdate = data.data as TeamUpdate
                    setUserCount(teamUpdate.user_count)
                }
                else if (data.type==='booking_update'){
                    const bookingUpdate:BookingUpdate = data.data as BookingUpdate
                    console.log(bookingUpdate)
                    console.log(selectedBox)
                    setSelectedBox(bookingUpdate.bookings)
                }
            }
            ws.current.onclose = () => {
                // connection closed. send to landing page
                setIsDisconnected(true)
                console.log('disconnected')
            }

            return () => {
                ws.current?.close()
            }
        }
    },[teamName])

    const sendMessage = (message:any) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify(message));
        } else {
          console.error("WebSocket is not open.");
        }
      };

    const handleClick = (box_number:number) => {
        sendMessage({
            type: 'booking_update',
            data: {
                booking_id: box_number
            }
        })
    }

  return (
    <div className='bg-red-400 w-full h-full flex flex-col items-center justify-center'>
        {isDisconnected===true?<h1 className='text-5xl text-white'>Server Disconnected (Refresh)</h1>:
        <>
        <h1>User Count:{userCount}</h1>
        <h1>Booking:</h1>
        <div className='grid grid-cols-3 w-fit'>
        {
            Object.keys(selectedBox).map((boxNumber)=>{
                return (
                    <div key={boxNumber} className=
                    {`bg-blue-400 w-20 h-20 m-2 flex items-center justify-center cursor-pointer ${selectedBox[parseInt(boxNumber)]!==null?'bg-green-400':''}`}
                    onClick={()=>handleClick(parseInt(boxNumber))}
                    >
                        {selectedBox[parseInt(boxNumber)]}
                    </div>
                )
            })
        }
        </div>
        </>}

    </div>
  )
}

export default WebSocketPage