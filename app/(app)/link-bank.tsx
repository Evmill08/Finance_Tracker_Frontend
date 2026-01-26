import {create, LinkExit, LinkSuccess, open} from 'react-native-plaid-link-sdk';
import { exchangeToken, getLinkToken } from '@/services/User/user.service';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { router } from 'expo-router';
import { LinkTokenModel } from '@/models/LinkToken';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function LinkBankScreen() {
    const {token: jwt, user} = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [plaidReady, setPlaidReady] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [linkToken, setLinkToken] = useState<string>("");

    useEffect(() => {
        if (!jwt){
            router.replace('/(auth)/login');
            return;
        }

        const initPlaid = async () => {
            try {
                setLoading(true);

                const response = await getLinkToken(jwt);
                const linkToken = response.data as LinkTokenModel;
                setLinkToken(linkToken.linkToken)

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
                await handleSuccessfulLink();
            },
            onExit: async (_exit: LinkExit) => {
                // Retry
                await handleLinkExit(_exit);
            },
        });
    };

    const handleSuccessfulLink = async () => {
        if (jwt){
            const response = await exchangeToken(linkToken, jwt);

            if (response.success){
                const accessToken = response.data as string;
                await SecureStore.setItemAsync("accessToken", accessToken);
                router.replace("/(app)");
            }
        } else {
            router.replace('/(auth)/login');
        }
    }

    const handleLinkExit = async (exit: LinkExit) => {
        // TODO: Just continue showing the link 
        console.log("Exited Link: ", exit);
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
});
