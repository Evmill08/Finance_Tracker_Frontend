import { Stack } from "expo-router";

export default function AppLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="link-bank" options={{title: "Link Bank"}}/>
        </Stack>
    )
}