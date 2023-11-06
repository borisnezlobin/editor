import React from 'react';
import { Muted } from './muted';
import { CONFIG } from '../utils/config';
import { useCharacterSize } from '../utils/use-character-size';


const useMousePosition = () => {
  const [
    mousePosition,
    setMousePosition
  ] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
        setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

const randomCharacter = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return characters.charAt(Math.floor(Math.random() * characters.length));
}

const randomString = (length: number) => {
    let result = '';
    for(let i = 0; i < length; i++) {
        result += randomCharacter();
    }
    return result;
}

// perfomance? who cares? it's the home page
const phrases = [
    " A simple, sleek text editor. ",
    " View and edit markdown files. ",
    " Open source and free to use. ",
    " Made by RandomLetters. ",
    " Contribute on GitHub! ",
];

const randomStringWithPhrases = (length: number) => {
    // generate a random string, but interject phrases at random intervals
    let result = '';
    for(let i = 0; i < length; i++) {
        result += randomString(Math.floor(Math.random() * 50));
        if(Math.random() < 0.1) {
            result += `<b>${phrases[Math.floor(Math.random() * phrases.length)]}</b>`;
        }
    }
    return result;
}


const RandomTextBackground: React.FC = () => {
    useMousePosition(); // rerender on mouse move
    const windowWidth = window.innerWidth;
    const { width, height } = useCharacterSize(CONFIG.FONT_NAME, "text-base");

    const strLength = window.innerWidth / (width == 0 ? 1 : width) * (window.innerHeight / (height == 0 ? 1 : height) + 1);
    const str = randomString(strLength);

    return (
        <div className="fixed left-0 z-[-1] w-full h-full pointer-events-none select-none break-all">
            <p className="monospace" dangerouslySetInnerHTML={{ __html: str }}></p>
        </div>
    );
};

export { RandomTextBackground };