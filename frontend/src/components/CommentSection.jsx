import { useState, useEffect } from "react";
import api from "../api";

const IconSend = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

export default function CommentSection({ postSlug }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    author: "",
    email: "",
    content: "",
  });
  const [message, setMessage] = useState("");

  // Charger les commentaires approuvés
  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/blog/${postSlug}/comments`);
      setComments(res.data.data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.author || !formData.email || !formData.content) {
      setMessage("Veuillez remplir tous les champs");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const res = await api.post(`/blog/${postSlug}/comments`, formData);

      if (res.data.success) {
        setMessage(
          "✓ Merci ! Votre commentaire a été envoyé et sera affiché après modération.",
        );
        setFormData({ author: "", email: "", content: "" });
        setShowForm(false);
        // Optionnel : rafraîchir les commentaires
        // fetchComments();
      }
    } catch (err) {
      setMessage("Erreur lors de l'envoi du commentaire. Veuillez réessayer.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="mt-16 pt-12"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      <h3 className="font-ubuntu font-bold text-[18px] mb-6 text-white">
        Commentaires ({comments.length})
      </h3>

      {/* Comments list */}
      <div className="flex flex-col gap-4 mb-8">
        {loading ? (
          <div className="text-white/40 text-center py-4">
            <p className="font-mono text-[13px]">
              Chargement des commentaires...
            </p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-white/40 text-center py-8">
            <p className="font-mono text-[13px]">
              Aucun commentaire pour le moment.
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-ubuntu font-semibold text-white/90">
                    {comment.author}
                  </p>
                  <p className="font-mono text-[11px] text-white/30">
                    {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <p className="font-ubuntu text-[13px] text-white/70 leading-[1.6]">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Comment form toggle */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-ubuntu font-semibold text-[13px] transition-all duration-150"
          style={{
            background: "#e779c1",
            color: "#0c061e",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          Ajouter un commentaire
        </button>
      )}

      {/* Comment form */}
      {showForm && (
        <div
          className="p-6 rounded-lg mt-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h4 className="font-ubuntu font-bold text-[15px] mb-4 text-white">
            Votre commentaire
          </h4>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                name="author"
                placeholder="Votre nom"
                value={formData.author}
                onChange={handleChange}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg font-ubuntu text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <input
                type="email"
                name="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={handleChange}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg font-ubuntu text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <textarea
              name="content"
              placeholder="Votre commentaire..."
              value={formData.content}
              onChange={handleChange}
              rows="4"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg font-ubuntu text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
            />

            {message && (
              <p
                className={`font-mono text-[12px] ${
                  message.includes("✓") ? "text-green-400" : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}

            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-ubuntu font-semibold text-[13px] transition-all duration-150 disabled:opacity-50"
                style={{
                  background: submitting ? "rgba(231,121,193,0.5)" : "#e779c1",
                  color: "#0c061e",
                }}
              >
                <IconSend />
                {submitting ? "Envoi..." : "Envoyer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setMessage("");
                }}
                className="px-4 py-2 rounded-lg font-ubuntu font-semibold text-[13px] text-white/70 hover:text-white transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
