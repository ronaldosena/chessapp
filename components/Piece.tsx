import React, { useCallback } from "react";
import { StyleSheet, Image } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SIZE, toPosition, toTranslation } from "./Notation";

const styles = StyleSheet.create({
  piece: {
    width: SIZE,
    height: SIZE,
  },
});
export type Player = "b" | "w";
type Type = "q" | "r" | "n" | "b" | "k" | "p";
type Piece = `${Player}${Type}`;
type Pieces = Record<Piece, ReturnType<typeof require>>;
export const PIECES: Pieces = {
  br: require("../assets/br.png"),
  bp: require("../assets/bp.png"),
  bn: require("../assets/bn.png"),
  bb: require("../assets/bb.png"),
  bq: require("../assets/bq.png"),
  bk: require("../assets/bk.png"),
  wr: require("../assets/wr.png"),
  wn: require("../assets/wn.png"),
  wb: require("../assets/wb.png"),
  wq: require("../assets/wq.png"),
  wk: require("../assets/wk.png"),
  wp: require("../assets/wp.png"),
};

interface PieceProps {
  id: Piece;
  position: any;
  chess: any;
  onTurn: () => void;
}

const Piece = ({ id, position, chess, onTurn }: PieceProps) => {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);
  const isGestureActive = useSharedValue(false);

  const movePiece = useCallback(
    (from, to) => {
      const moves = chess.moves({ verbose: true });
      const move = moves.find((m) => m.from === from && m.to === to);
      const { x, y } = toTranslation(move ? move.to : from);
      translateX.value = withTiming(
        x,
        {},
        () => (offsetX.value = translateX.value)
      );
      translateY.value = withTiming(y, {}, () => {
        offsetY.value = translateY.value;
        isGestureActive.value = false;
      });
      if (move) {
        console.log("move = ", move);
        console.log("gamestate = ", chess.board());
        chess.move({ to: to, from: from });
        onTurn();
      }
    },
    [chess, offsetX, offsetY, onTurn, translateX, translateY]
  );

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: () => {
      isGestureActive.value = true;
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    },
    onActive: ({ translationX, translationY }) => {
      translateX.value = offsetX.value + translationX;
      translateY.value = offsetY.value + translationY;
    },
    onEnd: () => {
      const from = toPosition({ x: offsetX.value, y: offsetY.value });
      const to = toPosition({ x: translateX.value, y: translateY.value });
      runOnJS(movePiece)(from, to);
    },
  });
  const piece = useAnimatedStyle(() => ({
    zIndex: isGestureActive.value ? 100 : 0,
    position: "absolute",
    width: SIZE,
    height: SIZE,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const fromSquare = useAnimatedStyle(() => ({
    backgroundColor: "rgba(255, 255, 0, 0.5)",
    zIndex: isGestureActive.value ? 100 : 0,
    position: "absolute",
    opacity: isGestureActive.value ? 1 : 0,
    width: SIZE,
    height: SIZE,
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
  }));

  const toSquare = useAnimatedStyle(() => {
    const translate = toTranslation(
      toPosition({
        x: translateX.value,
        y: translateY.value,
      })
    );
    return {
      backgroundColor: "rgba(255, 255, 0, 0.5)",
      zIndex: isGestureActive.value ? 100 : 0,
      position: "absolute",
      opacity: isGestureActive.value ? 1 : 0,
      width: SIZE,
      height: SIZE,
      transform: [{ translateX: translate.x }, { translateY: translate.y }],
    };
  });

  return (
    <>
      {/* <Animated.View style={toSquare} /> */}
      <Animated.View style={fromSquare} />
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={piece}>
          <Image source={PIECES[id]} style={styles.piece} />
        </Animated.View>
      </PanGestureHandler>
    </>
  );
};

export { Piece };
