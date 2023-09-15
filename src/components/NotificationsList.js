import { FlatList, useWindowDimensions } from "react-native";

import notifications from "../../assets/data/notifications";

import NotificationItem from "./NotificationItem";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const NotificationsList = ({
  footerVisibility,
  footerHeight,
  ...flatListProps
}) => {
  const { height } = useWindowDimensions();
  const listVisibility = useSharedValue(1);
  const scrollY = useSharedValue(0);

  const handler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      scrollY.value = y;
      //console.log("scrollY.value", scrollY.value);

      if (y < 10) {
        // тут ще футер має бути відкритим
        footerVisibility.value = withTiming(1);
      } else {
        // close the footer
        footerVisibility.value = withTiming(0);
      }
    },
    onBeginDrag: (event) => {
      if (listVisibility.value < 1) {
        listVisibility.value = withSpring(1);
      }
    },
    onEndDrag: (event) => {
      const y = event.contentOffset.y;
      //console.log("in onEndDrag", event.contentOffset.y);
      if (y < 0) {
        listVisibility.value = withTiming(0);
      }
    },
  });

  return (
    <Animated.FlatList
      data={notifications}
      renderItem={({ item, index }) => (
        <NotificationItem
          data={item}
          index={index}
          listVisibility={listVisibility}
          scrollY={scrollY}
          footerHeight={footerHeight}
        />
      )}
      {...flatListProps}
      onScroll={handler}
      // ми не хочемо щоби ця onScroll event викликалася більше ніж 60 разів за секунду
      // ми хочемо мати 60 FPS анімацію. якщо буде більше 60 то це не покращить нічого
      // більшість телефонів мають 60FPS refresh rate
      // 1000мс / 60fps = 16      -- кожних 16 мс буде викликатися onScroll
      scrollEventThrottle={16} // лімітуємо
    />
  );
};

export default NotificationsList;
