interface ExternalLinkIconProps {
  href: string;
  title?: string;
  className?: string;
}

export function ExternalLinkIcon({
  href,
  title = "GitHub에서 보기",
  className = "",
}: ExternalLinkIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-gray-400 hover:text-gray-600 transition-colors ${className}`}
      title={title}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}
