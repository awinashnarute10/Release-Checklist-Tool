/**
 * Minimal inline icon set (stroke-based, currentColor) so we avoid pulling in
 * a full icon library. Each icon accepts standard SVG props + className.
 */
const base = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const PlusIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const TrashIcon = (p) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

export const EyeIcon = (p) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const CheckIcon = (p) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const SearchIcon = (p) => (
  <svg {...base} width="18" height="18" {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const SunIcon = (p) => (
  <svg {...base} width="18" height="18" {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const MoonIcon = (p) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);

export const ArrowLeftIcon = (p) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export const AlertIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

export const RocketIcon = (p) => (
  <svg {...base} width="20" height="20" {...p}>
    <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0Z" />
    <path d="M12 15 9 12a15 15 0 0 1 7-9 8 8 0 0 1 0 4 15 15 0 0 1-4 8Z" />
    <path d="M9 12H4s.5-2.8 2-4 5 0 5 0M12 15v5s2.8-.5 4-2 0-5 0-5" />
  </svg>
);

export const CloseIcon = (p) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const ChevronDownIcon = (p) => (
  <svg {...base} width="16" height="16" {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const InboxIcon = (p) => (
  <svg {...base} width="22" height="22" {...p}>
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1Z" />
  </svg>
);
