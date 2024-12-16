// The redirect function is imported from 'next/navigation'. It works in Server Components by default (very important) and force it to become SSR.
// The redirect is handled during server-side rendering:
// - Server processes the request and runs the component logic on server side
// - If redirect triggers, server sends a 307/308 HTTP redirect response to the client
// - Browser automatically requests the new URL and server processes the new request again
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/orders');
}
