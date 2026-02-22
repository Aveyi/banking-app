import { useState } from 'react'
import Router from './router/router'
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Router />
    </>
  );
}

export default App;
