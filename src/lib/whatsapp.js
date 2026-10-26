/* PetLuxo — Utilitário WhatsApp */

const WHATSAPP_PHONE =
  import.meta.env.VITE_WHATSAPP_PHONE || "5561994063917";

export const wa = (text) => `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
