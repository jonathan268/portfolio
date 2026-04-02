import { useState, useEffect } from "react";
import api from "../../api";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await api.get("/blog/admin/comments/all");
      setComments(res.data.data || []);
      console.log("✅ Commentaires admin:", res.data.data);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (commentId, currentApproval) => {
    try {
      await api.put(`/blog/admin/comments/${commentId}`, {
        approved: !currentApproval,
      });
      fetchComments();
    } catch (err) {
      console.error("Erreur lors de l'approbation", err);
    }
  };

  const deleteComment = async (commentId) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await api.delete(`/blog/admin/comments/${commentId}`);
        fetchComments();
      } catch (err) {
        console.error("Erreur lors de la suppression", err);
      }
    }
  };

  if (loading) return <div className="p-6 text-white">Chargement...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Commentaires</h2>

      {comments.length === 0 ? (
        <p className="text-white/50">Aucun commentaire pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${comment.approved ? "rgba(76,175,80,0.5)" : "rgba(255,193,7,0.5)"}`,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-white text-[14px]">
                    {comment.author}
                  </p>
                  <p className="text-white/50 text-xs">{comment.email}</p>
                  {comment.blogPostId && (
                    <p className="text-white/40 text-xs mt-1">
                      Article: <strong>{comment.blogPostId.title}</strong>
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    comment.approved
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {comment.approved ? "✓ Approuvé" : "⏳ En attente"}
                </span>
              </div>

              <p className="text-white/70 text-[13px] mb-3 leading-relaxed">
                {comment.content}
              </p>

              <p className="text-white/40 text-xs mb-3">
                {new Date(comment.createdAt).toLocaleString("fr-FR")}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleApproval(comment._id, comment.approved)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    comment.approved
                      ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                      : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                  }`}
                >
                  {comment.approved ? "Rejeter" : "Approuver"}
                </button>
                <button
                  onClick={() => deleteComment(comment._id)}
                  className="px-3 py-1.5 rounded text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
