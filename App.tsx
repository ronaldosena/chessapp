import { StyleSheet, Text, View } from "react-native";
import { Board } from "./components/Board";
import { Dimensions } from "react-native";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgb(36, 35, 32)",
  },
});

export default function App() {
  return (
    <View style={styles.wrapper}>
      <Board />
    </View>
  );
}
