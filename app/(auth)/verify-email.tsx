import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, StyleSheet, Platform, View, Text, TextInput, TouchableOpacity } from "react-native";
import { verifyEmail, resendVerificationEmail } from "@/services/auth.service";
import { router, useLocalSearchParams } from "expo-router";

export default function verifyEmailScreen() {
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationMessage, setVerificationMessage] = useState("");
    const {email} = useLocalSearchParams<{email: string}>();

    const handleVerifyEmail = async () => {
        const response = await verifyEmail(email, verificationCode);
        console.log("Response from verify email: ", JSON.stringify(response));

        if (response.success) {
            router.push('./(tabs');
        } else {
            setVerificationMessage(response.errorMessage ?? "Invalid Code");
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Text style={styles.title}>Email Verification sent to your email</Text>

                <View style={styles.container}>
                    <TextInput style={styles.input}
                        keyboardType="number-pad"
                        maxLength={6}
                        autoCapitalize="none"
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                    />

                    <Text style={styles.verificationMessage}>{verificationMessage}</Text>

                    <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyEmail} disabled={verificationCode.length < 6}>
                        <Text style={styles.buttonText}>Verify</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.resendButton}>
                        <Text style={styles.linkText}>Resend Code</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {

    },

    container: {

    },

    title: {

    },

    input: {

    },

    verificationMessage: {

    },

    verifyButton: {

    },

    resendButton: {

    },

    buttonText: {

    },

    linkText: {

    }




})