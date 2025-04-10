import * as React from "react";
import { View, Text, PanResponder, StyleSheet, Animated, Easing } from "react-native";
import Button from "./Button";
import { Styles } from "../styles/GlobalStyles";
import { myColors } from "../styles/Colors";

export default function MyKeyboard() {
  const [firstNumber, setFirstNumber] = React.useState("");
  const [secondNumber, setSecondNumber] = React.useState("");
  const [operation, setOperation] = React.useState("");
  const [result, setResult] = React.useState<number | null>(null);
  const [keyboardType, setKeyboardType] = React.useState<KeyboardType>("basic");
  const [indicatorIndex, setIndicatorIndex] = React.useState(0);
  const [history, setHistory] = React.useState<string[]>([]); // История вычислений
  
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const keyboardOrder = ["basic", "scientific", "programmer"] as const;
  type KeyboardType = typeof keyboardOrder[number];

  const animateTransition = (direction: "left" | "right") => {
    const currentIndex = indicatorIndex;
    const newIndex =
      direction === "right"
        ? (currentIndex + 1) % keyboardOrder.length
        : (currentIndex - 1 + keyboardOrder.length) % keyboardOrder.length;

    const toValue = direction === "right" ? -200 : 200;

    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setKeyboardType(keyboardOrder[newIndex]);
      setIndicatorIndex(newIndex);
      slideAnim.setValue(0);
    });
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        slideAnim.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          animateTransition("right");
        } else if (gestureState.dx < -50) {
          animateTransition("left");
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleNumberPress = (buttonValue: string) => {
    if (buttonValue === "." && firstNumber.includes(".")) return;
    if (firstNumber.length < 10) {
      setFirstNumber(firstNumber + buttonValue);
    }
  };

  const handleOperationPress = (buttonValue: string) => {
    if (firstNumber === "" && buttonValue === "-") {
      setFirstNumber("-");
      return;
    }
    if (firstNumber === "-") return;

    setOperation(buttonValue);
    setSecondNumber(firstNumber);
    setFirstNumber("");
  };

  const clear = () => {
    setFirstNumber("");
    setSecondNumber("");
    setOperation("");
    setResult(null);
  };

  const handleScientificPress = (func: string) => {
    const num = parseFloat(firstNumber || "0");
    let calculation = 0;

    switch (func) {
      case "sin":
        calculation = Math.sin(num);
        break;
      case "cos":
        calculation = Math.cos(num);
        break;
      case "tan":
        calculation = Math.tan(num);
        break;
      case "log":
        calculation = Math.log10(num);
        break;
      case "ln":
        calculation = Math.log(num);
        break;
      case "√":
        calculation = Math.sqrt(num);
        break;
      case "x²":
        calculation = Math.pow(num, 2);
        break;
      case "x³":
        calculation = Math.pow(num, 3);
        break;
      case "x^y":
        setOperation("^");
        setSecondNumber(firstNumber);
        setFirstNumber("");
        return;
      case "π":
        setFirstNumber(Math.PI.toString());
        return;
      case "e":
        setFirstNumber(Math.E.toString());
        return;
    }

    setResult(calculation);
    setFirstNumber(calculation.toString());
  };

  const handleProgrammerPress = (type: string) => {
    const num = parseInt(firstNumber || "0");

    switch (type) {
      case "BIN":
        setFirstNumber(num.toString(2));
        break;
      case "HEX":
        setFirstNumber(num.toString(16).toUpperCase());
        break;
      case "DEC":
        setFirstNumber(num.toString());
        break;
      case "OCT":
        setFirstNumber(num.toString(8));
        break;
    }
  };

  const getResult = () => {
    if (operation === "" || firstNumber === "") return;

    const num1 = parseFloat(secondNumber);
    const num2 = parseFloat(firstNumber);

    let calculation = 0;
    switch (operation) {
      case "+":
        calculation = num1 + num2;
        break;
      case "-":
        calculation = num1 - num2;
        break;
      case "*":
        calculation = num1 * num2;
        break;
      case "/":
        calculation = num1 / num2;
        break;
      case "^":
        calculation = Math.pow(num1, num2);
        break;
      default:
        calculation = 0;
    }

    setResult(calculation);
    setFirstNumber(calculation.toString());
    setSecondNumber("");
    setOperation("");
    addToHistory(calculation.toString());
  };

  const addToHistory = (result: string) => {
    setHistory((prevHistory) => [result, ...prevHistory]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const firstNumberDisplay = () => {
    if (result !== null) {
      return (
        <Text
          style={
            Math.abs(result) < 99999
              ? [Styles.screenFirstNumber, { color: myColors.result }]
              : [Styles.screenFirstNumber, { fontSize: 50, color: myColors.result }]
          }
        >
          {result.toString()}
        </Text>
      );
    }
    if (firstNumber && firstNumber.length < 6) {
      return <Text style={Styles.screenFirstNumber}>{firstNumber}</Text>;
    }
    if (firstNumber === "") {
      return <Text style={Styles.screenFirstNumber}>{"0"}</Text>;
    }
    if (firstNumber.length > 5 && firstNumber.length < 8) {
      return (
        <Text style={[Styles.screenFirstNumber, { fontSize: 70 }]}>
          {firstNumber}
        </Text>
      );
    }
    if (firstNumber.length > 7) {
      return (
        <Text style={[Styles.screenFirstNumber, { fontSize: 50 }]}>
          {firstNumber}
        </Text>
      );
    }
  };

  const renderBasicKeyboard = () => (
    <>
      <View style={Styles.row}>
        <Button title="C" isGray onPress={clear} />
        <Button
          title="+/-"
          isGray
          onPress={() => {
            if (firstNumber) {
              setFirstNumber(
                firstNumber.startsWith("-")
                  ? firstNumber.substring(1)
                  : `-${firstNumber}`
              );
            }
          }}
        />
        <Button title="％" isGray onPress={() => handleOperationPress("%")} />
        <Button title="÷" isBlue onPress={() => handleOperationPress("/")} />
      </View>
      <View style={Styles.row}>
        <Button title="7" onPress={() => handleNumberPress("7")} />
        <Button title="8" onPress={() => handleNumberPress("8")} />
        <Button title="9" onPress={() => handleNumberPress("9")} />
        <Button title="×" isBlue onPress={() => handleOperationPress("*")} />
      </View>
      <View style={Styles.row}>
        <Button title="4" onPress={() => handleNumberPress("4")} />
        <Button title="5" onPress={() => handleNumberPress("5")} />
        <Button title="6" onPress={() => handleNumberPress("6")} />
        <Button title="-" isBlue onPress={() => handleOperationPress("-")} />
      </View>
      <View style={Styles.row}>
        <Button title="1" onPress={() => handleNumberPress("1")} />
        <Button title="2" onPress={() => handleNumberPress("2")} />
        <Button title="3" onPress={() => handleNumberPress("3")} />
        <Button title="+" isBlue onPress={() => handleOperationPress("+")} />
      </View>
      <View style={Styles.row}>
        <Button title="." onPress={() => handleNumberPress(".")} />
        <Button title="0" onPress={() => handleNumberPress("0")} />
        <Button
          title="⌫"
          onPress={() => setFirstNumber(firstNumber.slice(0, -1))}
        />
        <Button title="=" isBlue onPress={getResult} />
      </View>
    </>
  );

  const renderScientificKeyboard = () => (
    <>
      <View style={Styles.row}>
        <Button title="sin" isGray onPress={() => handleScientificPress("sin")} />
        <Button title="cos" isGray onPress={() => handleScientificPress("cos")} />
        <Button title="tan" isGray onPress={() => handleScientificPress("tan")} />
        <Button title="π" isBlue onPress={() => handleScientificPress("π")} />
      </View>
      <View style={Styles.row}>
        <Button title="log" isGray onPress={() => handleScientificPress("log")} />
        <Button title="ln" isGray onPress={() => handleScientificPress("ln")} />
        <Button title="√" isGray onPress={() => handleScientificPress("√")} />
        <Button title="x^y" isBlue onPress={() => handleScientificPress("x^y")} />
      </View>
      <View style={Styles.row}>
        <Button title="x²" isGray onPress={() => handleScientificPress("x²")} />
        <Button title="x³" isGray onPress={() => handleScientificPress("x³")} />
        <Button title="e" isGray onPress={() => handleScientificPress("e")} />
      </View>
      <View style={Styles.row}>
        <Button title="(" isGray onPress={() => handleNumberPress("(")} />
        <Button title=")" isGray onPress={() => handleNumberPress(")")} />
      </View>
    </>
  );

  const renderProgrammerKeyboard = () => (
    <>
      <View style={Styles.row}>
        <Button title="HEX" isGray onPress={() => handleProgrammerPress("HEX")} />
        <Button title="DEC" isGray onPress={() => handleProgrammerPress("DEC")} />
        <Button title="OCT" isGray onPress={() => handleProgrammerPress("OCT")} />
        <Button title="BIN" isBlue onPress={() => handleProgrammerPress("BIN")} />
      </View>
      <View style={Styles.row}>
        <Button title="AND" isGray onPress={() => {}} />
        <Button title="OR" isGray onPress={() => {}} />
        <Button title="XOR" isGray onPress={() => {}} />
        <Button title="NOT" isBlue onPress={() => {}} />
      </View>
      <View style={Styles.row}>
        <Button title="<<" isGray onPress={() => {}} />
        <Button title=">>" isGray onPress={() => {}} />
        <Button title="MOD" isGray onPress={() => {}} />
        <Button title="|" isBlue onPress={() => {}} />
      </View>
    </>
  );

  const renderIndicator = () => (
    <View style={styles.indicatorContainer}>
      {keyboardOrder.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicatorDot,
            index === indicatorIndex && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );

  const renderCurrentKeyboard = () => {
    switch (keyboardType) {
      case "scientific":
        return renderScientificKeyboard();
      case "programmer":
        return renderProgrammerKeyboard();
      default:
        return renderBasicKeyboard();
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.keyboardContainer, { transform: [{ translateX: slideAnim }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.screenContainer}>
          {firstNumberDisplay()}
        </View>
        {renderCurrentKeyboard()}
        {renderIndicator()}
      </View>
      <View style={styles.historyContainer}>
        <Text onPress={clearHistory}>Clear History</Text>
        {history.length > 0 && (
          <View>
            {history.map((item, index) => (
              <Text key={index}>{item}</Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardContainer: {
    width: "100%",
    height: "80%",
  },
  screenContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 4,
    backgroundColor: "#ccc",
  },
  activeDot: {
    backgroundColor: "#00f",
  },
  historyContainer: {
    padding: 20,
  },
});
