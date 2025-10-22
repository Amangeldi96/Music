import { Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import Profile from './components/profile';

import Menu from './components/Menu';
import Regstr from './components/Regstr';
import Home from './components/Home';
import Album from './components/Album';
import Genre from './components/Genre';
import AlbumPage from './components/AlbumPage';

import Mirbek from './components/artist/mirbek';
import Freeman from './components/artist/freeman';
import Jax from './components/artist/jax';
import Aftok from './components/artist/aftok';
import Ulukmanapo from './components/artist/ulukmanapo';
import Nurlan from './components/artist/nurlan';
import Nurila from './components/artist/nurila';

import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Останавливаем музыку при смене страницы
  useEffect(() => {
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false);
    setCurrentTrack(null);
  }, [location.pathname]);

  // Запуск выбранного трека
  useEffect(() => {
    const audio = audioRef.current;

    if (currentTrack?.src) {
      audio.src = currentTrack.src;
      audio.load();

      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [currentTrack]);

  // Переключение Play / Pause
  const togglePlay = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <div className="App">
      <Menu />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Album" element={<Album />} />
          <Route path="/Genre" element={<Genre />} />
          <Route path="/Regstr" element={<Regstr />} />
						<Route path="/profile" element={<Profile />} />

          {/* Артисты */}
          <Route path="/Mirbek" element={<Mirbek />} />
          <Route path="/Freeman" element={<Freeman />} />
          <Route path="/Jax" element={<Jax />} />
          <Route path="/Aftok" element={<Aftok />} />
          <Route path="/Ulukmanapo" element={<Ulukmanapo />} />
          <Route path="/Nurlan" element={<Nurlan />} />
          <Route path="/Nurila" element={<Nurila />} />
				

          {/* Страница альбома с передачей функции установки трека */}
          <Route
            path="/albums/:albumId"
            element={<AlbumPage setCurrentTrack={setCurrentTrack} />}
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;