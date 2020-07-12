import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};


export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  // retrieve watchlist from AsyncStorage
  const _retrieveData = async () => {
    try {
      const stockWatchList = await AsyncStorage.getItem("stockWatchList");
      if (stockWatchList !== null) {
        setState(JSON.parse(stockWatchList));
      }
    } catch (err) {
      console.error(err);
    }
  }

  const _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value); //save it in the AsyncStorage
    } catch (err) {
      console.err(err);
    }
  }

  function addToWatchlist(newSymbol) {
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage

    // add the new symbol to the watchlist in the state, [] -> ["A"] -> ["A","AAP"] -> ...
    setState(prev => { 
      if (prev.indexOf(newSymbol) === -1) {

        const stockWatchList = JSON.stringify(prev.concat(newSymbol));
        _storeData("stockWatchList", stockWatchList);

        return prev.concat(newSymbol); 

      } else {
        return prev; 
      }
    });
  }

  useEffect(() => {
    // FixMe: Retrieve watchlist from persistent storage

    _retrieveData();

    // AsyncStorage.removeItem("stockWatchList"); //used for cleaning the AsyncStorage

  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state, addToWatchlist };
};
