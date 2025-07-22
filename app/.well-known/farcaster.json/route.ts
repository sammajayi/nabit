function withValidProperties(
  properties: Record<string, undefined | string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    }),
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;

  return Response.json({
    accountAssociation: {
      // header: process.env.NEXT_PUBLIC_FARCASTER_HEADER,
      // payload: process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
      // signature: process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE,
      "header": "eyJmaWQiOjg3NTk4NCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweGIzODU2ZkFhZTMxQzM2NEYxQzYyQTQyY2NiM0U4MDAyQjk1MUMwMjcifQ",
      "payload": "eyJkb21haW4iOiJuYWJpdC52ZXJjZWwuYXBwIn0",
      "signature": "PF7C1UIhs/Qfj4K5rtcsJNCZkTlkaq/K3oFgpJ867ccxaC/EK1BwEJRFr9T6KkcP+EjhYD8u3PC4xf0ceptxxxs="
    },
    frame: withValidProperties({
      version: "1",
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE,
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      screenshotUrls: [],
      iconUrl: process.env.NEXT_PUBLIC_APP_ICON,
      splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE,
      splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: "social",
      "tags": [
        "e-commerce",
        "marketplace",
        "buy and sell",
        "onchain market"
      ],
      heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE,
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE,
      ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
      ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE,
    }),
  });
}
