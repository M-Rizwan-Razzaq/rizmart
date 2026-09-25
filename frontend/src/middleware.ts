import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "rizmart.store";

export function middleware(request: NextRequest) {
  const host = request.nextUrl.hostname.toLowerCase();
  if (host !== CANONICAL_HOST && host !== `www.${CANONICAL_HOST}`) {
    return NextResponse.next();
  }

  if (request.nextUrl.protocol === "https:" && host === CANONICAL_HOST) {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.protocol = "https:";
  destination.hostname = CANONICAL_HOST;

  return NextResponse.redirect(destination, 301);
}
