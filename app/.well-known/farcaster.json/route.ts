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
  
  return Response.redirect(
    "https://api.farcaster.xyz/miniapps/hosted-manifest/01990ab2-25cc-0ac7-43b5-56092d2073f8",
    307
  );
}
