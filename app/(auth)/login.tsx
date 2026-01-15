import { login } from "@/services/auth.service";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity} from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleLogin = async () => {
        console.log("Logging in with: ", email, password);
        const response = await login(email, password);
        console.log(response);
    }

    const handleForgotPassword = () => {

    }

    const handleNaviateSignup = () => {
        router.push("./signup");
    }

    // TODO: Add validation for email and password

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Text style={styles.title}>Login</Text>

                <View style={styles.container}>
                    <TextInput style={styles.input}
                        placeholder="Email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* TODO: Use something to get the little eye icon here to show password */}
                    <TextInput style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={!email || ! password}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    {/* TODO: Figure out email service to change password */}
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleNaviateSignup}>
                        <Text style={styles.navigateSignup}>Don't have an account? Signup</Text>
                    </TouchableOpacity>


                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
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

    form: {
        gap: 16
    },

    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12
    },

    loginButton: {
        backgroundColor: "#2D3047",
        height: 48,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600"
    },

    forgotPasswordLink: {
        color: "#2D3047",
        textAlign: "center",
        marginTop: 12
    },

    navigateSignup: {
        color: "#2D3047",
        textAlign: "center",
        marginTop: 12
    }
})