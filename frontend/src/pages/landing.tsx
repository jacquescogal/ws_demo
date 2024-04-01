import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LandingPageProps } from '../types'

const Landing = ({teamName, setTeamName}:LandingPageProps) => {
    const [teamMatchExists, setTeamMatchExists] = React.useState<boolean>(false)
    const nav= useNavigate()
    const handleSubmit = async () => {
        axios.get('http://localhost:8000/check_team_name/'+teamName).then(res=>{
            if (res.data.team_match===true){
                setTeamMatchExists(true)
                return
            }
            else{
                sessionStorage.setItem('teamName',teamName)
                nav('/websocket')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
  return (
    <div className='bg-slate-200 h-full w-100vw flex flex-col items-center justify-center'>
        <div className='bg-slate-300 rounded w-80 h-80 flex flex-col items-center justify-center'>
            <label>Team Name:</label>
            <input value={teamName} onChange={e=>{setTeamName(e.currentTarget.value);setTeamMatchExists(false)}}/>
            {teamMatchExists===true && <h1 className='text-red-700'>team_name already exists</h1>}
            <div className='bg-blue-300 mt-4 rounded p-4 select-none cursor-pointer hover:bg-blue-400' 
            onClick={handleSubmit}
            >Enterh</div>
        </div>
    </div>
  )
}

export default Landing