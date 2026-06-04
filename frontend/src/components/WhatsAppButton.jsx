import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "237695476255";

export default function WhatsAppButton() {
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-shadow"
    >
      <MessageCircle size={28} fill="white" stroke="none" />
    </motion.a>
  );
}
