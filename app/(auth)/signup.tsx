import { signup } from "@/services/Auth/auth.service";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity, ScrollView} from "react-native";
import { router } from "expo-router";
import { validateEmail, validatePassword, validatePasswordMatch } from "@/services/Auth/authValidation";
import { PASSWORD_REQUIREMENTS } from "@/utils/passwordRequirements";
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [error, setError] = useState("");

    const isPasswordValid = PASSWORD_REQUIREMENTS.every(req => req.isValid(password));

    const handleSignup = async () => {
        console.log("Signup up in with: ", email, password);
        const response = await signup(email, password, firstName, lastName);
        console.log(response);

        if (response.success){
            router.replace({pathname: "./verify-email", params: {email}});
        } else{
            setError(response.errorMessage ?? "Error signing up");
        }
    }

    const handleSetEmail = (email: string) => {
        setEmail(email);
        if (!validateEmail(email)){
            setEmailError("Invalid Email");
        } else {
            setEmailError(null);
        }
    }

    const handleNaviateLogin = () => {
        router.replace("/login");
    }

    // TODO: Add some kind of scroll feature to avoid confirm being off screen
    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
                    <Text style={styles.title}>Signup</Text>

                    {/*TODO: Move email and password input containers to a component to use in both login and signup
                    The email input container should have a red error show up underneath when the email is invalid. Disappear when valid */}
                    <View style={styles.container}>
                        <TextInput style={styles.input}
                            placeholder="First Name"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={firstName}
                            onChangeText={setFirstName}
                        />

                        <TextInput style={styles.input}
                            placeholder="Last Name"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={lastName}
                            onChangeText={setLastName}
                        />

                        <TextInput style={styles.input}
                            placeholder="Email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={handleSetEmail}
                        />

                        {emailError && (
                            <Text style={styles.invalidEmail}>{emailError}</Text>
                        )}

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

                        {/* TODO: Animate checkmark and X's */}
                        <View style={styles.passwordConstraintsContainer}>
                            <Text style={styles.passwordConstraintsTitle}>Password must include: </Text>
                            {PASSWORD_REQUIREMENTS.map((req) => {
                                const satisfied = req.isValid(password);

                                return (
                                    <View key={req.id} style={styles.passwordRequirementRow}>
                                        <Text style={[styles.passwordRequirementIcon, satisfied ? styles.valid: styles.invalid]}>
                                            {satisfied ? "✓" : "✕"}
                                        </Text>

                                        <Text style={[styles.passwordRequirementText, satisfied ? styles.valid : styles.invalid]}>
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
                                textContentType="password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>          

                        <TouchableOpacity style={styles.loginButton} onPress={handleSignup} disabled={!validateEmail(email) || !isPasswordValid || !validatePasswordMatch(password, confirmPassword)}>
                            <Text style={styles.buttonText}>Signup</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleNaviateLogin}>
                            <Text style={styles.navigateLogin}>Already have an account?</Text>
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
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 5
    },

    loginButton: {
        backgroundColor: "#4b58cf",
        height: 48,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8
    },

    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600"
    },

    navigateLogin: {
        color: "#7981c0",
        textAlign: "center",
        marginTop: 12,
        fontSize: 16
    },

    passwordConstraintsContainer: {
        marginTop: 8,
        marginBottom: 12,
    },

    passwordConstraintsTitle: {
        fontSize: 14,
        marginBottom: 6,
        color: "#555",
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

    invalidEmail: {
        color: "#a02626",
        textAlign: "center",
        marginBottom: 5,
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

});