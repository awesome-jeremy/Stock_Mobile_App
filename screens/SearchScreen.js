import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';

// FixMe: implement other components and functions used in SearchScreen here (don't just put all the JSX in SearchScreen below)

function PromptText({ children }) {
  return (
    <Text style={styles.promptText}>{children}</Text>
  )
}

function SearchBox({ searchText, handleChangeSearchText }) {
  return (
    <View style={styles.searchSection}>
      <Ionicons style={styles.searchIcon} name="md-search" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="#fff"
        defaultValue={searchText}
        onChangeText={(text) => handleChangeSearchText(text)}
      />
    </View>
  )
}

function StockListItem({ stock }) {
  return (
    <View style={styles.stockListItem}>
      <Text style={styles.stockSymbol}>{stock.symbol}</Text>
      <Text style={styles.stockName}>{stock.name}</Text>
    </View>
  )
}

function StockList({ stocks, addStockToWatchList }) {
  return (
    <ScrollView>
      {stocks.map(stock => (
        <TouchableOpacity onPress={() => addStockToWatchList(stock)} key={stock.symbol}>
          <StockListItem stock={stock} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();

  const [state, setState] = useState({
    /* FixMe: initial state here */
    stocks: [], //all stocks
    searchText: "",
    filteredStocks: [], // stocks filtered by the "searchText"
  });

  useEffect(() => {
    // FixMe: fetch symbol names from the server and save in local SearchScreen state
    fetch(`${ServerURL}/all`)
      .then(res => res.json())
      .then(stockData => { setState(prev => ({ ...prev, stocks: stockData })) })
      .catch(err => console.error(err));
  }, []); // [] empty, treated as componentDidMount

  const handleChangeSearchText = (text) => {
    text = text.replace(/[.*+\-?^${}()|[\]\\]/g, ''); //prevent the error caused by entering special characters
    const regex = RegExp(text, "i"); // case insensitive regular expression
    setState(prev => ({
      ...prev,
      searchText: text,
      filteredStocks: state.stocks.filter(stock => regex.test(stock.symbol) || regex.test(stock.name))
    }))
  }

  const handleAddStockToWatchList = (stock) => {
    addToWatchlist(stock.symbol);
    navigation.navigate('Stocks');
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* FixMe: add children here! */}
        <PromptText>Type a company name or stock symbol:</PromptText>

        <SearchBox
          searchText={state.searchText}
          handleChangeSearchText={handleChangeSearchText}
        />

        {state.searchText !== "" &&
          <StockList
            stocks={state.filteredStocks}
            addStockToWatchList={handleAddStockToWatchList}
          />}

      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens

  container: {
    flex: 1, // default, get full space
  },

  promptText: {
    marginTop: scaleSize(5),
    color: "#fff", //white color
    textAlign: "center",
  },

  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F', //grey
    height: scaleSize(40),
    borderRadius: scaleSize(10),
    marginHorizontal: scaleSize(3),
    marginTop: scaleSize(5),
  },

  searchIcon: {
    paddingHorizontal: scaleSize(15),
    color: '#fff',
    fontSize: scaleSize(20),
  },

  searchInput: {
    flex: 1, // get the rest of the space
    color: '#fff',
  },

  stockListItem: {
    paddingBottom: scaleSize(10),
    borderBottomColor: "#2F2F2F",
    borderBottomWidth: scaleSize(1),
  },

  stockSymbol: {
    paddingHorizontal: scaleSize(10),
    paddingTop: scaleSize(10),
    color: "#fff",
    fontSize: scaleSize(20),
  },

  stockName: {
    paddingHorizontal: scaleSize(10),
    color: "#fff",
  },
});