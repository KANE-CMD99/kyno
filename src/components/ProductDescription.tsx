interface Props {
  description: string;
}

/**
 * Rendered in full, and on the server. Every product description runs 500-3000
 * characters, so the previous 200-character collapse hid roughly nine tenths
 * of each one — including the "WHAT YOU GET" breakdown buyers decide from —
 * and kept that copy out of the page text Google sees. Nothing here needs
 * client state now that the whole description is shown.
 */
export default function ProductDescription({ description }: Props) {
  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
      {description}
    </p>
  );
}
