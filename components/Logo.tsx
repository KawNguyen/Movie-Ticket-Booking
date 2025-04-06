import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#b052fa"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />

        <circle cx="12" cy="12" r="2.5" />
        <circle cx="12" cy="12" r="1.2" fill="#b052fa" />

        <path d="M10 6V4" />
        <path d="M14 6V4" />
        <path d="M10 20v-2" />
        <path d="M14 20v-2" />
        <path d="M12 10v1" />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-brand-500">
        CiLemaK
      </span>
    </Link>
  );
};
