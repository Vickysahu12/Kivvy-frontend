import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  primary: "#FFD93D", // bright yellow
  secondary: "#A0E7E5", // pastel teal
  tertiary: "#FFAEBC", // soft pink
  accent: "#B4F8C8", // mint green
  textDark: "#333333",
  textLight: "#666666",
  white: "#FFFFFF",
  shadow: "rgba(0,0,0,0.1)",
};

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { text: inputText, sender: "user" }]);
      setInputText("");

      // Mock bot reply
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Yay! That's so cool 😃✨", sender: "bot" },
        ]);
      }, 800);
    }
  };

  // Auto scroll to bottom when new message comes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.secondary, COLORS.tertiary]}
        style={styles.background}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.bottom + 20 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.hiText}>Hello Cutuu💓</Text>
          <Text style={styles.headerEmoji}>🎈</Text>
        </View>

        {/* Chat Area */}
        <ScrollView
          style={styles.chatArea}
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Mascot Section */}
          <View style={styles.introContainer}>
            <Image
              source={require("../../assets/image/mascootii1.png")}
              style={styles.mascotImage}
            />
            <Text style={styles.mascotTitle}>I'm Kivvy 🐥</Text>
            <Text style={styles.mascotSubtitle}>
              Let's talk and have fun together!
            </Text>
          </View>

          {/* Chat Messages */}
          {messages.map((msg, index) => (
            <View
              key={index}
              style={
                msg.sender === "user"
                  ? styles.userMessageContainer
                  : styles.botMessageContainer
              }
            >
              <Text style={styles.messageText}>
                {msg.sender === "user" ? `🧒 ${msg.text}` : `🤖 ${msg.text}`}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Fixed Input Area */}
        <View
          style={[
            styles.inputWrapper,
            { paddingBottom: insets.bottom + 10 }, // 👈 correct safe area padding
          ]}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Talk to me..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Text style={styles.sendButtonText}>🚀</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  hiText: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  headerEmoji: {
    fontSize: 28,
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  mascotImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 15,
  },
  mascotTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  mascotSubtitle: {
    fontSize: 18,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 5,
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    borderBottomRightRadius: 5,
    padding: 12,
    marginBottom: 10,
    maxWidth: "80%",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  botMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    padding: 12,
    marginBottom: 10,
    maxWidth: "80%",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  inputWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "92%",
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  textInput: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 25,
    paddingHorizontal: 18,
    fontSize: 16,
    color: COLORS.textDark,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ChatbotScreen;
