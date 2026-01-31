import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import MovieGrid from './components/MovieGrid'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MovieGrid />
      </main>
      <Footer />
    </>
  )
}

export default App
