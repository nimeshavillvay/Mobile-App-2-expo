import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, usePathname, useRouter } from "expo-router";
import { Button, Text, View } from "tamagui";

export const ScreenHeader = ({
  title,
  type,
  hideBackButton = false,
  hideSearchButton = false,
  hideBarcodeScanner = false,
}: {
  readonly title: string;
  readonly type?: string;
  readonly hideBackButton?: boolean;
  readonly hideSearchButton?: boolean;
  readonly hideBarcodeScanner?: boolean;
}) => {
  const router = useRouter();
  const path = usePathname();

  return (
    <View
      flexBasis="auto"
      alignItems="stretch"
      testID="screen-header-main-view"
    >
      <View
        pb={10}
        minHeight={60}
        flexDirection="row"
        alignItems="center"
        testID="screen-header-inner-view"
      >
        {type !== "search" ? (
          <>
            {router.canGoBack() && !hideBackButton && (
              <Button
                onPress={() => router.back()}
                backgroundColor="white"
                testID="back-button"
              >
                <FontAwesome name="angle-left" size={28} />
              </Button>
            )}
            <Text fontSize="$7" ml={12} mr="auto">
              {title}
            </Text>
            <View
              flexDirection="row"
              pr={20}
              alignItems="center"
              columnGap={20}
              testID="screen-header-icons-view"
            >
              {!hideSearchButton && (
                <Link href={`/search`} testID="search-icon">
                  <AntDesign name="search1" size={24} />
                </Link>
              )}

              {!hideBarcodeScanner && (
                <Link href={path}>
                  <MaterialCommunityIcons
                    name="barcode-scan"
                    size={24}
                    testID="barcode-scan-icon"
                  />
                </Link>
              )}
            </View>
          </>
        ) : (
          <>
            <Button
              pos="absolute"
              top={5}
              onPress={() => router.back()}
              backgroundColor="white"
              testID="back-button"
            >
              <FontAwesome name="angle-left" size={28} />
            </Button>

            <Text fontSize="$7" ml="auto" mr="auto" alignSelf="center">
              Search
            </Text>
          </>
        )}
      </View>
    </View>
  );
};
