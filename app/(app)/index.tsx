// import { SafeAreaView } from "react-native-safe-area-context";
// import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/hooks/use-auth";

// export default function HomeScreen() {
//     const {token, user} = useAuth();

//     useEffect(() => {
//         const fetchUserData = () => {
//             // Fetch user jwt
//             // Make call to backend
//             // Gets simple user data

//         };

//         fetchUserData();
//     }, []);

//     useEffect(() => {
//         const fetchUserBankData = () => {
//             // Uses user id from user
//             // fetches plaid data from our backend
//             // Retrieves the actual banking data
//             // If 
//         }
//     })

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <KeyboardAvoidingView
//                             style={styles.container}
//                             behavior={Platform.OS === "ios" ? "padding" : undefined}
//             >
//                 <Text style={styles.title}>Welcome {user?.firstName}</Text>

//             </KeyboardAvoidingView>

//         </SafeAreaView>
//     )
// }

// const styles = StyleSheet.create({

// })

export default function HomeScreen() {
    console.log("Were in the home screen");
    
    return (
        {}
    )
}