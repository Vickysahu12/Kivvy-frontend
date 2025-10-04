import React, { useState, useRef, useCallback, useEffect } from "react";
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
  Alert,
  ActivityIndicator,
} from "react-native";
import SignatureCanvas from "react-native-signature-canvas";
import LinearGradient from "react-native-linear-gradient";

const { height, width } = Dimensions.get("window");

const COLORS = {
  primary: "#FFD93D",
  secondary: "#A0E7E5",
  tertiary: "#FFAEBC",
  accent: "#B4F8C8",
  white: "#FFFFFF",
  error: "#FF5959",
  success: "#54C345",
};

const DrawingScreen = ({ navigation, route }) => {
  // State management - Production ready
  const [selectedColor, setSelectedColor] = useState("#FF5959");
  const [isSaving, setIsSaving] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get task data from route params or use default
  const taskData = route?.params || {
    taskTitle: "Draw a Happy Dinosaur",
    taskEmoji: "🦖",
    inspirationImage: "https://placehold.co/600x300/FFCC00/fff?text=Dinosaur",
    taskId: null,
  };

  // Refs
  const canvasRef = useRef(null);

  // Color palette - can be fetched from API
  const COLORS_PALETTE = [
    { color: "#FF5959", name: "Red" },
    { color: "#F6BD60", name: "Yellow" },
    { color: "#54C345", name: "Green" },
    { color: "#4596F0", name: "Blue" },
    { color: "#8E44AD", name: "Purple" },
    { color: "#E84393", name: "Pink" },
    { color: "#F07F20", name: "Orange" },
    { color: "#333333", name: "Black" },
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        canvasRef.current = null;
      }
    };
  }, []);

  // Track if user has drawn anything
  useEffect(() => {
    // In production, you can add a listener to detect canvas changes
    // For now, we'll set it to true when user selects a color
  }, []);

  // Handle canvas save
  const handleSave = useCallback(async (signature) => {
    if (!signature) {
      Alert.alert("Empty Canvas", "Please draw something first!");
      return;
    }

    setIsSaving(true);

    try {
      console.log("Drawing saved:", signature);

      // TODO: Upload to backend
      // const response = await fetch('YOUR_API/drawings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     taskId: taskData.taskId,
      //     drawingData: signature,
      //     timestamp: new Date().toISOString(),
      //   }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success feedback
      Alert.alert(
        "Great Job! 🎉",
        "Your drawing has been saved successfully!",
        [
          {
            text: "Draw More",
            onPress: () => handleClear(),
          },
          {
            text: "Done",
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error) {
      console.error("Save error:", error);
      Alert.alert(
        "Save Failed",
        "Unable to save your drawing. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSaving(false);
    }
  }, [taskData.taskId, navigation]);

  // Handle clear canvas
  const handleClear = useCallback(() => {
    if (!hasDrawn) {
      return; // Nothing to clear
    }

    Alert.alert(
      "Clear Drawing?",
      "Are you sure you want to erase everything?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            if (canvasRef.current) {
              canvasRef.current.clearSignature();
              setHasDrawn(false);
            }
          },
        },
      ]
    );
  }, [hasDrawn]);

  // Handle color selection
  const handleColorSelect = useCallback((color) => {
    try {
      if (canvasRef.current) {
        canvasRef.current.changePenColor(color);
        setSelectedColor(color);
        setHasDrawn(true); // User is about to draw
      }
    } catch (error) {
      console.error("Color change error:", error);
    }
  }, []);

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!hasDrawn) {
      Alert.alert(
        "Nothing to Submit",
        "Please draw something first!",
        [{ text: "OK" }]
      );
      return;
    }

    if (canvasRef.current) {
      canvasRef.current.readSignature();
    }
  }, [hasDrawn]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (hasDrawn) {
      Alert.alert(
        "Discard Drawing?",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Stay", style: "cancel" },
          { text: "Discard", style: "destructive", onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  }, [hasDrawn, navigation]);

  // Canvas style configuration
  const styleSignature = `
    .m-signature-pad--footer {display: none; margin: 0;}
    .m-signature-pad {box-shadow: none; border: none;}
    body, html {margin: 0; padding: 0; height: 100%; width: 100%;}
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor="transparent" 
        translucent 
        barStyle="dark-content" 
      />

      {/* Gradient Background */}
      <LinearGradient
        colors={[COLORS.secondary, COLORS.tertiary]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityHint="Double tap to return to previous screen"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text 
            style={styles.headerText}
            accessibilityRole="header"
          >
            🎨 Today's Task
          </Text>
          <Text style={styles.promptText}>
            {taskData.taskTitle} {taskData.taskEmoji}
          </Text>
        </View>
      </View>

      {/* Inspiration Image */}
      <View style={styles.imageBox}>
        {isImageLoading && (
          <View style={styles.imageLoadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}
        
        {imageError ? (
          <View style={styles.imageErrorContainer}>
            <Text style={styles.imageErrorText}>Image unavailable</Text>
          </View>
        ) : (
          <Image
            source={{ uri: taskData.inspirationImage }}
            style={styles.inspirationImage}
            onLoadStart={() => setIsImageLoading(true)}
            onLoadEnd={() => setIsImageLoading(false)}
            onError={(error) => {
              console.log("Image load error:", error);
              setIsImageLoading(false);
              setImageError(true);
            }}
            accessibilityLabel="Inspiration image for drawing task"
          />
        )}
        <Text style={styles.imageLabel}>Inspiration</Text>
      </View>

      {/* Drawing Canvas */}
      <View style={styles.canvasWrapper}>
        <SignatureCanvas
          ref={canvasRef}
          onOK={handleSave}
          onEmpty={() => console.log("Canvas is empty")}
          onBegin={() => setHasDrawn(true)}
          penColor={selectedColor}
          webStyle={styleSignature}
          backgroundColor={COLORS.white}
          minWidth={2}
          maxWidth={4}
          autoClear={false}
          descriptionText=""
          accessibilityLabel="Drawing canvas"
        />
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        {/* Color Palette */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.colorPalette}
          contentContainerStyle={styles.colorPaletteContent}
          accessibilityLabel="Color palette"
        >
          {COLORS_PALETTE.map((item) => (
            <TouchableOpacity
              key={item.color}
              style={[
                styles.colorBtn,
                { backgroundColor: item.color },
                selectedColor === item.color && styles.selectedColor,
              ]}
              onPress={() => handleColorSelect(item.color)}
              activeOpacity={0.7}
              accessibilityLabel={`${item.name} color`}
              accessibilityHint="Double tap to select this color"
              accessibilityRole="button"
              accessibilityState={{ selected: selectedColor === item.color }}
            />
          ))}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={handleClear} 
            style={[
              styles.clearBtn,
              !hasDrawn && styles.disabledBtn
            ]}
            disabled={!hasDrawn}
            activeOpacity={0.8}
            accessibilityLabel="Erase drawing"
            accessibilityHint="Double tap to clear the canvas"
            accessibilityRole="button"
            accessibilityState={{ disabled: !hasDrawn }}
          >
            <Text style={styles.buttonText}>🧽 Erase</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.saveBtn,
              (!hasDrawn || isSaving) && styles.disabledBtn
            ]}
            disabled={!hasDrawn || isSaving}
            activeOpacity={0.8}
            accessibilityLabel="Submit drawing"
            accessibilityHint="Double tap to save and submit your drawing"
            accessibilityRole="button"
            accessibilityState={{ disabled: !hasDrawn || isSaving }}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Submit 🥳</Text>
            )}
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
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#F6BD60",
    marginBottom: 15,
    marginTop: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  imageLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  imageErrorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  imageErrorText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    minHeight: 300,
  },
  toolbar: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  colorPalette: {
    flexGrow: 0,
    marginBottom: 15,
  },
  colorPaletteContent: {
    paddingVertical: 5,
  },
  colorBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 6,
    borderWidth: 3,
    borderColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedColor: {
    borderColor: "#FFD700",
    elevation: 5,
    shadowOpacity: 0.3,
    transform: [{ scale: 1.1 }],
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clearBtn: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 14,
    borderRadius: 15,
    backgroundColor: COLORS.error,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    minHeight: 50,
  },
  saveBtn: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 14,
    borderRadius: 15,
    backgroundColor: COLORS.success,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    minHeight: 50,
  },
  disabledBtn: {
    opacity: 0.5,
    elevation: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DrawingScreen;