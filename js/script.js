import React, { useState, useEffect } from 'react';
import './styles.css'; // Ensure your styles are imported

const App = () => {
  const [borderStyles, setBorderStyles] = useState({});
  const [darkMode, setDarkMode] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (window.innerWidth <= 1130) {
      function removeAllBorders() {
        setBorderStyles({});
      }

      const handleClick = (id) => {
        removeAllBorders();
        setBorderStyles({
          [id]: {
            border: '2px solid whitesmoke',
            borderRadius: '20px',
          },
        });
      };

      document.getElementById('sec').onclick = () => handleClick('sec');
      document.getElementById('pri').onclick = () => handleClick('pri');
      document.getElementById('tri').onclick = () => handleClick('tri');
      document.getElementById('quad').onclick = () => handleClick('quad');
      document.getElementById('quint').onclick = () => handleClick('quint');
      document.getElementById('hex').onclick = () => handleClick('hex');
      document.getElementById('hept').onclick = () => handleClick('hept');
      document.getElementById('checkbox').onclick = () => handleClick('checkbox');
    }
  }, []);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = localStorage.getItem('tourism_website_darkmode') === 'false';
      setDarkMode(isDarkMode);
      if (isDarkMode) {
        document.body.classList.add('dark');
      }
    };

    checkDarkMode();

    const checkbox = document.getElementById('checkbox');
    checkbox.addEventListener('change', () => {
      document.body.classList.toggle('dark');
      const isDarkModeActive = document.body.classList.contains('dark');
      setDarkMode(isDarkModeActive);
      localStorage.setItem('tourism_website_darkmode', isDarkModeActive);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
      updateNav();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateNav = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links li a');
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if ((window.innerWidth <= 425 && rect.top <= 1300) || 
          (window.innerWidth <= 768 && rect.top <= 1250) || 
          rect.top <= 1000) {
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        navLinks[index].classList.add('active');
      }
    });
  };

  const scrollToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  return (
    <div>
      <div id="sec" style={borderStyles.sec}>Section</div>
      <div id="pri" style={borderStyles.pri}>Primary</div>
      <div id="tri" style={borderStyles.tri}>Tertiary</div>
      <div id="quad" style={borderStyles.quad}>Quad</div>
      <div id="quint" style={borderStyles.quint}>Quint</div>
      <div id="hex" style={borderStyles.hex}>Hex</div>
      <div id="hept" style={borderStyles.hept}>Hept</div>

      <input id="checkbox" type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />

      <button id="upbtn" onClick={scrollToTop} style={{ display: showScrollButton ? 'block' : 'none' }}>
        Scroll to Top
      </button>

      <nav className="nav-links">
        {/* Update the nav links to match your sections */}
        <li><a href="#sec">Section 1</a></li>
        <li><a href="#pri">Primary</a></li>
        <li><a href="#tri">Tertiary</a></li>
      </nav>

      <section id="sec">Section 1 content</section>
      <section id="pri">Primary content</section>
      <section id="tri">Tertiary content</section>
    </div>
  );
};

export default App;
