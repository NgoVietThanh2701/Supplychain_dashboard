import React, { createContext, useContext, useState, ReactNode } from 'react';
interface Props {
   children?: ReactNode
   // any props that come into the component
}

interface ContextType {
   activeMenu: boolean;
   setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
   screenSize: number;
   setScreenSize: React.Dispatch<React.SetStateAction<number>>;
   currentColor: string;
   setColor: (color: string) => void;
   themeSettings: boolean;
   setThemeSettings: React.Dispatch<React.SetStateAction<boolean>>;

}

const defaultContextValue: ContextType = {
   activeMenu: false,
   setActiveMenu: () => { },
   screenSize: 0,
   setScreenSize: () => { },
   currentColor: '',
   setColor: () => { },
   themeSettings: false,
   setThemeSettings: () => { },

};

const StateContext = createContext<ContextType>(defaultContextValue); // create context

export const ContextProvider = ({ children }: Props) => {

   const color = localStorage.getItem('colorMode');

   const [activeMenu, setActiveMenu] = useState(true);
   const [screenSize, setScreenSize] = useState(0);
   const [currentColor, setCurrentColor] = useState(color || '#1A97F5');
   const [themeSettings, setThemeSettings] = useState(false);

   const setColor = (color: any) => {
      setCurrentColor(color);
      localStorage.setItem('colorMode', color);
   }

   const contextValue: ContextType = {
      activeMenu,
      setActiveMenu,
      screenSize,
      setScreenSize,
      currentColor,
      setColor,
      themeSettings,
      setThemeSettings,
   };

   return (
      <StateContext.Provider
         value={contextValue}>
         {children}
      </StateContext.Provider>
   )
}

export const useStateContext = () => useContext(StateContext);