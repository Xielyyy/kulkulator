import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useHistory } from "../context/HistoryContext";

export default function HistoryScreen() {
  const { history, clearHistory } = useHistory();

  return (
    <View style={styles.container}>
      <ScrollView>
        {history.map(({ expression, result }, idx) => (
          <View key={idx} style={styles.historyItem}>
            <Text style={styles.historyExpression}>{expression}</Text>
            <Text style={styles.historyResult}>= {result}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.clearHistoryButton} onPress={clearHistory}>
        <Text style={styles.clearHistoryButtonText}>Очистить историю</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  historyExpression: {
    color: "#fff",
    fontSize: 16,
  },
  historyResult: {
    color: "#0f0",
    fontSize: 16,
  },
  clearHistoryButton: {
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  clearHistoryButtonText: {
    color: "#fff",
  },
});