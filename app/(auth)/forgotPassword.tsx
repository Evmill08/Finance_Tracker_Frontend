import { confirmPaswordReset, requestPasswordReset } from "@/services/Auth/auth.service";
import { useState } from "react";
import { validateEmail, validatePasswordMatch } from "@/services/Auth/authValidation";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, KeyboardAvoidingView, Text, View, Platform, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PASSWORD_REQUIREMENTS } from "@/utils/passwordRequirements";
import { router } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(true);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const isPasswordValid = PASSWORD_REQUIREMENTS.every(req => req.isValid(newPassword));

  const handleSendVerificationEmail = async () => {
    const response = await requestPasswordReset(email);

    if (response.success) {
      setShowEmailInput(false);
      setShowCodeInput(true);
      setMessage("Verification code sent!");
    } else {
      setMessage("Error validating email address");
    }
  };

  const handleResetPassword = async () => {
    const response = await confirmPaswordReset(email, verificationCode, newPassword);

    if (response.success) {
      setMessage("Success! Redirecting to login...");
      router.replace("/login");
    } else {
      setMessage("Error validating your new password");
    }
  };

  const handleSetEmail = (email: string) => {
    setEmail(email);

    if (!validateEmail(email)){
      setEmailError("Invalid Email");
    } else {
      setEmailError(null);
    }
  };

  const handleNaviateLogin = () => {
    router.replace("/(auth)/login");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <Text style={styles.title}>Forgot Password</Text>

          {message && <Text style={styles.message}>{message}</Text>}

          {showEmailInput && (
            <View style={styles.section}>
              <Text style={styles.description}>
                Enter your email address and we’ll send you a verification code
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Email address"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={handleSetEmail}
              />

              {emailError && <Text style={styles.error}>{emailError}</Text>}

              <TouchableOpacity
                style={[
                  styles.button,
                  !validateEmail(email) && styles.disabledButton,
                ]}
                onPress={handleSendVerificationEmail}
                disabled={!validateEmail(email)}
              >
                <Text style={styles.buttonText}>Send Code</Text>
              </TouchableOpacity>
            </View>
          )}

          {showCodeInput && (
            <View style={styles.section}>
              <Text style={styles.description}>
                Enter the verification code and choose a new password
              </Text>

              <TextInput
                style={styles.codeInput}
                placeholder="e.g. 123456"
                keyboardType="number-pad"
                maxLength={6}
                value={verificationCode}
                onChangeText={setVerificationCode}
              />

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="New Password"
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  style={styles.passwordVisibilityButton}
                  onPress={() => setIsPasswordVisible(prev => !prev)}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye" : "eye-off"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordConstraintsContainer}>
                <Text style={styles.passwordConstraintsTitle}>
                  Password must include:
                </Text>

                {PASSWORD_REQUIREMENTS.map(req => {
                  const satisfied = req.isValid(newPassword);
                  return (
                    <View key={req.id} style={styles.passwordRequirementRow}>
                      <Text
                        style={[
                          styles.passwordRequirementIcon,
                          satisfied ? styles.valid : styles.invalid,
                        ]}
                      >
                        {satisfied ? "✓" : "✕"}
                      </Text>
                      <Text
                        style={[
                          styles.passwordRequirementText,
                          satisfied ? styles.valid : styles.invalid,
                        ]}
                      >
                        {req.label}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm Password"
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  (!isPasswordValid ||
                    !validatePasswordMatch(newPassword, confirmPassword)) &&
                    styles.disabledButton,
                ]}
                onPress={handleResetPassword}
                disabled={
                  !isPasswordValid ||
                  !validatePasswordMatch(newPassword, confirmPassword)
                }
              >
                <Text style={styles.buttonText}>Reset Password</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity onPress={handleNaviateLogin}>
            <Text style={styles.linkText}>Return to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  section: {
    marginBottom: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },

  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
  },

  message: {
    textAlign: "center",
    marginBottom: 16,
    color: "#2D3047",
    fontWeight: "500",
  },

  error: {
    color: "#a02626",
    textAlign: "center",
    marginBottom: 8,
  },

  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
  },

  codeInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 4,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 48,
    marginBottom: 12,
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    height: "100%",
  },

  passwordVisibilityButton: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  passwordConstraintsContainer: {
    marginBottom: 16,
  },

  passwordConstraintsTitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },

  passwordRequirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },

  passwordRequirementIcon: {
    width: 20,
    fontWeight: "bold",
  },

  passwordRequirementText: {
    fontSize: 13,
  },

  valid: {
    color: "#53a026",
  },

  invalid: {
    color: "#a02626",
  },

  button: {
    backgroundColor: "#7981c0",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  linkText: {
    color: "#7981c0",
    textAlign: "center",
    fontSize: 16,
  },
});
