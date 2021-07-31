import React from 'react';
import { useEffect } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import { useState } from 'react';

const COMMANDS = {
  OPEN_CART: 'open-cart',
  CLOSE_CART:'close-cart'
};

export default function useAlan() {
  const [alanInstance, setAlanInstance] = useState();

  const openCart = useCallback(() => {
    alanInstance.playText('Opening cart');
  }, [alanInstance]);

  useEffect(() => {
    window.addEventListener(COMMANDS.OPEN_CART, openCart);

    return () => {
      window.removeEventListener(COMMANDS.OPEN_CART, openCart);
    };
  }, [openCart]);

  useEffect(() => {
    if (alanInstance !== null) return;
    return () => {
      // use
      alanBtn({
        top: '15px',
        left: '15px',
        key: process.env.REACT_APP_ALAN_KEY,
        onCommand: ({ command }) => {
          window.dispatchEvent(new CustomEvent(command));
          // console.log(commandData);
        }
      });
    };
  }, []);

  return null;
}
