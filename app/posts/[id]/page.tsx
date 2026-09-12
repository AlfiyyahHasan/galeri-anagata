'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, MessageCircle, Send, CornerDownRight, Sparkles, Trash2, Loader2 } from 'lucide-react';

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  // Ambil detail post langsung dari API Database Neon
  useEffect(() => {
    async function fetchPostDetail() {
      try {
        const response = await fetch(`/api/posts/${id}`);
        const result = await response.json();
        if (result.success && result.data) {
          setPost(result.data);
        } else {
          console.error('Postingan tidak ditemukan');
        }
      } catch (error) {
        console.error('Terjadi kesalahan saat memuat detail:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPostDetail();
  }, [id]);

  const handleLike = async () => {
    if (!post) return;
    const newIsLiked = !post.is_liked;
    const newLikes = newIsLiked ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1);

    // Update state secara instan (optimistic update)
    setPost({
      ...post,
      is_liked: newIsLiked,
      likes: newLikes
    });

    try {
      await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_liked: newIsLiked, likes: newLikes }),
      });
    } catch (error) {
      console.error('Gagal memperbarui like:', error);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    const newCommentObj = {
      id: Date.now(),
      author: "Kamu (Anak Magang)",
      text: newComment,
      replies: []
    };

    const updatedComments = [newCommentObj, ...(post.comments || [])];
    setPost({ ...post, comments: updatedComments });
    setNewComment("");
    // Catatan: Jika ingin komentar tersimpan permanen di database, nanti kita bisa buatkan tabel comments terpisah.
  };

  const handleDeleteComment = (commentId: number) => {
    if (!confirm('Hapus komentar ini?')) return;
    const updatedComments = post.comments.filter((c: any) => c.id !== commentId);
    setPost({ ...post, comments: updatedComments });
  };

  const handleAddReply = (commentId: number) => {
    if (!replyText.trim() || !post) return;

    const updatedComments = post.comments.map((c: any) => {
      if (c.id === commentId) {
        const newReplyObj = {
          id: Date.now(),
          author: "Kamu",
          text: replyText
        };
        return {
          ...c,
          replies: [...(c.replies || []), newReplyObj]
        };
      }
      return c;
    });

    setPost({ ...post, comments: updatedComments });
    setReplyText("");
    setReplyingTo(null);
  };

  const handleDeleteReply = (commentId: number, replyId: number) => {
    if (!confirm('Hapus balasan ini?')) return;
    const updatedComments = post.comments.map((c: any) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: c.replies.filter((r: any) => r.id !== replyId)
        };
      }
      return c;
    });
    setPost({ ...post, comments: updatedComments });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Memuat kenangan dari server... ✨</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center space-y-4">
        <p className="text-sm text-slate-400">Kenangan tidak ditemukan atau sudah dihapus.</p>
        <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-12 px-4 pb-28">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={18} />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
          <div className="bg-slate-950 flex justify-center overflow-hidden">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="max-h-[500px] w-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-black text-white">{post.title}</h1>
            <p className="text-xs text-blue-400 mt-1 font-semibold">Diunggah oleh: {post.author}</p>
            {post.story && (
              <p className="text-slate-300 text-sm mt-4 leading-relaxed font-normal">{post.story}</p>
            )}

            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-800/80">
              <button 
                onClick={handleLike} 
                className={`flex items-center gap-2 text-sm font-semibold transition-all px-4.5 py-2.5 rounded-2xl border cursor-pointer ${post.is_liked ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 scale-105' : 'bg-[#07090e] border-slate-800 text-slate-300 hover:border-slate-700'}`}
              >
                <Heart size={18} className={post.is_liked ? 'fill-rose-500' : ''} />
                <span>{post.likes || 0} Suka</span>
              </button>
              <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                <MessageCircle size={18} />
                <span>{post.comments?.length || 0} Komentar</span>
              </div>
            </div>
          </div>

          {/* Bagian Komentar */}
          <div className="bg-[#07090e]/80 p-6 sm:p-8 border-t border-slate-800/80">
            <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              <span>Obrolan & Komentar Magang</span>
            </h2>

            <form onSubmit={handleAddComment} className="flex gap-2.5 mb-8">
              <input 
                type="text" 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tulis komentar atau candaan..." 
                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white transition-colors"
              />
              <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/20 cursor-pointer">
                <Send size={16} />
                <span>Kirim</span>
              </button>
            </form>

            <div className="space-y-4">
              {(!post.comments || post.comments.length === 0) ? (
                <p className="text-xs text-slate-500 text-center py-6">Belum ada komentar. Jadilah yang pertama nimbrung! ✨</p>
              ) : (
                post.comments.map((c: any) => (
                  <div key={c.id} className="bg-slate-900/90 p-4.5 rounded-2xl border border-slate-800/80 group">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-blue-400">{c.author}</p>
                      <button 
                        onClick={() => handleDeleteComment(c.id)}
                        title="Hapus Komentar"
                        className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <p className="text-sm text-slate-200 mt-1">{c.text}</p>
                    
                    <button 
                      onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                      className="text-xs text-slate-400 hover:text-blue-400 mt-3 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CornerDownRight size={14} />
                      <span>Balas</span>
                    </button>

                    {/* Daftar Balasan */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="mt-3.5 pl-4 border-l-2 border-slate-800 space-y-2.5">
                        {c.replies.map((r: any) => (
                          <div key={r.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 relative group/reply">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-xs text-slate-300">{r.author}</p>
                              <button 
                                onClick={() => handleDeleteReply(c.id, r.id)}
                                title="Hapus Balasan"
                                className="text-slate-600 hover:text-rose-400 opacity-0 group-hover/reply:opacity-100 transition-opacity p-0.5 cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{r.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Form Balasan */}
                    {replyingTo === c.id && (
                      <div className="mt-3 flex gap-2 pl-4">
                        <input 
                          type="text" 
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Balas komentar ini..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500 text-white"
                        />
                        <button 
                          onClick={() => handleAddReply(c.id)}
                          className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Kirim
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}