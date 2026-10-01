import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "rizmart.store";

export function middleware(request: NextRequest) {
  const host = request.nextUrl.hostname.toLowerCase();
  if (host !== CANONICAL_HOST && host !== `www.${CANONICAL_HOST}`) {
    return addRobotsHeader(NextResponse.next());
  }

  if (request.nextUrl.protocol === "https:" && host === CANONICAL_HOST) {
    return addRobotsHeader(NextResponse.next());
  }

  const destination = request.nextUrl.clone();
  destination.protocol = "https:";
  destination.hostname = CANONICAL_HOST;

  return addRobotsHeader(NextResponse.redirect(destination, 301));
}

function addRobotsHeader(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "index, follow");
  return response;
}
