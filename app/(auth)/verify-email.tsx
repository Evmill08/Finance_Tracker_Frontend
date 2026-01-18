import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, StyleSheet, Platform, View, Text, TextInput, TouchableOpacity } from "react-native";
import { verifyEmail, resendVerificationEmail } from "@/services/auth.service";
import { router, useLocalSearchParams } from "expo-router";

export default function verifyEmailScreen() {
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationMessage, setVerificationMessage] = useState("");
    const {email} = useLocalSearchParams<{email: string}>();


    // TODO: If having trouble with sql, dont be an idiot, make sure to actually start and connect to the server

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
        flex: 1,
        backgroundColor: "#fff"
    },

    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24
    },

    title: {
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 32,
        textAlign: "center"
    },

    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12
    },

    verificationMessage: {

    },

    verifyButton: {
        backgroundColor: "#2D3047",
        height: 48,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8
    },

    resendButton: {

    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },

    linkText: {
        color: "#2D3047",
        textAlign: "center",
        marginTop: 12
    },
})