import { Text, View } from "tamagui";
import AppTab from "../../components/base/app-tab";

const MorePage = () => {
  return (
    <AppTab title="Home">
      <View
        flex={1}
        backgroundColor="white"
        alignItems="center"
        justifyContent="center"
      >
        <Text>More Page</Text>
      </View>
    </AppTab>
  );
};

export default MorePage;
