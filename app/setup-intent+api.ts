import { API_SECRET_KEY } from "@/config";

const stripe = require("stripe")(API_SECRET_KEY);

export async function GET(request: Request) {
  const setupIntent = await stripe.setupIntents.create({
    payment_method_types: ["card"],
  });

  return Response.json(setupIntent.client_secret);
}
