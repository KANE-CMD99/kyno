"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart, type CartItem } from "./CartContext";
import { useLang } from "./LangContext";
import { useCurrency } from "./CurrencyContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal, itemCount, clearCart } = useCart();
  const { t } = useLang();
  const { format } = useCurrency();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">{t("nav.cart")}</h2>
                <p className="text-sm text-neutral-500">{t("nav.cart.items", { n: itemCount })}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1.5 text-neutral-400 transition-colors hover:text-neutral-600"
                aria-label="Close cart"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-5xl select-none">
                    {String.fromCodePoint(0x1F6D2)}
                  </span>
                  <p className="mt-4 text-sm font-medium text-neutral-900">{t("nav.cart.empty")}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {t("nav.cart.empty_hint")}
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 rounded-lg border border-neutral-300 px-6 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400"
                  >
                    {t("nav.cart.continue")}
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 px-6 py-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">{t("nav.cart.subtotal")}</span>
                  <span className="font-bold text-neutral-900">{format(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">
                  {t("checkout.stripe_note").slice(0, 50)}...
                </p>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="mt-4 block rounded-lg bg-blue-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  {t("nav.cart.checkout")} — {format(subtotal)}
                </Link>
                <button
                  onClick={clearCart}
                  className="mt-2 block w-full text-center text-xs text-neutral-400 transition-colors hover:text-neutral-600"
                >
                  {t("nav.cart.clear")}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CartItemRow({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
}) {
  const emoji =
    item.category === "Photos" ? String.fromCodePoint(0x1F4F7)
    : item.category === "Fonts" ? String.fromCodePoint(0x1F524)
    : String.fromCodePoint(0x1F4D0);
  const { format } = useCurrency();

  return (
    <li className="flex gap-3">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-2xl">
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-neutral-900 truncate">{item.name}</h4>
        <p className="text-xs text-neutral-500">{item.category}</p>
        <div className="mt-1.5 flex items-center gap-3">
          <div className="flex items-center rounded-md border border-neutral-300">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-0.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              &minus;
            </button>
            <span className="px-2 py-0.5 text-sm font-medium text-neutral-900">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-0.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              +
            </button>
          </div>
          <span className="text-sm font-semibold text-neutral-900">{format(item.price * item.quantity)}</span>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="shrink-0 self-start rounded p-1 text-neutral-300 transition-colors hover:text-red-500"
        aria-label={`Remove ${item.name}`}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 5l10 10M15 5L5 15" />
        </svg>
      </button>
    </li>
  );
}
