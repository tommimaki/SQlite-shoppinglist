import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";
import * as SQLite from "expo-sqlite";

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [productList, setProductList] = useState([]);

  const db = SQLite.openDatabase("shoppingdb.db");
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("DROP TABLE IF EXISTS product;");
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS product (id INTEGER PRIMARY KEY AUTOINCREMENT, product TEXT, amount TEXT);",
        [],
        (tx, result) => {
          console.log("Table created successfully");
        },
        (tx, error) => {
          console.log("Error creating table", error);
        }
      );
    });
  }, []);

  const saveProduct = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("insert into product (product, amount) values(?, ?); ", [
          product,
          amount,
        ]);
      },
      (error) => console.log("Error saving product: ", error),
      () => {
        console.log("Product saved successfully!");
        updateList();
      }
    );

    setAmount("");
    setProduct("");
  };
  const updateList = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("select * from product;", [], (_, { rows }) =>
          setProductList(rows._array)
        );
      },
      null,
      null
    );
  };

  const deleteItem = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from product where id = ?;", [id]);
      },
      null,
      updateList
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Any}>Shoppinglist</Text>

      <TextInput
        placeholder="product"
        onChangeText={(product) => setProduct(product)}
        value={product}
      />
      <TextInput
        style={styles.TextInput}
        placeholder="amount"
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />

      <FlatList
        style={styles.FlatList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listcontainer}>
            <Text>
              {item.product},{item.amount}
            </Text>
            <Text
              style={{ color: "red" }}
              onPress={() => deleteItem(product.id)}
            >
              bought
            </Text>
          </View>
        )}
        data={productList}
      />
      <View style={styles.Button}>
        <Button onPress={saveProduct} title="save" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  TextInput: {
    margin: 10,
    padding: 10,
  },
  Button: {
    margin: 10,
    padding: 10,
  },
  Any: {
    margin: 10,
    padding: 10,
  },
  FlatList: {
    width: 400,
    borderWidth: 2,
    marginBottom: 100,
    marginTop: 100,
  },
});
