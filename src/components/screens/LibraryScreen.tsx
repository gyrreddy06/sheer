import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { SEED_ARTICLES } from '../../data/seedArticles';
import { EducationArticle } from '../../types';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  ShieldAlert, 
  CheckCircle,
  X,
  Share2
} from 'lucide-react';

export const LibraryScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { savedArticleIds, toggleSaveArticle } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<EducationArticle | null>(null);
  const [onlyBookmarks, setOnlyBookmarks] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: t('library.allCategories') },
    { id: 'pcos_pcod', label: 'PCOS / PCOD' },
    { id: 'irregular_periods', label: 'Irregular Cycles' },
    { id: 'menstrual_hygiene', label: 'Menstrual Hygiene' },
    { id: 'first_period', label: 'First Period' },
    { id: 'reproductive_health', label: 'Reproductive Health' },
    { id: 'hormonal_health', label: 'Hormonal Wellness' },
  ];

  const filteredArticles = SEED_ARTICLES.filter(art => {
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    const isSaved = !onlyBookmarks || savedArticleIds.includes(art.id);
    const title = i18n.language === 'te' ? art.title_te : art.title_en;
    const summary = i18n.language === 'te' ? art.summary_te : art.summary_en;
    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && isSaved && matchesSearch;
  });

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* Title */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-2xl border border-pink-100">
        <div className="flex items-center space-x-2 text-pink-600 mb-1">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-sm font-bold text-slate-800">
            {t('library.title')}
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          {t('library.subtitle')}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder={t('library.searchPlaceholder')}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-400 shadow-2xs"
        />
      </div>

      {/* Categories Horizontal Carousel */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setOnlyBookmarks(false);
            }}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs transition ${
              selectedCategory === cat.id && !onlyBookmarks
                ? 'bg-pink-500 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-pink-200'
            }`}
          >
            {cat.label}
          </button>
        ))}

        <button
          onClick={() => setOnlyBookmarks(!onlyBookmarks)}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs transition flex items-center space-x-1 ${
            onlyBookmarks
              ? 'bg-purple-600 text-white font-semibold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          <Bookmark className="w-3 h-3" />
          <span>{t('library.filterBookmarks')} ({savedArticleIds.length})</span>
        </button>
      </div>

      {/* Mandatory Medical Review Notice */}
      <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex items-center space-x-2 text-[11px] text-amber-800">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span>All educational guides are editorial drafts clearly labelled "Sample, pending medical review".</span>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {filteredArticles.map(art => {
          const isSaved = savedArticleIds.includes(art.id);
          const title = i18n.language === 'te' ? art.title_te : art.title_en;
          const summary = i18n.language === 'te' ? art.summary_te : art.summary_en;

          return (
            <div
              key={art.id}
              className="bg-white rounded-2xl p-4 border border-pink-100 shadow-2xs hover:shadow-xs transition"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
                  {art.category.replace('_', ' ').toUpperCase()}
                </span>
                <button
                  onClick={() => toggleSaveArticle(art.id)}
                  className="text-slate-400 hover:text-purple-600 transition"
                  title={isSaved ? t('library.bookmarked') : t('library.bookmark')}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              <h3 
                onClick={() => setActiveArticle(art)}
                className="text-xs font-bold text-slate-900 mt-2 leading-snug cursor-pointer hover:text-pink-600 transition"
              >
                {title}
              </h3>

              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {summary}
              </p>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{t('library.readTime', { minutes: art.read_time_minutes })}</span>
                </span>
                <span className="italic text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                  {art.reviewed_by}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl p-6 overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-md border border-pink-200">
                {activeArticle.category.replace('_', ' ').toUpperCase()}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-base font-bold text-slate-900 leading-snug">
              {i18n.language === 'te' ? activeArticle.title_te : activeArticle.title_en}
            </h2>

            {/* Editorial Status Box */}
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-900 space-y-1">
              <div className="font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('library.sampleNotice')}</span>
              </div>
              <div className="text-[10px] text-amber-800">
                Reviewed by: {activeArticle.reviewed_by} • Last: {activeArticle.last_reviewed}
              </div>
            </div>

            <div className="prose prose-sm text-xs text-slate-700 leading-relaxed space-y-3 whitespace-pre-line border-t border-slate-100 pt-3">
              {i18n.language === 'te' ? activeArticle.content_te : activeArticle.content_en}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => toggleSaveArticle(activeArticle.id)}
                className="flex items-center space-x-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition"
              >
                {savedArticleIds.includes(activeArticle.id) ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>{t('library.bookmarked')}</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{t('library.bookmark')}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-xl hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
