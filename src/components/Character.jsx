import "./Character.css";
import flame from "../assets/characters/flame.png";
import shadow from "../assets/characters/shadow.png";
import violet from "../assets/characters/violet.png";
import blue from "../assets/characters/blue.png";
import demon from "../assets/characters/demon.png";
import spider from "../assets/characters/spider.png";
import dragon from "../assets/characters/dragon.png";
import forest from "../assets/characters/forest.png";
import owl from "../assets/characters/owl.png";
import tech from "../assets/characters/tech.png";
import fire from "../assets/characters/fire.png";
import fox from "../assets/characters/fox.png";

const characters = {
  flame,
  shadow,
  violet,
  blue,
  demon,
  spider,
  dragon,
  forest,
  owl,
  tech,
  fire,
  fox,
};

export default function Character({ type = "flame" }) {
  return (
    <div className="character">
      <div className="character-aura" />
      <img
        src={characters[type]}
        alt="ASCEND character"
        className="character-image"
      />
       <Character type="flame" />
    </div>
   
  );
}