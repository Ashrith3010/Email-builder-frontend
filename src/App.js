import logo from './logo.svg';
import './App.css';
import EmailBuilder from './EmailBuilder';
import TemplateList from './TemplateList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
      <Route path="/" element={<TemplateList />} />
        <Route path="/new" element={<EmailBuilder />} />
        <Route path="/edit/:id" element={<EmailBuilder />} />
        </Routes>
        </Router>
       
    
    </div>
  );
}

export default App;
