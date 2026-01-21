import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, StyleSheet, Platform, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { verifyEmail, resendVerificationEmail } from "@/services/Auth/auth.service";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/use-auth";

export default function verifyEmailScreen() {
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationMessage, setVerificationMessage] = useState("");
    const {email} = useLocalSearchParams<{email: string}>();
    const {setTokenFromVerification} = useAuth();


    // TODO: If having trouble with sql, dont be an idiot, make sure to actually start and connect to the server
    const handleVerifyEmail = async () => {
        const response = await verifyEmail(email, verificationCode);

        if (response.success) {
            const JwtToken = response.data as string;
            await setTokenFromVerification(JwtToken);
            router.replace("/(app)/link-bank");
        } else {
            setVerificationMessage(response.errorMessage ?? "Invalid Verification Code");
        }
    }

    // const handleResendCode = async () => {
    //     const response = await resendVerificationEmail(verificationToken);

    //     if (response.success){
    //         setVerificationCode("");
    //         setVerificationMessage("Verification code has been resent");
    //     } else {
    //         setVerificationMessage(response.errorMessage ?? "Error resending verification code");
    //     }
    // }

    const handleNavigateSignup = () => {
        router.replace("/(auth)/signup");
    }

    return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <Text style={styles.title}>Verify Your Email</Text>

          <View style={styles.section}>
            <Text style={styles.description}>
              We sent a 6-digit verification code to:
            </Text>

            <Text style={styles.email}>{email}</Text>

            <TextInput
              style={styles.codeInput}
              placeholder="e.g. 123456"
              keyboardType="number-pad"
              maxLength={6}
              value={verificationCode}
              onChangeText={setVerificationCode}
            />

            {verificationMessage && (
              <Text style={styles.message}>{verificationMessage}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                verificationCode.length < 6 && styles.disabledButton,
              ]}
              onPress={handleVerifyEmail}
              disabled={verificationCode.length < 6}
            >
              <Text style={styles.buttonText}>Verify Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendButton}>
              <Text style={styles.linkText}>Resend Code</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendButton} onPress={handleNavigateSignup}>
              <Text style={styles.linkText}>Return to Signup</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 4,
  },

  email: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D3047",
    textAlign: "center",
    marginBottom: 20,
  },

  codeInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 4,
  },

  message: {
    textAlign: "center",
    marginBottom: 12,
    color: "#a02626",
    fontWeight: "500",
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

  resendButton: {
    marginTop: 12,
  },

  linkText: {
    color: "#7981c0",
    textAlign: "center",
    fontSize: 16,
  },
});
