import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Button from "../components/Button";
import { Styles } from "../styles/GlobalStyles";
import { myColors } from "../styles/Colors";
import { useHistory } from "../context/HistoryContext";

export default function MyKeyboard() {
  const router = useRouter();
  const { addToHistory } = useHistory();

  const [expression, setExpression] = React.useState("");
  const [result, setResult] = React.useState<string | null>(null);
  const [keyboardType, setKeyboardType] = React.useState("basic");

  const handleInput = (value: string) => {
    setExpression((prev) => prev + value);
  };

  const clear = () => {
    setExpression("");
    setResult(null);
  };

  const deleteLast = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const calculate = () => {
    try {
      const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/");
      const evalResult = eval(sanitized); // Можно заменить на math.js
      const finalResult = evalResult.toString();
      setResult(finalResult);
      setExpression(finalResult);
      addToHistory(expression, finalResult);
    } catch {
      setResult("Error");
    }
  };

  const switchKeyboardType = () => {
    const keyboardOrder = ["basic", "scientific", "programmer"];
    const currentIndex = keyboardOrder.indexOf(keyboardType);
    const nextIndex = (currentIndex + 1) % keyboardOrder.length;
    setKeyboardType(keyboardOrder[nextIndex]);
  };

  const renderCurrentKeyboard = () => {
    if (keyboardType === "scientific") {
      return renderScientificKeyboard();
    } else if (keyboardType === "programmer") {
      return renderProgrammerKeyboard();
    } else {
      return renderBasicKeyboard();
    }
  };

  const renderBasicKeyboard = () => (
    <>
      <View style={Styles.row}>
        <Button title="C" isGray onPress={clear} />
        <Button title="+/-" isGray onPress={() => handleInput("-")} />
        <Button title="%" isGray onPress={() => handleInput("%")} />
        <Button title="÷" isBlue onPress={() => handleInput("÷")} />
      </View>
      <View style={Styles.row}>
        <Button title="7" onPress={() => handleInput("7")} />
        <Button title="8" onPress={() => handleInput("8")} />
        <Button title="9" onPress={() => handleInput("9")} />
        <Button title="×" isBlue onPress={() => handleInput("×")} />
      </View>
      <View style={Styles.row}>
        <Button title="4" onPress={() => handleInput("4")} />
        <Button title="5" onPress={() => handleInput("5")} />
        <Button title="6" onPress={() => handleInput("6")} />
        <Button title="-" isBlue onPress={() => handleInput("-")} />
      </View>
      <View style={Styles.row}>
        <Button title="1" onPress={() => handleInput("1")} />
        <Button title="2" onPress={() => handleInput("2")} />
        <Button title="3" onPress={() => handleInput("3")} />
        <Button title="+" isBlue onPress={() => handleInput("+")} />
      </View>
      <View style={Styles.row}>
        <Button title="." onPress={() => handleInput(".")} />
        <Button title="0" onPress={() => handleInput("0")} />
        <Button title="⌫" onPress={deleteLast} />
        <Button title="=" isBlue onPress={calculate} />
      </View>
    </>
  );

  const renderScientificKeyboard = () => (
    <>
      <View style={Styles.row}>
        <Button title="sin(" onPress={() => handleInput("Math.sin(")} />
        <Button title="cos(" onPress={() => handleInput("Math.cos(")} />
        <Button title="tan(" onPress={() => handleInput("Math.tan(")} />
        <Button title="π" onPress={() => handleInput(Math.PI.toString())} />
      </View>
      <View style={Styles.row}>
        <Button title="log(" onPress={() => handleInput("Math.log10(")} />
        <Button title="ln(" onPress={() => handleInput("Math.log(")} />
        <Button title="√(" onPress={() => handleInput("Math.sqrt(")} />
        <Button title="^" onPress={() => handleInput("**")} />
      </View>
      <View style={Styles.row}>
        <Button title="(" onPress={() => handleInput("(")} />
        <Button title=")" onPress={() => handleInput(")")} />
        <Button title="e" onPress={() => handleInput(Math.E.toString())} />
        <Button title="C" isGray onPress={clear} />
      </View>
    </>
  );

  const renderProgrammerKeyboard = () => (
    <>
      <View style={Styles.row}>
        <Button title="BIN" onPress={() => setExpression(parseInt(expression).toString(2))} />
        <Button title="OCT" onPress={() => setExpression(parseInt(expression).toString(8))} />
        <Button title="DEC" onPress={() => setExpression(parseInt(expression).toString(10))} />
        <Button title="HEX" onPress={() => setExpression(parseInt(expression).toString(16).toUpperCase())} />
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {/* Кнопка для перехода к истории */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => router.push("/history")}
      >
        <Text style={styles.historyButtonText}>История</Text>
      </TouchableOpacity>

      {/* Экран калькулятора */}
      <View style={styles.screenContainer}>
        <Text
          style={[
            Styles.screenFirstNumber,
            { color: result ? myColors.result : myColors.white },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {result ?? (expression || "0")}
        </Text>
      </View>

      {/* Клавиатура */}
      <View style={styles.keyboardContainer}>
        {renderCurrentKeyboard()}
        <View style={Styles.row}>
          <Button title="Switch Keyboard" isGray onPress={switchKeyboardType} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: myColors.black,
  },
  screenContainer: {
    height: 120,
    justifyContent: "center",
    alignItems: "flex-end",
    padding: 20,
  },
  keyboardContainer: {
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  historyButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: myColors.gray,
    borderRadius: 5,
  },
  historyButtonText: {
    color: myColors.white,
  },
});