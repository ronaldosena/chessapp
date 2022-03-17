import React from "react";
import { View, Text } from "react-native";

const BLACK = "rgb(100, 133, 68)";
const WHITE = "rgb(230, 233, 198)";

interface BaseProps {
  white: boolean;
}

interface RankProps extends BaseProps {
  rank: number;
}

interface SquareProps extends RankProps {
  file: number;
}

const Square = ({ white, rank, file }: SquareProps) => {
  const backgroundColor = white ? WHITE : BLACK;
  const color = white ? BLACK : WHITE;
  const textStyle = { fontWeight: "500" as const, color };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
        padding: 4,
        justifyContent: "space-between",
      }}
    >
      <Text style={[textStyle, { opacity: file === 0 ? 1 : 0 }]}>
        {8 - rank}
      </Text>
      {rank === 7 && (
        <Text style={[textStyle, { alignSelf: "flex-end" }]}>
          {/* ASCII 97 = 'a', 98 = 'b' ... */}
          {String.fromCharCode(97 + file)}
        </Text>
      )}
    </View>
  );
};

const Rank = ({ white, rank }: RankProps) => {
  const offset = white ? 0 : 1;
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {new Array(8).fill(0).map((_, i) => (
        <Square rank={rank} file={i} key={i} white={(i + offset) % 2 === 1} />
      ))}
    </View>
  );
};

const Background = () => {
  return (
    <View style={{ flex: 1 }}>
      {new Array(8).fill(0).map((_, i) => (
        <Rank key={i} white={i % 2 === 1} rank={i} />
      ))}
    </View>
  );
};

export { Background };
