import { NextResponse } from "next/server";
import { getStorefrontBySlug } from "@/lib/mock-data";
import { MockOrderResponse, PaymentMethod } from "@/lib/types";

interface OrderRequestBody {
  storeSlug: string;
  productId: string;
  userId: string;
  paymentMethod: PaymentMethod;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<OrderRequestBody>;
    const { storeSlug, productId, userId, paymentMethod } = body;

    if (!storeSlug || !productId || !userId || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const store = getStorefrontBySlug(storeSlug);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const product = store.products.find((item) => item.id === productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!store.paymentMethods.includes(paymentMethod)) {
      return NextResponse.json({ error: "Payment method not supported" }, { status: 400 });
    }

    const now = Date.now();
    const orderId = `ORD-${now}`;
    const paymentIntentId = `PAY-${Math.floor(Math.random() * 1_000_000)}`;

    const response: MockOrderResponse = {
      orderId,
      paymentIntentId,
      amount: product.price,
      currency: product.currency,
      paymentMethod,
      store: { slug: store.slug, name: store.displayName },
      product: { id: product.id, name: product.name },
      userId,
      paymentUrl: `https://mock.app-pay.dev/pay/${paymentIntentId}`,
      timeline: [
        {
          phase: "created",
          message: "Order created. Waiting for you to confirm payment.",
          delayMs: 600,
          meta: { orderId },
        },
        {
          phase: "redirect",
          message: `${paymentMethod} checkout is ready. Complete the bank or 3D Secure step.`,
          delayMs: 900,
        },
        {
          phase: "processing",
          message: "Payment captured. Clearing network is confirming settlement...",
          delayMs: 1000,
        },
        {
          phase: "webhook",
          message: `Notifying ${store.companyName}. Waiting for delivery confirmation...`,
          delayMs: 800,
          meta: { endpoint: store.storefrontUrl },
        },
        {
          phase: "completed",
          message: "Order complete. Items will reach your inbox shortly.",
          delayMs: 0,
        },
      ],
      webhookPayload: {
        endpoint: store.storefrontUrl.replace("/store/", "/hooks/"),
        body: {
          orderId,
          platformOrderId: paymentIntentId,
          userId,
          productId: product.id,
          amount: product.price,
          currency: product.currency,
          status: "paid",
          signature: `wh_${paymentIntentId}_sig`,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
