import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../api";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => api.get("/messages").then(r => setMessages(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const markRead = async (msg) => {
    if (msg.read) return;
    try { await api.patch(`/messages/${msg._id}/read`); load(); }
    catch {}
  };

  const del = async (id) => {
    if (!confirm("Supprimer ce message ?")) return;
    try {
      await api.delete(`/messages/${id}`);
      toast.success("Message supprimé.");
      setSelected(null);
      load();
    } catch { toast.error("Erreur."); }
  };

  const open = (msg) => { setSelected(msg); markRead(msg); };
  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="font-mono text-[11px] text-primary tracking-[3px] uppercase mb-1">Admin</p>
        <div className="flex items-center gap-3">
          <h1 className="font-ubuntu font-bold text-[26px]">Messages</h1>
          {unread > 0 && (
            <span className="badge badge-primary font-mono">{unread} non lus</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-5">
        {/* List */}
        <div className="flex flex-col gap-2">
          {messages.map(m => (
            <button key={m._id}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${selected?._id === m._id ? "border-primary/40 bg-primary/8" : "sw-card"}`}
              onClick={() => open(m)}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  {!m.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  <span className="font-ubuntu font-semibold text-[14px] text-base-content/90 truncate">{m.name}</span>
                </div>
                <span className="font-mono text-[10px] text-white/25 shrink-0">
                  {new Date(m.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="font-mono text-[11px] text-secondary/60 truncate mb-1">{m.email}</div>
              <div className="font-ubuntu font-light text-[13px] text-white/40 truncate">{m.message}</div>
            </button>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-12 text-white/25">
              <p className="font-mono text-[13px]">Aucun message reçu.</p>
            </div>
          )}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="sw-card p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-ubuntu font-bold text-[18px] text-base-content/90 mb-1">{selected.name}</h2>
                <a href={`mailto:${selected.email}`} className="font-mono text-[13px] text-secondary/70 hover:text-secondary transition-colors">
                  {selected.email}
                </a>
              </div>
              <div className="flex gap-2">
                <a href={`mailto:${selected.email}`} className="btn btn-secondary btn-sm rounded-[9px] gap-1.5">
                  Répondre
                </a>
                <button className="btn btn-sm btn-ghost btn-square text-error/50 hover:text-error"
                  onClick={() => del(selected._id)}>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="sw-divider mb-5" />

            <p className="font-ubuntu font-light text-[15px] text-base-content/60 leading-[1.8] whitespace-pre-wrap">
              {selected.message}
            </p>

            <p className="font-mono text-[11px] text-white/20 mt-6">
              Reçu le {new Date(selected.createdAt).toLocaleString("fr-FR")}
            </p>
          </div>
        ) : (
          <div className="sw-card flex items-center justify-center h-64">
            <p className="font-mono text-[13px] text-white/20">Sélectionnez un message</p>
          </div>
        )}
      </div>
    </div>
  );
}
