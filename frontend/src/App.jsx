import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LessonList from './pages/LessonList';
import LessonDetail from './pages/LessonDetail';
import Progress from './pages/Progress';
import './App.css';

const DEMO_STUDENT_ID = 'demo-student';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <div className="nav-content">
              <Link to="/" className="nav-brand">
                <span className="brand-icon">🎯</span>
                <span className="brand-text">音标学习</span>
              </Link>
              <div className="nav-links">
                <Link to="/" className="nav-link">课程</Link>
                <Link to={`/progress/${DEMO_STUDENT_ID}`} className="nav-link">我的进度</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<LessonList />} />
            <Route path="/lesson/:id" element={<LessonDetail />} />
            <Route path="/progress/:studentId" element={<Progress />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>© 2025 音标学习系统 - 专为5年级小学生设计</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
