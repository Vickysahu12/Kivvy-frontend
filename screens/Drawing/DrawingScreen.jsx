import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import SignatureCanvas from "react-native-signature-canvas";
import LinearGradient from "react-native-linear-gradient";

const { height } = Dimensions.get("window");

const COLORS = {
  primary: "#FFD93D", // bright yellow
  secondary: "#A0E7E5", // pastel teal
  tertiary: "#FFAEBC", // soft pink
  accent: "#B4F8C8", // mint green
  white: "#FFFFFF",
};

const DrawingScreen = () => {
  const [selectedColor, setSelectedColor] = useState("#FF5959");
  const ref = useRef();

  const COLORS_PALETTE = [
    "#FF5959", "#F6BD60", "#54C345", "#4596F0",
    "#8E44AD", "#E84393", "#F07F20", "#333333"
  ];

  const handleSave = (signature) => {
    console.log("Drawing Saved: ", signature);
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const styleSignature = `
    .m-signature-pad--footer {display: none; margin: 0;}
    .m-signature-pad {box-shadow: none; border: none;}
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />

      {/* Gradient Background */}
      <LinearGradient
        colors={[COLORS.secondary, COLORS.tertiary]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>🎨 Today’s Task</Text>
        <Text style={styles.promptText}>Draw a Happy Dinosaur 🦖</Text>
      </View>

      {/* Inspiration Image */}
      <View style={styles.imageBox}>
        <Image
          source={{
            uri: "https://placehold.co/600x300/FFCC00/fff?text=Dinosaur"
          }}
          style={styles.inspirationImage}
        />
        <Text style={styles.imageLabel}>Inspiration</Text>
      </View>

      {/* Drawing Canvas */}
      <View style={styles.canvasWrapper}>
        <SignatureCanvas
          ref={ref}
          onOK={handleSave}
          penColor={selectedColor}
          webStyle={styleSignature}
        />
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.colorPalette}
        >
          {COLORS_PALETTE.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorBtn,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColor,
              ]}
              onPress={() => {
                ref.current.changePenColor(color);
                setSelectedColor(color);
              }}
            />
          ))}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Text style={styles.buttonText}>🧽 Erase</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => ref.current.readSignature()}
            style={styles.saveBtn}
          >
            <Text style={styles.buttonText}>Submit 🥳</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 20,
  },
  header: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#F6BD60",
    alignItems: "center",
    marginBottom: 15,
    elevation: 6,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
  },
  promptText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 5,
  },
  imageBox: {
    height: height * 0.18,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginBottom: 15,
    overflow: "hidden",
    elevation: 8,
  },
  inspirationImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageLabel: {
    position: "absolute",
    top: 8,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "bold",
  },
  canvasWrapper: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 10,
  },
  toolbar: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 15,
    elevation: 6,
  },
  colorPalette: {
    flexGrow: 1,
    marginBottom: 15,
  },
  colorBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginHorizontal: 6,
    borderWidth: 3,
    borderColor: "transparent",
  },
  selectedColor: {
    borderColor: "#FFD700",
    elevation: 5,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clearBtn: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: "#FF5959",
    alignItems: "center",
  },
  saveBtn: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: "#54C345",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DrawingScreen;
