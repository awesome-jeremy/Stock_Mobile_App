import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)

function WatchListItem({ stock, selectedStock }) {
  return (
    <View style={{ ...styles.stockItem, backgroundColor: stock.symbol === selectedStock.symbol ? "#373839" : "#000" }}>
      <Text style={styles.symbol}>{stock.symbol}</Text>

      <View style={styles.stockItemRightContainer}>
        <Text style={styles.closingPrice}>{stock.close.toFixed(2)}</Text>

        <View style={{ ...styles.percentageGainOrLossContainer, backgroundColor: stock.percentage >= 0 ? "#68D866" : "#F23937" }}>
          <Text style={styles.percentageGainOrLoss}>{stock.percentage}%</Text>
        </View>
      </View>
    </View>
  )
}

function WatchList({ watchListStocks, selectedStock, handleSelectStock }) {
  return (
    <View style={styles.stockList}>
      <ScrollView>

        {watchListStocks.map(stock => (
          <TouchableOpacity key={stock.symbol} onPress={() => handleSelectStock(stock)}>
            <WatchListItem stock={stock} selectedStock={selectedStock} />
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  )
}

function StockDetailProperty({ propertyName, propertyValue }) {
  return (
    <View style={styles.stockProperty}>
      <Text style={styles.stockPropertyName}>{propertyName}</Text>
      <Text style={styles.stockPropertyValue}>{propertyValue}</Text>
    </View>
  )
}

function StockDetailRow({ propertyNames, propertyValues }) {
  return (
    <View style={styles.stockDetailRow}>
      <StockDetailProperty
        propertyName={propertyNames.length > 0 ? propertyNames[0] : ""}
        propertyValue={propertyValues.length > 0 ? propertyValues[0] : ""}
      />

      <StockDetailProperty
        propertyName={propertyNames.length > 1 ? propertyNames[1] : ""}
        propertyValue={propertyValues.length > 1 ? propertyValues[1] : ""}
      />
    </View>
  )
}

function StockDetail({ selectedStock }) {
  return (

    <View style={styles.stockDetail}>

      <View style={styles.stockHeader}>
        <Text style={styles.stockName}>{selectedStock.name}</Text>
      </View>

      {/* OPEN & LOW */}
      <StockDetailRow
        propertyNames={["OPEN", "LOW"]}
        propertyValues={[selectedStock.open, selectedStock.low]}
      />

      {/* CLOSE & HIGH */}
      <StockDetailRow
        propertyNames={["CLOSE", "HIGH"]}
        propertyValues={[selectedStock.close, selectedStock.high]}
      />

      {/* VOLUME*/}
      <StockDetailRow
        propertyNames={["VOLUME"]}
        propertyValues={[selectedStock.volumes]}
      />

    </View>
  )
}

export default function StocksScreen({ route }) {
  const { ServerURL, watchList } = useStocksContext();

  const [state, setState] = useState({
    /* FixMe: initial state here */
    watchListStocks: [], //data of stocks in the watchlist
    selectedStock: null,
  });

  // can put more code here
  useEffect(() => {
    // FixMe: fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state

    //watchList is like ["A","AAP","AAL"...]
    const newlyAddedSymbols = watchList.filter(symbol => !state.watchListStocks.some(stock => stock.symbol === symbol)); // get new symbols added to the watchlist

    Promise.all(newlyAddedSymbols.map(stockSymbol => fetch(`${ServerURL}/history?symbol=${stockSymbol}`).then(res => res.json()).then(history => history[0]))) // fetch stock data of all symbols newly added to watchlist
      .then(stocks => {
        stocks.forEach((stockDetail) => {
          stockDetail.percentage = ((stockDetail.close - stockDetail.open) * 100 / stockDetail.open).toFixed(2); //calculate percentage gain or loss since the open

          setState(prev => {
            if (!prev.watchListStocks.some(stock => stock.symbol === stockDetail.symbol)) {  //before adding, check if it is in the state already
              return { ...prev, watchListStocks: prev.watchListStocks.concat(stockDetail) }
            } else {
              return prev
            }
          })
        })
      })

  }, [watchList]);


  //get default stock detail, which is the first stock in the list
  useEffect(() => {
    //if selectedDetail is null, it will display the first stock detail in the stock list
    if (state.watchListStocks.length > 0 && state.selectedStock === null) {
      setState(prev => ({ ...prev, selectedStock: state.watchListStocks[0] }))
    }
  }, [state.watchListStocks])


  const handleSelectStock = (stock) => {
    setState(prev => ({ ...prev, selectedStock: stock }))
  }

  return (
    <View style={styles.container}>
      {/* FixMe: add children here! */}

      <WatchList
        watchListStocks={state.watchListStocks.sort((a, b) => a.symbol.localeCompare(b.symbol))} //sort by alphabetical order
        selectedStock={state.selectedStock || {}}
        handleSelectStock={handleSelectStock}
      />

      <StockDetail
        selectedStock={state.selectedStock || {}}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens

  container: {
    flex: 1, //default, get full space
  },

  stockList: {
    flex: 4, //get 4/5 space
  },

  stockItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scaleSize(10),
    borderBottomWidth: scaleSize(1),
    borderBottomColor: "#2F2F2F",
  },

  stockItemRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  symbol: {
    color: "#fff",
    fontSize: scaleSize(20),
  },

  closingPrice: {
    color: "#fff",
    fontSize: scaleSize(20),
    marginRight: scaleSize(20),
  },

  percentageGainOrLossContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",

    width: scaleSize(100),
    height: scaleSize(35),
    borderRadius: scaleSize(10),
  },

  percentageGainOrLoss: {
    color: "#fff",
    fontSize: scaleSize(20),
    paddingRight: scaleSize(5),
  },


  // start of stock detail css
  stockDetail: {
    flex: 1, //get 1/5 space
    backgroundColor: "#202122" //grey
  },

  stockHeader: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: scaleSize(0.5),
    borderBottomColor: "#BCBCBC",
  },

  stockName: {
    color: "#fff",
    fontSize: scaleSize(20),
  },

  stockDetailRow: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: scaleSize(1),
    borderBottomColor: "#404142",
  },

  stockProperty: {
    flex: 1, // get 1/(1+1) => 1/2 space
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scaleSize(3),
  },

  stockPropertyName: {
    color: "#616263" //grey
  },

  stockPropertyValue: {
    color: "#fff",
    fontSize: scaleSize(15)
  },

});



