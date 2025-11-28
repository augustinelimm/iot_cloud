import { useState } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import { Header } from "./components/Header";

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Render the appropriate page component based on current navigation state
  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'about':
        return <About />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderCurrentPage()}
    </div>
  );
}

export default App;