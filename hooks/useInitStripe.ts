import { initStripe } from "@stripe/stripe-react-native";

import * as Linking from "expo-linking";
import { useCallback } from "react";

let stripeInitialized = false;

export const useInitStripe = () => {
  return useCallback(async (publishableKey: string): Promise<void> => {
    if (stripeInitialized) return;

    await initStripe({
      publishableKey,
      merchantIdentifier: "IOS_ONLY_IGNORE",
      urlScheme: Linking.createURL("/").split(":")[0],
    });

    stripeInitialized = true;
  }, []);
};
