import React, { useState, useRef, useEffect } from "react";
import "./css/albumpage.css";
import "./css/trackplayer.css";
import { useParams, useLocation } from "react-router-dom";

import album1 from "./img/Album1.jpeg";
import album2 from "./img/Album2.jpeg";

import track1 from "./assets/Album/Mirbek/mirbek-atabekov-kechki-bishkek.mp3";
import track2 from "./assets/Album/Mirbek/mirbek-atabekov-oshondo.mp3";
import track3 from "./assets/Album/Mirbek/a_169681.mp3";

import ozgochokun from "./assets/Album/jax-02.14/song2.mp3";
import taranchym from "./assets/Album/jax-02.14/song17.mp3";
import jubaiym from "./assets/Album/jax-02.14/song14.mp3";

const albumData = [
  {
    albumName: "Мирбек Атабеков",
    description: "Популярный исполнитель из Кыргызстана.",
    image: album1,
    tracks: [
      { title: "Кечки Бишкек", src: track1 },
      { title: "Ошондо", src: track2 },
      { title: "Арпанын ала тоосунан", src: track3 },
    ],
  },
  {
    albumName: "Jax 02.14",
    description: "Альбом в стиле хип-хоп.",
    image: album2,
    tracks: [
      { title: "Өзгөчө күн", src: ozgochokun },
      { title: "Таранчым", src: taranchym },
      { title: "Жубайым", src: jubaiym },
    ],
  },
];

export default function AlbumPage() {
  const { albumId } = useParams();
  const location = useLocation();
  const album = albumData[albumId] || null;

  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Останавливаем музыку при переходе на другую страницу или размонтировании компонента
  useEffect(() => {
    const audio = audioRef.current;

    const stopMusic = () => {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTrack(null);
      setActiveIndex(null);
    };

    // Остановка при смене маршрута
    stopMusic();

    // Возврат cleanup при размонтировании
    return () => {
      stopMusic();
      audio.src = "";
      audio.load();
    };
  }, [location.pathname]);

  // Запуск трека
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
  }, [currentTrack]);

  // Таймлапс (прогресс трека)
  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (!isNaN(audio.duration)) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, []);

  const handlePlayClick = (track, index) => {
    setCurrentTrack(track);
    setActiveIndex(index);
  };

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

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    if (!isNaN(newTime)) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="album-page">
      {album ? (
        <>
          <img src={album.image} alt={album.albumName} />
          <div className="album-info">
            <h2>{album.albumName}</h2>
            <p>{album.description}</p>
            <h3>Треки:</h3>
            <ul>
              {album.tracks.map((track, index) => (
                <li key={index} className="track-item">
                  <button
                    onClick={() => handlePlayClick(track, index)}
                    className={`play-btn pauser ${
                      activeIndex === index && isPlaying ? "playing" : "paused"
                    }`}
                  >
                    <i></i><i></i><i></i><i></i><i></i>
                  </button>
                  <span className="track-title">{track.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {currentTrack && (
            <div className="track-player">
              <span className="track-title">{currentTrack.title}</span>

              <div className="progress-container" onClick={handleSeek}>
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <button
                onClick={togglePlay}
                className={`play-btn pauser ${isPlaying ? "playing" : "paused"}`}
              >
                <i></i><i></i><i></i><i></i><i></i>
              </button>

              <div className="time-info">
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>Альбом не найден</div>
      )}
    </div>
  );
}
