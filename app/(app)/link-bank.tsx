import {create, LinkExit, LinkSuccess, open} from 'react-native-plaid-link-sdk';
import { exchangeToken, getLinkToken } from '@/services/Plaid/plaid.service';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { router } from 'expo-router';
import { LinkTokenModel } from '@/models/LinkToken';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { TokenExchangeResponse } from '@/models/TokenExchangeResponse';

// TODO: sending null link token for some reason
export default function LinkBankScreen() {
    const {token: jwt, user} = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [plaidReady, setPlaidReady] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const linkTokenRef = useRef<string>("");

    console.log("Were in the link bank screen");

    useEffect(() => {
        if (!jwt){
            router.replace('/(auth)/login');
            return;
        }

        const initPlaid = async () => {
            try {
                setLoading(true);
                console.log("getting link token with jwt: ", jwt);

                const response = await getLinkToken(jwt);
                console.log("response from get link token: ", JSON.stringify(response));
                const linkToken = response.data as LinkTokenModel;
                console.log("Link token: ", JSON.stringify(linkToken));
                linkTokenRef.current = linkToken.linkToken;

                const expiresAt = new Date(linkToken.expiresAt);
                if (expiresAt <= new Date()){
                    setError("Link token expired");
                } 

                create({token: linkToken.linkToken});
                setPlaidReady(true);
            } catch (err: any){
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        initPlaid();
    }, [jwt]);

    const handleOpenLink = async () => {
        if (!plaidReady) return;

        open({
            onSuccess: async (_success: LinkSuccess) => {
                console.log("Successfully linked bank account: ", _success);
                console.log("Public token: ", _success.publicToken);
                await handleSuccessfulLink(_success.publicToken);
            },
            onExit: async (_exit: LinkExit) => {
                // Retry
                console.log("Exited Plaid Link: ", _exit);
                await handleLinkExit(_exit);
            },
        });
    };

    const handleSuccessfulLink = async (publicToken: string) => {
        try{
            if (!jwt){
                router.replace('/login');
                return;
            }

            const response = await exchangeToken(publicToken, jwt);
            console.log("response from token exchange: ", JSON.stringify(response));

            if (!response.success){
                console.log("Exchange failed");
                return;
            }

            console.log("Response data: ", JSON.stringify(response.data));

            const exchangeResponse = response.data as TokenExchangeResponse;

            console.log("AcessToken: ", exchangeResponse?.accessToken);
            console.log("ItemId: ", exchangeResponse?.itemId);

            if (!exchangeResponse?.accessToken || !exchangeResponse?.itemId){
                console.log("Missing values from exchange response");
                return;
            }

            await SecureStore.setItemAsync("accessToken", JSON.stringify(exchangeResponse.accessToken));
            await SecureStore.setItemAsync("itemId", JSON.stringify(exchangeResponse.itemId));
            router.replace("/(app)");
        } catch (err){
            console.error("Handle successful link error: ", err);
        }
    }

    const handleLinkExit = async (exit: LinkExit) => {
        // TODO: Just continue showing the link 
        console.log("Exited Link: ", exit);
    }

    const handleLogOut = () => {
        SecureStore.deleteItemAsync("JwtToken");
        SecureStore.deleteItemAsync("accessToken");
        SecureStore.deleteItemAsync("itemId");
        router.replace("/login");
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Text style={styles.headerText}>Welcome {user?.firstName}</Text>

                {loading ? (
                    <ActivityIndicator size="large" />
                    ) : (
                    <TouchableOpacity
                        style={[styles.button, !plaidReady && styles.buttonDisabled]}
                        onPress={handleOpenLink}
                        disabled={!plaidReady}
                    >
                        <Text style={styles.buttonText}>Link Bank</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut} disabled={loading}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  headerText: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
  },

  button: {
    backgroundColor: '#4b58cf',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  logoutButton: {
    marginTop: 16,
    backgroundColor: '#ccc',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
});
