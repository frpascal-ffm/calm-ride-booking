import Link from "next/link";
import { CookieSettings } from "./CookieSettings";

export function Footer() {
  return (
    <footer className="mt-16 border-t py-8 text-sm">
      <div className="container mx-auto grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="mb-3 font-semibold">Unternehmen</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/impressum" className="hover:underline">Impressum</Link>
            </li>
            <li>
              <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
            </li>
            <li>
              <Link href="/agb" className="hover:underline">AGB</Link>
            </li>
            <li>
              <CookieSettings>
                <button type="button" className="hover:underline">Cookie-Einstellungen</button>
              </CookieSettings>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
