/* PetLuxo — Utilitário WhatsApp */

const WHATSAPP_PHONE =
  import.meta.env.VITE_WHATSAPP_PHONE || "5561994063917";

export function generateWhatsAppLink(product) {
  const message = encodeURIComponent(
    `Olá! Tenho interesse em:\n\n${product.name} - ${product.price}`
  );
  return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
}

export const wa = (text) => `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
