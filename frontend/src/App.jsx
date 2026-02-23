import { useState } from 'react'
import Router from './router/router'
import Layout from './components/Layout';

function App() {
  return (
      <Layout>
        <Router />
      </Layout>
  );
}

export default App;
