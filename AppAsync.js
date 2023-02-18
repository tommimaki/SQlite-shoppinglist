import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TextInput,
  Button,
  FlatList,
} from "react-native";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("myKey")
      .then((value) => {
        if (value) {
          setItems((prevItems) => [...prevItems, value]);
        }
        console.log(items);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const save = () => {
    AsyncStorage.setItem("myKey", inputValue)
      .then(() => {
        console.log("data stored");
        setItems((prevItems) => [...prevItems, inputValue]);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="shopping item"
        style={styles.TextInput}
        value={inputValue}
        onChangeText={(text) => setInputValue(text)}
      />
      <View style={styles.button}>
        <Button onPress={save} title="add" color="white"></Button>
      </View>

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View>
            <Text>{item}</Text>
            <View style={styles.itemBorder} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 300,
    flex: 1,
    backgroundColor: "#fff",
  },
  TextInput: {
    borderWidth: 2,
    padding: 5,
    width: 200,
    alignSelf: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "darkgrey",
    width: 100,
    borderRadius: 15,
    fontColor: "white",
    borderWidth: 2,
    alignSelf: "center",
  },
  flatlist: {
    alignSelf: "center",
    marginTop: 30,
    borderRightWidth: 2,
  },
  itemBorder: {
    borderRightWidth: 2,
    height: "100%",
    borderColor: "black",
  },
});
