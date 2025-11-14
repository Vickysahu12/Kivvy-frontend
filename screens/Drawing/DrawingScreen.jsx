import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import SignatureCanvas from "react-native-signature-canvas";
import LinearGradient from "react-native-linear-gradient";

const KidsDrawingScreen = () => {
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState("#000");

  const COLORS = [
    "#FF5959", "#F6BD60", "#54C345",
    "#4596F0", "#8E44AD", "#E84393",
    "#333333",
  ];

  return (
    <SafeAreaView style={styles.container}>

      {/* Gradient Background */}
      <LinearGradient
        colors={["#A0E7E5", "#FFAEBC"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How to Draw</Text>
      </View>

      {/* Floating Tool Bar (Left Side) */}
      <View style={styles.toolBar}>
        <TouchableOpacity style={styles.toolBtn}><Text style={styles.toolIcon}>✏️</Text></TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn}><Text style={styles.toolIcon}>🧽</Text></TouchableOpacity>
        <TouchableOpacity
          style={styles.toolBtn}
          onPress={() => canvasRef.current.undo()}
        >
          <Text style={styles.toolIcon}>↩️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolBtn}
          onPress={() => canvasRef.current.redo()}
        >
          <Text style={styles.toolIcon}>↪️</Text>
        </TouchableOpacity>
      </View>

      {/* Drawing Canvas */}
      <View style={styles.canvasWrapper}>
        <SignatureCanvas
          ref={canvasRef}
          penColor={selectedColor}
          backgroundColor="#fff"
          webStyle={styles.canvasStyle}
        />
      </View>

      {/* Bottom Color Palette */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.colorRow}
      >
        {COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorCircle,
              { backgroundColor: c },
              selectedColor === c && styles.selectedColor,
            ]}
            onPress={() => setSelectedColor(c)}
          />
        ))}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },

  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  backText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 28,
    marginLeft: 15,
    color: "#fff",
    fontWeight: "900",
  },

  toolBar: {
    position: "absolute",
    left: 20,
    top: 140,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 12,
    borderRadius: 22,
    zIndex: 10,
  },

  toolBtn: {
    marginVertical: 10,
  },
  toolIcon: {
    fontSize: 28,
  },

  canvasWrapper: {
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 10,
  },

  canvasStyle: `
    .m-signature-pad--footer { display: none; }
    body,html { margin: 0; padding: 0; }
  `,

  colorRow: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },

  colorCircle: {
    width: 45,
    height: 45,
    borderRadius: 30,
    marginHorizontal: 8,
    elevation: 3,
  },

  selectedColor: {
    borderWidth: 4,
    borderColor: "#FFD93D",
    transform: [{ scale: 1.15 }],
  },
});

export default KidsDrawingScreen;
