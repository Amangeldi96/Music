import React, { useEffect } from 'react';

export default function AudioPlayer({ containerId }) {
  useEffect(() => {
    const playlist = document.getElementById(containerId);
    let audioPlayer = null;
    let currentButton = null;

    const buttons = playlist.querySelectorAll('.play-button, .p-btn, .play-btn');

    const handleButtonClick = (e) => {
      const songSrc = e.target.closest('li').getAttribute('data-src');
      const button = e.target.closest('button');

      if (audioPlayer && audioPlayer.src.includes(songSrc)) {
        if (audioPlayer.paused) {
          audioPlayer.play();
          button.classList.remove('paused');
          button.classList.add('playing');
        } else {
          audioPlayer.pause();
          button.classList.remove('playing');
          button.classList.add('paused');
        }
      } else {
        if (audioPlayer) {
          audioPlayer.pause();
          if (currentButton) {
            currentButton.classList.remove('playing');
            currentButton.classList.add('paused');
          }
        }
        audioPlayer = new Audio(songSrc);
        audioPlayer.play();
        button.classList.remove('paused');
        button.classList.add('playing');
        currentButton = button;
      }
    };

    buttons.forEach(button => button.addEventListener('click', handleButtonClick));

    return () => {
      buttons.forEach(button => button.removeEventListener('click', handleButtonClick));
      if (audioPlayer) {
        audioPlayer.pause();
      }
    };
  }, [containerId]);

  return null; // компонент не рендерит визуально, только управляет логикой
}