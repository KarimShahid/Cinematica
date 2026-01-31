import React from 'react'

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <h1 className="logo">Cinematica</h1>
        <nav className="nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/reviews" className="nav-link">Reviews</a>
          <a href="/lists" className="nav-link">Lists</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
