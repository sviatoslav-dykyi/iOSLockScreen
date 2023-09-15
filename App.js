import { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
} from "react-native";
import wallpaper from "./assets/images/wallpaper.webp";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import NotificationsList from "./src/components/NotificationsList";
import SwipeUpToOpen from "./src/components/SwipeUpToOpen";

import Animated, {
  SlideInDown,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  useDerivedValue,
} from "react-native-reanimated";

export default function App() {
  const [date, setDate] = useState(dayjs());
  const footerVisibility = useSharedValue(1);
  const footerHeight = useDerivedValue(() => {
    return interpolate(footerVisibility.value, [0, 1], [0, 85]);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(dayjs());
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  const animatedFooterStyle = useAnimatedStyle(() => ({
    marginTop: interpolate(footerVisibility.value, [0, 1], [-85, 0]),
    opacity: footerVisibility.value,
  }));

  return (
    <ImageBackground source={wallpaper} style={styles.container}>
      {/* Notification List */}
      <NotificationsList
        footerVisibility={footerVisibility}
        footerHeight={footerHeight}
        ListHeaderComponent={
          <Animated.View entering={SlideInUp} style={styles.header}>
            <Ionicons name="ios-lock-closed" size={20} color="white" />
            <Text style={styles.date}>{date.format("dddd, DD MMMM")}</Text>
            <Text style={styles.time}>{date.format("hh:mm")}</Text>
          </Animated.View>
        }
      />

      <Animated.View
        entering={SlideInDown}
        style={[styles.footer, animatedFooterStyle]}
      >
        <View style={styles.icon}>
          <MaterialCommunityIcons name="flashlight" size={24} color="white" />
        </View>

        <SwipeUpToOpen />

        <View style={styles.icon}>
          <Ionicons name="ios-camera" size={24} color="white" />
        </View>
      </Animated.View>
      <StatusBar style="dark" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    height: 250,
  },
  date: {
    color: "#C3FFFE",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 20,
  },
  time: {
    fontSize: 82,
    fontWeight: "bold",
    color: "#C3FFFE",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    height: 75,
  },
  icon: {
    backgroundColor: "#00000050",
    width: 50,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  panGestureContainerUnlock: {
    position: "absolute",
    width: "100%",
    height: 200,
    bottom: 0,
    left: 0,
    transform: [
      {
        translateY: 100,
      },
    ],
  },
});
