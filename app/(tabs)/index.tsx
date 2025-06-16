import { TouchableOpacity, Alert, View, Text, Button } from "react-native";

import { useAddStripeCard } from "@/hooks/useAddStripeCard";

export default function HomeScreen() {
  const addStripeCard = useAddStripeCard({
    onError: (e) => {
      Alert.alert(e.message);
    },
    onSuccess: () => {
      Alert.alert("Card added");
    },
    onCancel: () => {
      Alert.alert("Canceled");
    },
  });

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Add card" onPress={addStripeCard} />
    </View>
  );
}
