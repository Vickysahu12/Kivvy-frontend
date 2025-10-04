import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const COLORS = {
  primary: "#FFD93D",
  secondary: "#A0E7E5",
  tertiary: "#FFAEBC",
  accent: "#B4F8C8",
  textDark: "#333333",
  textLight: "#666666",
  white: "#FFFFFF",
  shadow: "rgba(0,0,0,0.1)",
  error: "#FF5959",
};

const MAX_MESSAGE_LENGTH = 500;
const TYPING_DELAY = 800;

const ChatbotScreen = ({ navigation }) => {
  // State management - Production ready
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [chatSessionId, setChatSessionId] = useState(null);

  // Refs
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const insets = useSafeAreaInsets();

  // Initialize chat session
  useEffect(() => {
    initializeChatSession();

    return () => {
      // Cleanup
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Initialize chat with welcome message
  const initializeChatSession = useCallback(async () => {
    try {
      // TODO: Create chat session with backend
      // const response = await fetch('API_ENDPOINT/chat/session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: 'USER_ID' })
      // });
      // const data = await response.json();
      // setChatSessionId(data.sessionId);

      // Simulate session creation
      const mockSessionId = `session_${Date.now()}`;
      setChatSessionId(mockSessionId);

      // Add welcome message
      setMessages([
        {
          id: '1',
          text: "Hi there! I'm Kivvy, your friend! Ask me anything! 🎈",
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Chat initialization error:", error);
      setError("Unable to start chat. Please try again.");
    }
  }, []);

  // Validate and sanitize input
  const validateInput = useCallback((text) => {
    if (!text || text.trim().length === 0) {
      return { valid: false, error: "Message cannot be empty" };
    }

    if (text.length > MAX_MESSAGE_LENGTH) {
      return { 
        valid: false, 
        error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` 
      };
    }

    // Basic profanity check (in production, use proper filter)
    const inappropriateWords = ['badword1', 'badword2']; // Replace with actual list
    const hasInappropriate = inappropriateWords.some(word => 
      text.toLowerCase().includes(word)
    );

    if (hasInappropriate) {
      return { 
        valid: false, 
        error: "Please use appropriate language" 
      };
    }

    return { valid: true, sanitized: text.trim() };
  }, []);

  // Send message to chatbot API
  const sendMessageToBot = useCallback(async (userMessage) => {
    try {
      setIsTyping(true);
      setError(null);

      // TODO: Call actual chatbot API
      // const response = await fetch('API_ENDPOINT/chat/message', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     sessionId: chatSessionId,
      //     message: userMessage,
      //     timestamp: new Date().toISOString(),
      //   })
      // });
      
      // if (!response.ok) throw new Error('Chat API error');
      // const data = await response.json();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));

      // Mock bot response (replace with actual API response)
      const botResponses = [
        "That's interesting! Tell me more! 😊",
        "Wow! That sounds fun! 🎉",
        "I love learning new things! What else? 🌟",
        "You're so smart! Keep going! 💡",
        "That's amazing! I'm so happy! 🎈",
      ];

      const randomResponse = botResponses[
        Math.floor(Math.random() * botResponses.length)
      ];

      const botMessage = {
        id: `msg_${Date.now()}`,
        text: randomResponse,
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Bot response error:", error);
      setError("Oops! I couldn't respond. Try again!");
      
      // Add error message
      const errorMessage = {
        id: `error_${Date.now()}`,
        text: "Sorry, I'm having trouble right now. Please try again! 😅",
        sender: "bot",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [chatSessionId]);

  // Handle send message
  const handleSendMessage = useCallback(async () => {
    // Validate input
    const validation = validateInput(inputText);
    
    if (!validation.valid) {
      Alert.alert("Invalid Message", validation.error);
      return;
    }

    if (isSending || isTyping) {
      return; // Prevent spam
    }

    const messageText = validation.sanitized;
    
    // Create user message
    const userMessage = {
      id: `msg_${Date.now()}_user`,
      text: messageText,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    // Add to messages
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsSending(true);
    Keyboard.dismiss();

    try {
      // Send to bot
      await sendMessageToBot(messageText);
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      setIsSending(false);
    }
  }, [inputText, isSending, isTyping, validateInput, sendMessageToBot]);

  // Auto scroll to bottom
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      // Small delay to ensure render is complete
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Clear error after timeout
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  // Render message item
  const renderMessage = useCallback(({ item }) => {
    const isUser = item.sender === "user";
    const isError = item.isError;

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer,
          isError && styles.errorMessageContainer,
        ]}
        accessibilityLabel={`${isUser ? 'Your message' : 'Bot message'}: ${item.text}`}
        accessibilityRole="text"
      >
        <Text style={styles.messageText}>
          {isUser ? `🧒 ` : `🤖 `}
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  }, []);

  // Render typing indicator
  const renderTypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <Text style={styles.typingText}>🤖 Kivvy is typing</Text>
        <ActivityIndicator size="small" color={COLORS.textDark} />
      </View>
    </View>
  );

  // Render header
  const renderHeader = () => (
    <View style={styles.introContainer}>
      <Image
        source={require("../../assets/image/mascootii1.png")}
        style={styles.mascotImage}
        resizeMode="contain"
        onError={(error) => console.log("Mascot image error:", error)}
        accessibilityLabel="Kivvy mascot"
      />
      <Text style={styles.mascotTitle}>I'm Kivvy 🐥</Text>
      <Text style={styles.mascotSubtitle}>
        Let's talk and have fun together!
      </Text>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Start chatting with Kivvy! 💬
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.secondary, COLORS.tertiary]}
        style={styles.background}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.bottom + 20 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityHint="Double tap to return to previous screen"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.hiText}>Hello Cutuu💓</Text>
          </View>
          <Text style={styles.headerEmoji}>🎈</Text>
        </View>

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Chat Area */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContent}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={isTyping ? renderTypingIndicator : null}
          onContentSizeChange={() => 
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={Platform.OS === 'android'}
          accessibilityLabel="Chat messages"
        />

        {/* Input Area */}
        <View
          style={[
            styles.inputWrapper,
            { paddingBottom: Math.max(insets.bottom, 10) + 10 },
          ]}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Talk to me..."
              placeholderTextColor="#999"
              maxLength={MAX_MESSAGE_LENGTH}
              multiline
              numberOfLines={1}
              editable={!isSending && !isTyping}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              blurOnSubmit={false}
              accessibilityLabel="Message input"
              accessibilityHint="Type your message here"
            />
            <Text style={styles.charCounter}>
              {inputText.length}/{MAX_MESSAGE_LENGTH}
            </Text>
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isSending || isTyping) && 
                styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isSending || isTyping}
              activeOpacity={0.7}
              accessibilityLabel="Send message"
              accessibilityHint="Double tap to send your message"
              accessibilityRole="button"
              accessibilityState={{ 
                disabled: !inputText.trim() || isSending || isTyping 
              }}
            >
              {isSending ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.sendButtonText}>🚀</Text>
              )}
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
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.textDark,
    fontWeight: "bold",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  hiText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  headerEmoji: {
    fontSize: 28,
  },
  errorBanner: {
    backgroundColor: COLORS.error,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  errorText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  chatContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  introContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  mascotImage: {
    width: 130,
    height: 130,
    marginBottom: 15,
  },
  mascotTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  mascotSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 5,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  messageContainer: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    maxWidth: "80%",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 5,
  },
  botMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.accent,
    borderBottomLeftRadius: 5,
  },
  errorMessageContainer: {
    backgroundColor: "#FFE5E5",
  },
  messageText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  typingContainer: {
    marginBottom: 10,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    padding: 12,
    paddingRight: 16,
  },
  typingText: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "600",
    marginRight: 8,
  },
  inputWrapper: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: COLORS.white,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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
    minHeight: 50,
    maxHeight: 100,
    backgroundColor: COLORS.secondary,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingTop: 15,
    fontSize: 16,
    color: COLORS.textDark,
  },
  charCounter: {
    position: "absolute",
    bottom: 12,
    right: 75,
    fontSize: 10,
    color: COLORS.textLight,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#DDD",
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ChatbotScreen;