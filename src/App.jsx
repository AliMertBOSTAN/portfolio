import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Blog from './components/Blog'
import BottomNav from './components/BottomNav'
import './App.css'

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <div className="App">
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<Blog />} />
              </Routes>
            </main>
            <Footer />
            <BottomNav />
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
