import {
  useStripe,
  PaymentSheetError,
  StripeError,
} from "@stripe/stripe-react-native";
import * as Linking from "expo-linking";
import { useCallback, useRef } from "react";

import { useInitStripe } from "@/hooks/useInitStripe";
import { API_PUBLISHABLE_KEY, LOCAL_IP } from "@/config";

const getClientSecret = async () => {
  const response = await fetch(`http://${LOCAL_IP}:8081/setup-intent`);
  const data = await response.json();

  return data;
};

const CANCELED_ERROR = "canceled";

export interface UseAddStripeCardOptions {
  onSuccess?: () => void;
  onError?: (err: StripeError<unknown> | Error) => void;
  onCancel?: () => void;
}

export const useAddStripeCard = ({
  onSuccess,
  onError,
  onCancel,
}: UseAddStripeCardOptions = {}) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const initStripeOnce = useInitStripe();

  const isProcessingRef = useRef(false);

  const addCard = useCallback(async () => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;

    try {
      const setupIntentClientSecret = await getClientSecret();

      await initStripeOnce(API_PUBLISHABLE_KEY);

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

      onSuccess?.();
    } catch (err: any) {
      const isCancelError = (err as Error)?.message === CANCELED_ERROR;

      if (isCancelError) {
        onCancel?.();
      } else {
        onError?.(err);
      }
    } finally {
      isProcessingRef.current = false;
    }
  }, [
    initPaymentSheet,
    presentPaymentSheet,
    onSuccess,
    onError,
    initStripeOnce,
    onCancel,
  ]);

  return addCard;
};
