import './App.css';
import Landing from './pages/landing';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react'; // Import React
import WebSocketPage from './pages/websocket';

function App() {
  const [teamName, setTeamName] = useState('')
  return (
    <div className="relative w-[100vw] h-[100vh]">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing teamName = {teamName} setTeamName={setTeamName}/>}/>
        <Route path='websocket' element={<WebSocketPage teamName = {teamName} setTeamName={setTeamName}/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
