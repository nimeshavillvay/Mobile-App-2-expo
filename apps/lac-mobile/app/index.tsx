import { StyleSheet, Text, View } from "react-native";

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text>test</Text>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
