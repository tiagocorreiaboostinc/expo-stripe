import { LOCAL_IP } from "./config";

export const getClientSecret = async () => {
  const response = await fetch(`http://${LOCAL_IP}:8081/setup-intent`);
  const data = await response.json();

  return data;
};
