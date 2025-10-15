import React from "react";
import './css/album.css';
import AlbumItem from "./AlbumItem";
import { Link } from "react-router-dom";

export default function Album() {
  const albums = [
  { albumClass: "album-block1", albumName: "Мирбек Аиабеков", link: "/Mirbek" },
  { albumClass: "album-block2", albumName: "Jax 02.14", link: "/Jax" },
  { albumClass: "album-block3", albumName: "Гулжигит Сатыбеков", link: "/Freeman" },
  { albumClass: "album-block4", albumName: "Нурлан Насип", link: "/Nurlan" },
    { albumClass: "album-block5", albumName: "Илъяз Абдыразаков" , link: "/Iliaz" },
    { albumClass: "album-block6", albumName: "Мирлан Баеков" , link: "/Mirlan" },
    { albumClass: "album-block7", albumName: "Нурайым Акылбекова" , link: "/Nuraiym" },
    { albumClass: "album-block8", albumName: "Xamdam Sobirov" , link: "/Xamdam" },
    { albumClass: "album-block9", albumName: "Муниса Ризаева" , link: "/Minusa" },
    { albumClass: "album-block10", albumName: "Райм" , link: "/Raim" },
    { albumClass: "album-block11", albumName: "Рахымжан Жакайым" , link: "/Raxymjan" },
    { albumClass: "album-block12", albumName: "Ajiniyaz Xojambergenov" , link: "/Ajiniyaz" },
    { albumClass: "album-block13", albumName: "Нурила" , link: "/Nurila" },
    { albumClass: "album-block14", albumName: "Бек Борбиев" , link: "/Bek" },
    { albumClass: "album-block15", albumName: "Кайрат Нуртас" , link: "/Kairat" },
  ];

  return (
    <div className="album-container">
      <h1 className='name'>Альбом</h1>
      <div className="container-al">
        {albums.map((album, index) => (
          <Link to={`/albums/${index}`} key={index}>
            <AlbumItem albumClass={album.albumClass} albumName={album.albumName} />
          </Link>
        ))}
      </div>
    </div>
  );
}