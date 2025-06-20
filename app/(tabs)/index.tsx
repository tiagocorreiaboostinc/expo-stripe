import { Alert, View, Button } from "react-native";
import * as Linking from "expo-linking";
import {
  initPaymentSheet,
  PaymentSheetError,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";

import { useCallback, useRef, useState } from "react";
import { getClientSecret } from "@/services";

const CANCELED_ERROR = "canceled";

export default function HomeScreen() {
  const isProcessingRef = useRef(false);

  const onAddStripeCardPress = useCallback(async () => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;

    try {
      const setupIntentClientSecret = await getClientSecret();

      const { error: initError } = await initPaymentSheet({
        setupIntentClientSecret,
        merchantDisplayName: "StripeExpoTest",
        googlePay: {
          merchantCountryCode: "PT",
          testEnv: true,
        },
        returnURL: Linking.createURL("stripe-redirect"),
      });

      if (initError) throw initError;

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === PaymentSheetError.Canceled) {
          throw new Error(CANCELED_ERROR);
        }
        throw presentError;
      }

      Alert.alert("Card added");
    } catch (err: any) {
      const isCancelError = (err as Error)?.message === CANCELED_ERROR;

      if (isCancelError) {
        Alert.alert("Canceled");
      } else {
        Alert.alert(err.message);
      }
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Add card" onPress={onAddStripeCardPress} />
    </View>
  );
}
