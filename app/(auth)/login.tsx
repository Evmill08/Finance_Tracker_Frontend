import { login } from "@/services/Auth/auth.service";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import { useAuth } from "@/hooks/use-auth";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const {setTokenFromVerification} = useAuth();
    
    const handleLogin = async () => {
        const response = await login(email, password);

        if (response.success){
            const jwt = response.data as string;
            await setTokenFromVerification(jwt);
        } else {
            throw new Error(response.errorMessage);
        }
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

                    <View style={styles.inputContainer}>
                        <TextInput style={styles.passwordInput}
                            placeholder="Password"
                            secureTextEntry={!isPasswordVisible} 
                            autoCapitalize="none"
                            textContentType="password"
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity 
                            style={styles.passwordVisibilityButton} 
                            onPress={() => setIsPasswordVisible(prev => !prev)}
                            hitSlop={10}
                        >
                            <Ionicons
                                name={isPasswordVisible ? "eye" : "eye-off"}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>

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
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        height: 48,
        marginBottom: 8,
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
        height: "100%",
    },

    passwordVisibilityIcon: {
        fontSize: 18,
    },
})