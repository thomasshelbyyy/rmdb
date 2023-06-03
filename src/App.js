import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import MovieList from './Pages/MovieList';
import TvList from './Pages/TvList';
import Header from './Components/Header';
import Footer from './Components/Footer';
import MovieDetail from "./Pages/MovieDetail"
import TvDetail from './Pages/TvDetail';
import Collection from './Pages/Collection';
import Search from './Pages/Search';

function App() {


  return (
    <Router>
      <div className="App">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:query" element={<MovieList />} />
          <Route path="/detail/movie/:id" element={<MovieDetail />} />
          <Route path="/tv/:query" element={<TvList />} />
          <Route path="/detail/tv/:id" element={<TvDetail />} />
          <Route path="/collection/:id" element={<Collection />} />
          <Route path="/search" element={<Search />} />
        </Routes>

        <Footer />
      </div>
    </Router>

  );
}

export default App;
