import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Chess from "chess.js";
import { Background } from "./Background";
import { useLazyRef } from "../hooks/useLazyRef";
import { Piece } from "./Piece";
import uuid from "react-native-uuid";
import { Dimensions } from "react-native";
import { SIZE } from "./Notation";

const Board = () => {
  const chess = useLazyRef(() => new Chess());
  const [state, setState] = useState({
    player: "w",
    board: chess.board(),
  });

  const onTurn = useCallback(() => {
    setState({
      player: state.player === "w" ? "b" : "w",
      board: chess.board(),
    });
  }, [chess, state.player]);

  return (
    <View style={styles.container}>
      <Background />
      {state.board.map((rank, rankNum) =>
        rank.map((square, fileNum) => {
          if (square === null) return null;
          return (
            <Piece
              onTurn={onTurn}
              chess={chess}
              position={{ x: fileNum * SIZE, y: rankNum * SIZE }}
              key={`${rankNum}-${fileNum}`}
              id={`${square.color}${square.type}` as any}
            />
          );
        })
      )}
    </View>
  );
};

export { Board };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: Dimensions.get("window").width,
  },
});
