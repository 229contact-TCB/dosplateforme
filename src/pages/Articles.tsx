import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { supabase, Article } from '../lib/supabase';
import Header from '../components/Header';

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    designation: '',
    unit_price: '',
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setArticles(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.designation.trim() || !formData.unit_price) return;

    const articleData = {
      designation: formData.designation,
      unit_price: parseFloat(formData.unit_price),
    };

    if (editingArticle) {
      await supabase
        .from('articles')
        .update(articleData)
        .eq('id', editingArticle.id);
    } else {
      await supabase.from('articles').insert([articleData]);
    }

    setFormData({ designation: '', unit_price: '' });
    setEditingArticle(null);
    setShowModal(false);
    loadArticles();
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      designation: article.designation,
      unit_price: article.unit_price.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      await supabase.from('articles').delete().eq('id', id);
      loadArticles();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingArticle(null);
    setFormData({ designation: '', unit_price: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Gestion des articles" />

      <div className="p-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-[#012B59] text-white rounded-lg py-3 px-4 flex items-center justify-center space-x-2 mb-4 hover:bg-[#01203f]"
        >
          <Plus size={20} />
          <span>Ajouter un article</span>
        </button>

        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{article.designation}</h3>
                  <p className="text-lg text-[#012B59] font-semibold">
                    {Number(article.unit_price).toLocaleString()} FCFA
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(article)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {articles.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucun article enregistré
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">
                {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
              </h2>
              <button onClick={closeModal} className="text-gray-500">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Désignation *
                </label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix Unitaire (FCFA) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#012B59]"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#012B59] text-white rounded-lg py-2 hover:bg-[#01203f]"
                >
                  {editingArticle ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
