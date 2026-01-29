  import React, { useState, useEffect, useRef } from 'react';
  import { motion, Reorder, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
  import {
    Link2, Image as ImageIcon, Type, Trash2,
    Maximize2, Upload, Share2, Plus, Check, GripVertical,
    Palette, Youtube, Clock, Music, ArrowUpRight, Instagram, Film, Search, X,
    Play, Pause, Volume2, BookOpen, BookMarked, Twitter
  } from 'lucide-react';
  // --- Theme Configurations (Elevated Palettes) ---
  const themes = {
    warmCream: {
      name: 'Warm Cream',
      bg: 'bg-[#FDFCFB]',
      card: 'bg-white/80',
      accent: 'text-[#5C4033]',
      border: 'border-[#E8DFD8]',
      button: 'bg-[#5C4033] text-white',
      ring: 'ring-[#5C4033]/20',
      glass: 'backdrop-blur-xl bg-white/40',
      songGradient: 'from-amber-50 to-orange-50',
      verseGradient: 'from-amber-50 to-orange-50'
    },
    softSage: {
      name: 'Soft Sage',
      bg: 'bg-[#F2F5F3]',
      card: 'bg-white/80',
      accent: 'text-[#3E4E42]',
      border: 'border-[#DDE5DF]',
      button: 'bg-[#3E4E42] text-white',
      ring: 'ring-[#3E4E42]/20',
      glass: 'backdrop-blur-xl bg-white/40',
      songGradient: 'from-emerald-50 to-teal-50',
      verseGradient: 'from-emerald-50 to-teal-50'
    },
    mistyBlue: {
      name: 'Misty Blue',
      bg: 'bg-[#F0F4F8]',
      card: 'bg-white/80',
      accent: 'text-[#334155]',
      border: 'border-[#E2E8F0]',
      button: 'bg-[#334155] text-white',
      ring: 'ring-[#334155]/20',
      glass: 'backdrop-blur-xl bg-white/40',
      songGradient: 'from-blue-50 to-indigo-50',
      verseGradient: 'from-blue-50 to-indigo-50'
    },
    masculineSteel: {
      name: 'Masculine Steel',
      bg: 'bg-[#1A1D23]',
      card: 'bg-slate-800/90',
      accent: 'text-[#60A5FA]',
      border: 'border-slate-700',
      button: 'bg-[#60A5FA] text-slate-900',
      ring: 'ring-[#60A5FA]/30',
      glass: 'backdrop-blur-xl bg-slate-900/40',
      textColor: 'text-slate-100',
      songGradient: 'from-slate-800/50 to-slate-900/50',
      verseGradient: 'from-slate-800/50 to-slate-900/50'
    },
    urbanNight: {
      name: 'Urban Night',
      bg: 'bg-[#0F172A]',
      card: 'bg-slate-800/80',
      accent: 'text-[#38BDF8]',
      border: 'border-slate-700/50',
      button: 'bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-white',
      ring: 'ring-[#38BDF8]/30',
      glass: 'backdrop-blur-xl bg-slate-900/50',
      textColor: 'text-slate-100',
      songGradient: 'from-slate-800/50 to-slate-900/50',
      verseGradient: 'from-slate-800/50 to-slate-900/50'
    },
    rosePetal: {
      name: 'Rose Petal',
      bg: 'bg-[#FFF5F7]',
      card: 'bg-white/90',
      accent: 'text-[#EC4899]',
      border: 'border-[#FBCFE8]',
      button: 'bg-gradient-to-r from-[#EC4899] to-[#F472B6] text-white',
      ring: 'ring-[#EC4899]/20',
      glass: 'backdrop-blur-xl bg-pink-50/40',
      songGradient: 'from-pink-50 to-rose-50',
      verseGradient: 'from-pink-50 to-rose-50'
    },
    lavenderDream: {
      name: 'Lavender Dream',
      bg: 'bg-[#FAF5FF]',
      card: 'bg-white/85',
      accent: 'text-[#A855F7]',
      border: 'border-[#E9D5FF]',
      button: 'bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white',
      ring: 'ring-[#A855F7]/20',
      glass: 'backdrop-blur-xl bg-purple-50/40',
      songGradient: 'from-purple-50 to-violet-50',
      verseGradient: 'from-purple-50 to-violet-50'
    }
  };

  // --- Movie Search Modal (FIXED - Using different API key) ---
  const MovieSearchModal = ({ onClose, onSelect, theme }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const searchMovies = async (searchQuery) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError('');
      try {
        // Try multiple API keys for better reliability
        const apiKeys = import.meta.env.VITE_OMDB_API_KEYS.split(",");
        let success = false;

        for (const apiKey of apiKeys) {
          try {
            const response = await fetch(
              `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchQuery)}&type=movie`
            );

            const data = await response.json();

            if (data.Response === "True" && data.Search) {
              setResults(data.Search.slice(0, 12));
              success = true;
              break; // stop once one key works
            }
          } catch (err) {
            // silently try next key
            continue;
          }
        }
        
        if (!success) {
          setError('Unable to search movies. Please try again.');
          setResults([]);
        }
      } catch (error) {
        console.error('Error searching movies:', error);
        setError('Search failed. Please try again.');
        setResults([]);
      }
      setLoading(false);
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        searchMovies(query);
      }, 500);
      return () => clearTimeout(timer);
    }, [query]);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`${theme.card} border ${theme.border} rounded-[40px] p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl ${theme.textColor || ''}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black">Search Movies</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100/10 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a movie..."
              className={`w-full pl-12 pr-4 py-4 border ${theme.border} rounded-3xl outline-none focus:ring-2 ${theme.ring} transition-all text-lg ${theme.textColor ? 'bg-slate-900/50 text-white placeholder:text-slate-400' : 'bg-white'}`}
              autoFocus
            />
          </div>

          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="text-center py-12 text-slate-400">Searching...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-400">{error}</div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {results.map((movie) => (
                  <button
                    key={movie.imdbID}
                    onClick={() => onSelect({
                      title: movie.Title,
                      poster: movie.Poster !== 'N/A' ? movie.Poster : null,
                      year: movie.Year,
                      imdbID: movie.imdbID
                    })}
                    className="group relative overflow-hidden rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {movie.Poster !== 'N/A' ? (
                      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-slate-100">
                        <img
                          src={movie.Poster}
                          alt={movie.Title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                          <div className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">{movie.Title}</div>
                          <div className="text-xs text-white/80">{movie.Year}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-[2/3] bg-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                        <Film size={32} className="text-slate-400 mb-2" />
                        <div className="font-bold text-sm line-clamp-3">{movie.Title}</div>
                        <div className="text-xs text-slate-500 mt-1">{movie.Year}</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-12 text-slate-400">No movies found. Try a different search.</div>
            ) : (
              <div className="text-center py-12 text-slate-400">Start typing to search</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // --- Song Search Modal ---
  const SongSearchModal = ({ onClose, onSelect, theme }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchSongs = async (searchQuery) => {
      if (!searchQuery.trim()) return;
      setLoading(true);
      try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=20`);
        const data = await response.json();
        if (data.results) {
          setResults(data.results);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Error searching songs:', error);
      }
      setLoading(false);
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        if (query) searchSongs(query);
      }, 500);
      return () => clearTimeout(timer);
    }, [query]);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`${theme.card} border ${theme.border} rounded-[40px] p-8 max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl ${theme.textColor || ''}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black">Search Songs</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100/10 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a song..."
              className={`w-full pl-12 pr-4 py-4 border ${theme.border} rounded-3xl outline-none focus:ring-2 ${theme.ring} transition-all text-lg ${theme.textColor ? 'bg-slate-900/50 text-white placeholder:text-slate-400' : 'bg-white'}`}
              autoFocus
            />
          </div>

          <div className="overflow-y-auto flex-1 space-y-3">
            {loading ? (
              <div className="text-center py-12 text-slate-400">Searching...</div>
            ) : results.length > 0 ? (
              results.map((song) => (
                <button
                  key={song.trackId}
                  onClick={() => onSelect({
                    title: song.trackName,
                    artist: song.artistName,
                    artwork: song.artworkUrl100.replace('100x100', '600x600'),
                    preview: song.previewUrl,
                    trackId: song.trackId,
                    album: song.collectionName
                  })}
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50/10 rounded-2xl transition-all text-left group"
                >
                  <div className="relative flex-shrink-0">
                    <img src={song.artworkUrl100} alt={song.trackName} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all flex items-center justify-center">
                      <Play size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base truncate">{song.trackName}</div>
                    <div className="text-sm text-slate-500 truncate">{song.artistName}</div>
                    <div className="text-xs text-slate-400 truncate">{song.collectionName}</div>
                  </div>
                </button>
              ))
            ) : query ? (
              <div className="text-center py-12 text-slate-400">No songs found</div>
            ) : (
              <div className="text-center py-12 text-slate-400">Start typing to search</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // --- Bible/Quran Verse Search Modal (FIXED - No white screen) ---
  const VerseSearchModal = ({ onClose, onSelect, theme }) => {
    const [source, setSource] = useState('bible');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchVerses = async (searchQuery) => {
      if (!searchQuery.trim()) return;
      setLoading(true);
      try {
        if (source === 'bible') {
          const response = await fetch(`https://labs.bible.org/api/?passage=${encodeURIComponent(searchQuery)}&type=json`);
          const data = await response.json();
          if (data && data.length > 0) {
            setResults(data.map(v => ({
              text: v.text,
              reference: `${v.bookname} ${v.chapter}:${v.verse}`,
              source: 'Bible'
            })));
          } else {
            setResults([]);
          }
        } else {
          const response = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(searchQuery)}/all/en`);
          const data = await response.json();
          if (data.data && data.data.matches) {
            setResults(data.data.matches.slice(0, 10).map(v => ({
              text: v.text,
              reference: `Surah ${v.surah.number}:${v.numberInSurah} - ${v.surah.englishName}`,
              source: 'Quran'
            })));
          } else {
            setResults([]);
          }
        }
      } catch (error) {
        console.error('Error searching verses:', error);
        setResults([]);
      }
      setLoading(false);
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        if (query) searchVerses(query);
      }, 500);
      return () => clearTimeout(timer);
    }, [query, source]);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`${theme.card} border ${theme.border} rounded-[40px] p-8 max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl ${theme.textColor || ''}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black">Search Verses</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100/10 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSource('bible')}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${source === 'bible' ? theme.button : theme.textColor ? 'bg-slate-700/50' : 'bg-slate-100'}`}
            >
              Bible
            </button>
            <button
              onClick={() => setSource('quran')}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${source === 'quran' ? theme.button : theme.textColor ? 'bg-slate-700/50' : 'bg-slate-100'}`}
            >
              Quran
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={source === 'bible' ? "e.g., John 3:16" : "e.g., peace, love"}
              className={`w-full pl-12 pr-4 py-4 border ${theme.border} rounded-3xl outline-none focus:ring-2 ${theme.ring} transition-all text-lg ${theme.textColor ? 'bg-slate-900/50 text-white placeholder:text-slate-400' : 'bg-white'}`}
              autoFocus
            />
          </div>

          <div className="overflow-y-auto flex-1 space-y-3">
            {loading ? (
              <div className="text-center py-12 text-slate-400">Searching...</div>
            ) : results.length > 0 ? (
              results.map((verse, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelect(verse);
                    onClose();
                  }}
                  className={`w-full p-6 rounded-3xl transition-all text-left group border ${theme.textColor ? 'border-slate-700 hover:border-slate-600 hover:bg-slate-700/30' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'}`}
                >
                  <div className="font-bold text-sm mb-2 opacity-60">{verse.reference}</div>
                  <div className="text-base leading-relaxed italic">&ldquo;{verse.text}&rdquo;</div>
                </button>
              ))
            ) : query ? (
              <div className="text-center py-12 text-slate-400">No verses found</div>
            ) : (
              <div className="text-center py-12 text-slate-400">Start typing to search</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // --- Goodreads Book Search Modal ---
  const BookSearchModal = ({ onClose, onSelect, theme }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchBooks = async (searchQuery) => {
      if (!searchQuery.trim()) return;
      setLoading(true);
      try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=20`);
        const data = await response.json();
        if (data.docs) {
          setResults(data.docs.filter(book => book.cover_i).slice(0, 12).map(book => ({
            title: book.title,
            author: book.author_name?.[0] || 'Unknown Author',
            cover: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
            key: book.key,
            firstPublishYear: book.first_publish_year
          })));
        }
      } catch (error) {
        console.error('Error searching books:', error);
      }
      setLoading(false);
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        if (query) searchBooks(query);
      }, 500);
      return () => clearTimeout(timer);
    }, [query]);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`${theme.card} border ${theme.border} rounded-[40px] p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl ${theme.textColor || ''}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black">Search Books</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100/10 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a book..."
              className={`w-full pl-12 pr-4 py-4 border ${theme.border} rounded-3xl outline-none focus:ring-2 ${theme.ring} transition-all text-lg ${theme.textColor ? 'bg-slate-900/50 text-white placeholder:text-slate-400' : 'bg-white'}`}
              autoFocus
            />
          </div>

          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="text-center py-12 text-slate-400">Searching...</div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {results.map((book, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelect(book)}
                    className="group relative overflow-hidden rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                        <div className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">{book.title}</div>
                        <div className="text-xs text-white/80">{book.author}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-12 text-slate-400">No books found</div>
            ) : (
              <div className="text-center py-12 text-slate-400">Start typing to search</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // --- Interactive Tilt Component ---
  const TiltCard = ({ children, className }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      x.set(xPct);
      y.set(yPct);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={className}
      >
        <div style={{ transform: "translateZ(20px)" }} className="h-full w-full">
          {children}
        </div>
      </motion.div>
    );
  };

  // --- FULLY RESPONSIVE Custom Audio Player ---
  const CustomAudioPlayer = ({ src, theme, size = 'medium' }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
      };
    }, []);

    const togglePlay = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const formatTime = (time) => {
      if (isNaN(time)) return '0:00';
      const mins = Math.floor(time / 60);
      const secs = Math.floor(time % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    };

    const handleVolumeChange = (e) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    if (size === 'tiny') {
      return (
        <div className="w-full">
          <audio ref={audioRef} src={src} />
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md flex-shrink-0"
            >
              {isPlaying ? (
                <Pause size={10} fill="white" />
              ) : (
                <Play size={10} fill="white" className="ml-0.5" />
              )}
            </button>
            <div className="flex-1">
              <div
                className="h-0.5 bg-slate-900/10 rounded-full cursor-pointer relative overflow-hidden"
                onClick={handleSeek}
              >
                <div
                  className="absolute left-0 top-0 h-full bg-slate-900 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (size === 'small') {
      return (
        <div className="w-full">
          <audio ref={audioRef} src={src} />
          <div className="space-y-2">
            <div
              className="h-1 bg-slate-900/10 rounded-full cursor-pointer relative overflow-hidden"
              onClick={handleSeek}
            >
              <div
                className="absolute left-0 top-0 h-full bg-slate-900 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md flex-shrink-0"
              >
                {isPlaying ? (
                  <Pause size={12} fill="white" />
                ) : (
                  <Play size={12} fill="white" className="ml-0.5" />
                )}
              </button>
              <div className="flex-1 flex items-center justify-between text-[10px] font-semibold text-slate-400 tabular-nums">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full space-y-3">
        <audio ref={audioRef} src={src} />

        <div
          className="h-1.5 bg-slate-900/10 rounded-full cursor-pointer relative overflow-hidden group"
          onClick={handleSeek}
        >
          <motion.div
            className="absolute left-0 top-0 h-full bg-slate-900 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-slate-900 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 7px)` }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md flex-shrink-0"
          >
            {isPlaying ? (
              <Pause size={16} fill="white" />
            ) : (
              <Play size={16} fill="white" className="ml-0.5" />
            )}
          </button>

          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold tabular-nums text-slate-600 whitespace-nowrap">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 h-px bg-slate-200 min-w-[20px]"></div>
            <span className="text-xs font-semibold tabular-nums text-slate-400 whitespace-nowrap">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Volume2 size={14} className="text-slate-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-12 h-1 bg-slate-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-slate-900 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  };

  // --- Live Clock Widget ---
  const ClockWidget = ({ accent, theme }) => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);
    return (
      <div className={`flex flex-col items-center justify-center h-full w-full p-6 text-center overflow-hidden ${theme.textColor || ''}`}>
        <Clock className={`mb-3 ${accent}`} size={24} />
        <div className="text-4xl font-black tabular-nums tracking-tighter">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-[10px] uppercase tracking-widest opacity-40 font-bold mt-2">Local Time</div>
      </div>
    );
  };

  // --- Enhanced Tweet Embed ---
  const EnhancedTweetEmbed = ({ url, theme }) => {
    return (
      <div className={`w-full h-full p-6 ${theme.textColor ? 'bg-slate-900/50' : 'bg-slate-50/50'} rounded-3xl flex flex-col justify-center`}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Twitter size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm">Twitter Post</div>
            <div className="text-xs opacity-60">@username</div>
          </div>
        </div>
        <div className="text-base leading-relaxed mb-4">
          View this post on Twitter
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`${theme.button} px-4 py-2 rounded-xl text-sm font-bold text-center hover:opacity-90 transition-all`}
        >
          Open Tweet
        </a>
      </div>
    );
  };

  export default function IdentityApp() {
    const [content, setContent] = useState([]);
    const [profile, setProfile] = useState({
      name: 'Your Name',
      profession: 'Creative Technologist & Designer',
      image: null,
      position: { x: 40, y: 40 }
    });
    const [showProfile, setShowProfile] = useState(true);
    const [viewMode, setViewMode] = useState('edit');
    const [currentTheme, setCurrentTheme] = useState('warmCream');
    const [copied, setCopied] = useState(false);
    const [showMovieSearch, setShowMovieSearch] = useState(false);
    const [showSongSearch, setShowSongSearch] = useState(false);
    const [showVerseSearch, setShowVerseSearch] = useState(false);
    const [showBookSearch, setShowBookSearch] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [activeCardId, setActiveCardId] = useState(null);
    const fileInputRef = useRef(null);
    const profileFileInputRef = useRef(null);
    const t = themes[currentTheme];

    const handleImageUpload = (e, cardId) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateCard(cardId, { imageData: reader.result });
        };
        reader.readAsDataURL(file);
      }
    };

    const handleProfileImageUpload = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfile(prev => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    };

    const triggerImageUpload = (cardId) => {
      setActiveCardId(cardId);
      fileInputRef.current?.click();
    };

    const addCard = (type) => {
      const newCard = { id: Date.now().toString(), type, value: '', title: '', size: 'medium' };
      setContent([...content, newCard]);
      setShowAddMenu(false);

      if (type === 'movie') {
        setActiveCardId(newCard.id);
        setShowMovieSearch(true);
      } else if (type === 'song') {
        setActiveCardId(newCard.id);
        setShowSongSearch(true);
      } else if (type === 'verse') {
        setActiveCardId(newCard.id);
        setShowVerseSearch(true);
      } else if (type === 'book') {
        setActiveCardId(newCard.id);
        setShowBookSearch(true);
      }
    };

    const updateCard = (id, up) => {
      setContent(c => c.map(i => i.id === id ? { ...i, ...up } : i));
    };

    const deleteCard = (id) => setContent(c => c.filter(i => i.id !== id));

    const handleMovieSelect = (movie) => {
      if (activeCardId) {
        updateCard(activeCardId, {
          movieData: movie,
          title: movie.title
        });
      }
      setShowMovieSearch(false);
      setActiveCardId(null);
    };

    const handleSongSelect = (song) => {
      if (activeCardId) {
        updateCard(activeCardId, {
          songData: song,
          title: song.title
        });
      }
      setShowSongSearch(false);
      setActiveCardId(null);
    };

    const handleVerseSelect = (verse) => {
      if (activeCardId) {
        updateCard(activeCardId, {
          verseData: verse,
          title: verse.reference
        });
      }
      setShowVerseSearch(false);
      setActiveCardId(null);
    };

    const handleBookSelect = (book) => {
      if (activeCardId) {
        updateCard(activeCardId, {
          bookData: book,
          title: book.title
        });
      }
      setShowBookSearch(false);
      setActiveCardId(null);
    };

    const openMovieSearch = (cardId) => {
      setActiveCardId(cardId);
      setShowMovieSearch(true);
    };

    const openSongSearch = (cardId) => {
      setActiveCardId(cardId);
      setShowSongSearch(true);
    };

    const openVerseSearch = (cardId) => {
      setActiveCardId(cardId);
      setShowVerseSearch(true);
    };

    const openBookSearch = (cardId) => {
      setActiveCardId(cardId);
      setShowBookSearch(true);
    };

    const getSpan = (size) => {
      switch (size) {
        case 'wide': return 'md:col-span-2 md:row-span-1';
        case 'tall': return 'md:col-span-1 md:row-span-2';
        case 'large': return 'md:col-span-2 md:row-span-2';
        default: return 'md:col-span-1 md:row-span-1';
      }
    };

    const getEmbedInfo = (url) => {
      if (!url) return { type: 'none' };
      if (url.includes('youtube.com/watch?v=')) return { type: 'youtube', id: url.split('v=')[1]?.split('&')[0] };
      if (url.includes('youtu.be/')) return { type: 'youtube', id: url.split('/').pop() };
      if (url.includes('twitter.com') || url.includes('x.com')) return { type: 'twitter' };
      if (url.includes('instagram.com')) return { type: 'instagram' };
      return { type: 'link' };
    };

    const getAudioPlayerSize = (cardSize) => {
      if (cardSize === 'medium') return 'tiny';
      if (cardSize === 'wide' || cardSize === 'tall') return 'small';
      return 'medium';
    };

    return (
      <div className={`min-h-screen ${t.bg} transition-all duration-1000 font-sans ${t.textColor || 'text-slate-900'} pb-32`}>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, activeCardId)}
          className="hidden"
        />
        <input
          ref={profileFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleProfileImageUpload}
          className="hidden"
        />

        {/* Floating Profile Picture (FIXED - Position persists in view mode) */}
        {showProfile && (
          <motion.div
            drag={viewMode === 'edit'}
            dragMomentum={false}
            dragElastic={0}
            style={{ x: profile.position.x, y: profile.position.y }}
            className="fixed z-[90]"
            onDragEnd={(e, info) => {
              if (viewMode === 'edit') {
                setProfile(prev => ({
                  ...prev,
                  position: { x: info.point.x, y: info.point.y }
                }));
              }
            }}
          >
            <div className="relative group">
              <div className={`${t.card} border-2 ${t.border} rounded-[32px] p-6 shadow-2xl backdrop-blur-xl flex items-center gap-4 ${viewMode === 'edit' ? 'cursor-move' : ''}`}>
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 overflow-hidden ring-4 ring-white/50 shadow-lg">
                    {profile.image ? (
                      <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={32} />
                      </div>
                    )}
                  </div>
                  {viewMode === 'edit' && (
                    <button
                      onClick={() => profileFileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all border-2 border-slate-100"
                    >
                      <Upload size={12} />
                    </button>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {viewMode === 'edit' ? (
                    <>
                      <input
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className={`bg-transparent text-xl font-black outline-none mb-1 w-full ${t.textColor || ''}`}
                        placeholder="Your Name"
                      />
                      <input
                        value={profile.profession}
                        onChange={(e) => setProfile(prev => ({ ...prev, profession: e.target.value }))}
                        className={`bg-transparent text-sm font-medium opacity-60 outline-none w-full ${t.textColor || ''}`}
                        placeholder="Your profession"
                      />
                    </>
                  ) : (
                    <>
                      <div className={`text-xl font-black mb-1 ${t.textColor || ''}`}>{profile.name}</div>
                      <div className={`text-sm font-medium opacity-60 ${t.textColor || ''}`}>{profile.profession}</div>
                    </>
                  )}
                </div>
                {viewMode === 'edit' && (
                  <button
                    onClick={() => setShowProfile(false)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full text-red-500"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {viewMode === 'edit' && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={`${t.card} border ${t.border} px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shadow-lg`}>
                    Drag to move
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {!showProfile && viewMode === 'edit' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowProfile(true)}
            className={`fixed top-40 left-8 z-[90] ${t.button} p-4 rounded-full shadow-xl hover:scale-110 transition-all`}
          >
            <Plus size={20} />
          </motion.button>
        )}

        {/* Dynamic Nav */}
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3">
          <div className={`p-1.5 ${t.glass} border ${t.border} rounded-[24px] flex gap-1 shadow-2xl shadow-black/5`}>
            <button onClick={() => setViewMode('edit')} className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black tracking-widest transition-all ${viewMode === 'edit' ? t.button : 'opacity-30 hover:opacity-60'}`}>BUILD</button>
            <button onClick={() => setViewMode('preview')} className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black tracking-widest transition-all ${viewMode === 'preview' ? t.button : 'opacity-30 hover:opacity-60'}`}>VIEW</button>
          </div>
          <button onClick={() => {
            const keys = Object.keys(themes);
            setCurrentTheme(keys[(keys.indexOf(currentTheme) + 1) % keys.length]);
          }} className={`p-3.5 ${t.glass} border ${t.border} rounded-full hover:rotate-90 transition-all duration-500`}>
            <Palette size={18} className={t.accent} />
          </button>
        </nav>

        <main className="max-w-6xl mx-auto px-6 pt-36">
          <Reorder.Group axis="y" values={content} onReorder={setContent} className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">
            <AnimatePresence mode="popLayout">
              {content.map((item) => {
                const info = getEmbedInfo(item.value);
                const audioSize = getAudioPlayerSize(item.size);

                return (
                  <Reorder.Item key={item.id} value={item} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={getSpan(item.size)}>
                    <TiltCard className="h-full w-full">
                      <div className={`${t.card} border ${t.border} rounded-[40px] h-full w-full overflow-hidden relative shadow-sm group hover:shadow-2xl hover:shadow-black/5 transition-all duration-500`}>

                        {/* Contextual Toolbar */}
                        {viewMode === 'edit' && (
                          <div className="absolute top-5 left-5 right-5 flex justify-between z-50 opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0">
                            <div className={`p-2 ${t.textColor ? 'bg-slate-700/90' : 'bg-white/90'} backdrop-blur-md rounded-full border ${t.border} cursor-grab`}><GripVertical size={14} /></div>
                            <div className="flex gap-2">
                              {item.type === 'movie' && (
                                <button onClick={() => openMovieSearch(item.id)} className={`p-2 ${t.textColor ? 'bg-slate-700/90 hover:bg-blue-500' : 'bg-white/90 hover:bg-black hover:text-white'} rounded-full border ${t.border} transition-all`}><Search size={14} /></button>
                              )}
                              {item.type === 'song' && (
                                <button onClick={() => openSongSearch(item.id)} className={`p-2 ${t.textColor ? 'bg-slate-700/90 hover:bg-blue-500' : 'bg-white/90 hover:bg-black hover:text-white'} rounded-full border ${t.border} transition-all`}><Search size={14} /></button>
                              )}
                              {item.type === 'verse' && (
                                <button onClick={() => openVerseSearch(item.id)} className={`p-2 ${t.textColor ? 'bg-slate-700/90 hover:bg-blue-500' : 'bg-white/90 hover:bg-black hover:text-white'} rounded-full border ${t.border} transition-all`}><Search size={14} /></button>
                              )}
                              {item.type === 'book' && (
                                <button onClick={() => openBookSearch(item.id)} className={`p-2 ${t.textColor ? 'bg-slate-700/90 hover:bg-blue-500' : 'bg-white/90 hover:bg-black hover:text-white'} rounded-full border ${t.border} transition-all`}><Search size={14} /></button>
                              )}
                              {item.type === 'image' && (
                                <button onClick={() => triggerImageUpload(item.id)} className={`p-2 ${t.textColor ? 'bg-slate-700/90 hover:bg-blue-500' : 'bg-white/90 hover:bg-black hover:text-white'} rounded-full border ${t.border} transition-all`}><Upload size={14} /></button>
                              )}
                              <button onClick={() => {
                                const sz = ['medium', 'wide', 'tall', 'large'];
                                updateCard(item.id, { size: sz[(sz.indexOf(item.size) + 1) % sz.length] });
                              }} className={`p-2 ${t.textColor ? 'bg-slate-700/90 hover:bg-blue-500' : 'bg-white/90 hover:bg-black hover:text-white'} rounded-full border ${t.border} transition-all`}><Maximize2 size={14} /></button>
                              <button onClick={() => deleteCard(item.id)} className="p-2 bg-red-50 rounded-full border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        )}

                        {/* Content Switcher */}
                        <div className="h-full w-full">
                          {item.type === 'movie' && item.movieData ? (
                            <div className="h-full w-full relative overflow-hidden group/movie">
                              {item.movieData.poster ? (
                                <>
                                  <img src={item.movieData.poster} alt={item.movieData.title} className="w-full h-full object-cover absolute inset-0" />
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-20">
                                    <div className="text-white font-black text-xl leading-tight mb-1">{item.movieData.title}</div>
                                    <div className="text-white/70 text-sm font-bold">{item.movieData.year}</div>
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-6 text-center">
                                  <Film size={48} className="text-slate-400 mb-4" />
                                  <div className="font-black text-lg leading-tight mb-1">{item.movieData.title}</div>
                                  <div className="text-sm text-slate-600 font-bold">{item.movieData.year}</div>
                                </div>
                              )}
                            </div>
                          ) : item.type === 'song' && item.songData ? (
                            <div className={`h-full w-full relative overflow-hidden bg-gradient-to-br ${t.songGradient}`}>
                              <div className="absolute inset-0 scale-110 opacity-20">
                                <img src={item.songData.artwork} alt={item.songData.title} className="w-full h-full object-cover blur-3xl" />
                              </div>

                              <div className="relative h-full flex flex-col p-5">
                                {item.size === 'medium' ? (
                                  <>
                                    <div className="flex items-center gap-2 mb-2 flex-1 min-h-0">
                                      <img
                                        src={item.songData.artwork}
                                        alt={item.songData.title}
                                        className="w-12 h-12 rounded-lg shadow-lg ring-1 ring-black/5 flex-shrink-0"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className={`font-black text-xs leading-tight line-clamp-1 ${t.textColor || ''}`}>{item.songData.title}</div>
                                        <div className={`text-[10px] font-semibold line-clamp-1 ${t.textColor ? 'text-slate-400' : 'text-slate-600'}`}>{item.songData.artist}</div>
                                      </div>
                                    </div>
                                    {item.songData.preview && (
                                      <div className={`backdrop-blur-xl ${t.textColor ? 'bg-slate-800/70' : 'bg-white/70'} rounded-xl p-2 shadow-lg ring-1 ring-black/5`}>
                                        <CustomAudioPlayer src={item.songData.preview} theme={t} size="tiny" />
                                      </div>
                                    )}
                                  </>
                                ) : item.size === 'wide' || item.size === 'tall' ? (
                                  <>
                                    <div className="flex items-center gap-3 mb-3 flex-1 min-h-0">
                                      <img
                                        src={item.songData.artwork}
                                        alt={item.songData.title}
                                        className="w-16 h-16 rounded-xl shadow-lg ring-1 ring-black/5 flex-shrink-0"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className={`font-black text-sm leading-tight line-clamp-2 ${t.textColor || ''}`}>{item.songData.title}</div>
                                        <div className={`text-xs font-semibold line-clamp-1 ${t.textColor ? 'text-slate-400' : 'text-slate-600'}`}>{item.songData.artist}</div>
                                      </div>
                                    </div>
                                    {item.songData.preview && (
                                      <div className={`backdrop-blur-xl ${t.textColor ? 'bg-slate-800/70' : 'bg-white/70'} rounded-2xl p-3 shadow-lg ring-1 ring-black/5`}>
                                        <CustomAudioPlayer src={item.songData.preview} theme={t} size="small" />
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <div className="flex-1 flex flex-col justify-center items-center text-center mb-4">
                                      <img
                                        src={item.songData.artwork}
                                        alt={item.songData.title}
                                        className="w-32 h-32 rounded-3xl shadow-2xl ring-1 ring-black/5 mb-4"
                                      />
                                      <div className="space-y-1 max-w-full px-2">
                                        <div className={`font-black text-lg leading-tight line-clamp-2 ${t.textColor || ''}`}>{item.songData.title}</div>
                                        <div className={`text-sm font-semibold line-clamp-1 ${t.textColor ? 'text-slate-400' : 'text-slate-600'}`}>{item.songData.artist}</div>
                                        {item.songData.album && (
                                          <div className={`text-xs line-clamp-1 ${t.textColor ? 'text-slate-500' : 'text-slate-400'}`}>{item.songData.album}</div>
                                        )}
                                      </div>
                                    </div>
                                    {item.songData.preview && (
                                      <div className={`backdrop-blur-xl ${t.textColor ? 'bg-slate-800/70' : 'bg-white/70'} rounded-3xl p-4 shadow-lg ring-1 ring-black/5`}>
                                        <CustomAudioPlayer src={item.songData.preview} theme={t} size="medium" />
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          ) : item.type === 'verse' && item.verseData ? (
                            <div className={`h-full w-full p-8 flex flex-col justify-center bg-gradient-to-br ${t.verseGradient} relative overflow-hidden`}>
                              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-black/5 to-transparent rounded-full blur-3xl" />
                              <div className="relative z-10">
                                <div className="mb-6">
                                  <BookOpen className={`${t.accent} mb-3`} size={28} />
                                  <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${t.textColor ? 'opacity-50' : 'opacity-60'}`}>{item.verseData.source}</div>
                                  <div className={`text-sm font-black ${t.textColor ? 'opacity-70' : 'opacity-80'}`}>{item.verseData.reference}</div>
                                </div>
                                <div className={`text-lg leading-relaxed italic font-serif ${t.textColor || ''}`}>
                                  &ldquo;{item.verseData.text}&rdquo;
                                </div>
                              </div>
                            </div>
                          ) : item.type === 'book' && item.bookData ? (
                            <div className="h-full w-full relative overflow-hidden group/book">
                              <img src={item.bookData.cover} alt={item.bookData.title} className="w-full h-full object-cover absolute inset-0" />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-20">
                                <div className="text-white font-black text-lg leading-tight mb-1 line-clamp-2">{item.bookData.title}</div>
                                <div className="text-white/70 text-sm font-bold">{item.bookData.author}</div>
                                {item.bookData.firstPublishYear && (
                                  <div className="text-white/50 text-xs mt-1">{item.bookData.firstPublishYear}</div>
                                )}
                              </div>
                              <a
                                href={`https://openlibrary.org${item.bookData.key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-4 right-4 p-2 bg-white/90 rounded-full opacity-0 group-hover/book:opacity-100 transition-all hover:scale-110"
                              >
                                <ArrowUpRight size={16} />
                              </a>
                            </div>
                          ) : item.type === 'link' && info.type === 'youtube' ? (
                            <div className="w-full h-full relative rounded-[40px] overflow-hidden">
                              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${info.id}?modestbranding=1`} frameBorder="0" allowFullScreen />
                            </div>
                          ) : item.type === 'link' && info.type === 'twitter' ? (
                            <EnhancedTweetEmbed url={item.value} theme={t} />
                          ) : item.type === 'link' && info.type === 'instagram' ? (
                            <div className={`w-full h-full p-6 ${t.textColor ? 'bg-gradient-to-br from-pink-900/30 to-purple-900/30' : 'bg-gradient-to-br from-pink-50 to-purple-50'} rounded-3xl flex flex-col justify-center`}>
                              <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                  <Instagram size={20} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-sm">Instagram Post</div>
                                  <div className="text-xs opacity-60">View on Instagram</div>
                                </div>
                              </div>
                              <a 
                                href={item.value} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold text-center hover:opacity-90 transition-all"
                              >
                                Open Post
                              </a>
                            </div>
                          ) : item.type === 'text' ? (
                            <div className="p-8 flex flex-col justify-center h-full w-full overflow-hidden">
                              <div className={`w-8 h-1 bg-slate-200 mb-6 rounded-full`} />
                              <textarea placeholder="Write a note..." value={item.value} onChange={e => updateCard(item.id, { value: e.target.value })} className={`bg-transparent w-full h-full resize-none outline-none text-lg font-bold leading-tight placeholder:opacity-10 ${t.textColor || ''}`} readOnly={viewMode === 'preview'} />
                            </div>
                          ) : item.type === 'image' && item.imageData ? (
                            <div className="h-full w-full relative overflow-hidden">
                              <img src={item.imageData} alt="Uploaded" className="w-full h-full object-cover absolute inset-0" />
                              {viewMode === 'edit' && (
                                <button
                                  onClick={() => triggerImageUpload(item.id)}
                                  className="absolute bottom-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full border border-white shadow-lg hover:bg-black hover:text-white transition-all z-10"
                                >
                                  <Upload size={16} />
                                </button>
                              )}
                            </div>
                          ) : item.type === 'image' && viewMode === 'edit' ? (
                            <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                              <div className={`w-20 h-20 rounded-full ${t.bg} flex items-center justify-center mb-4 border ${t.border} flex-shrink-0`}>
                                <ImageIcon size={32} className="opacity-20" />
                              </div>
                              <div className="font-bold text-lg mb-2">No image uploaded</div>
                              <button
                                onClick={() => triggerImageUpload(item.id)}
                                className={`${t.button} px-6 py-3 rounded-2xl text-sm font-bold mt-2`}
                              >
                                Upload Image
                              </button>
                            </div>
                          ) : item.type === 'clock' ? (
                            <ClockWidget accent={t.accent} theme={t} />
                          ) : item.type === 'link' && item.value && viewMode === 'preview' ? (
                            <a href={item.value} target="_blank" rel="noopener noreferrer" className={`p-8 h-full w-full flex flex-col justify-between ${t.textColor ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50/50'} transition-all overflow-hidden group`}>
                              <div className="flex justify-between items-start">
                                <div className={`w-12 h-12 rounded-2xl ${t.bg} flex items-center justify-center border ${t.border} shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                  <Link2 className="opacity-30 group-hover:opacity-60 transition-opacity" size={20} />
                                </div>
                                <ArrowUpRight size={20} className="opacity-20 group-hover:opacity-100 transition-opacity flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transform duration-200" />
                              </div>
                              <div className="space-y-2 min-w-0">
                                <div className="text-xl font-black leading-tight break-words group-hover:text-blue-500 transition-colors">{item.title || 'Untitled Link'}</div>
                                <div className="text-xs font-bold opacity-40 truncate">{item.value}</div>
                              </div>
                            </a>
                          ) : (item.type === 'movie' || item.type === 'song' || item.type === 'verse' || item.type === 'book') && viewMode === 'edit' ? (
                            <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                              <div className={`w-20 h-20 rounded-full ${t.bg} flex items-center justify-center mb-4 border ${t.border} flex-shrink-0`}>
                                {item.type === 'movie' ? <Film size={32} className="opacity-20" /> : 
                                item.type === 'song' ? <Music size={32} className="opacity-20" /> :
                                item.type === 'verse' ? <BookOpen size={32} className="opacity-20" /> :
                                <BookMarked size={32} className="opacity-20" />}
                              </div>
                              <div className="font-bold text-lg mb-2">
                                No {item.type === 'verse' ? 'verse' : item.type} selected
                              </div>
                              <button
                                onClick={() => {
                                  if (item.type === 'movie') openMovieSearch(item.id);
                                  else if (item.type === 'song') openSongSearch(item.id);
                                  else if (item.type === 'verse') openVerseSearch(item.id);
                                  else if (item.type === 'book') openBookSearch(item.id);
                                }}
                                className={`${t.button} px-6 py-3 rounded-2xl text-sm font-bold mt-2`}
                              >
                                Search {item.type === 'verse' ? 'Verses' : item.type === 'book' ? 'Books' : item.type === 'movie' ? 'Movies' : 'Songs'}
                              </button>
                            </div>
                          ) : (
                            <div className="p-8 h-full w-full flex flex-col justify-between overflow-hidden">
                              <div className="flex justify-between items-start">
                                <div className={`w-12 h-12 rounded-2xl ${t.bg} flex items-center justify-center border ${t.border} shadow-inner flex-shrink-0`}><Link2 className="opacity-20" size={20} /></div>
                                <ArrowUpRight size={20} className="opacity-10 group-hover:opacity-40 transition-opacity flex-shrink-0" />
                              </div>
                              <div className="space-y-2 min-w-0">
                                {viewMode === 'edit' && (
                                  <input
                                    placeholder="https://example.com"
                                    value={item.value || ''}
                                    onChange={e => updateCard(item.id, { value: e.target.value })}
                                    className={`${t.textColor ? 'bg-slate-900/50 text-white placeholder:text-slate-500' : 'bg-slate-50'} border ${t.border} w-full text-xs font-medium px-3 py-2 rounded-xl outline-none focus:ring-2 ${t.ring} transition-all`}
                                  />
                                )}
                                <input
                                  placeholder="Link Title"
                                  value={item.title || ''}
                                  onChange={e => updateCard(item.id, { title: e.target.value })}
                                  className={`bg-transparent w-full text-xl font-black outline-none placeholder:opacity-20 ${t.textColor || ''}`}
                                  readOnly={viewMode === 'preview'}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TiltCard>
                  </Reorder.Item>
                );
              })}
            </AnimatePresence>
          </Reorder.Group>
        </main>

        {/* Add Menu (Plus Button with Popup) */}
        {viewMode === 'edit' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
          >
            <AnimatePresence>
              {showAddMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  className={`absolute bottom-20 left-1/2 -translate-x-1/2 ${t.card} border ${t.border} rounded-3xl p-4 shadow-2xl backdrop-blur-xl min-w-[280px]`}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: <Link2 size={20} />, type: 'link', label: 'Link' },
                      { icon: <Type size={20} />, type: 'text', label: 'Text' },
                      { icon: <ImageIcon size={20} />, type: 'image', label: 'Image' },
                      { icon: <Clock size={20} />, type: 'clock', label: 'Clock' },
                      { icon: <Film size={20} />, type: 'movie', label: 'Movie' },
                      { icon: <Music size={20} />, type: 'song', label: 'Song' },
                      { icon: <BookOpen size={20} />, type: 'verse', label: 'Verse' },
                      { icon: <BookMarked size={20} />, type: 'book', label: 'Book' }
                    ].map(tool => (
                      <button
                        key={tool.type}
                        onClick={() => addCard(tool.type)}
                        className={`flex flex-col items-center gap-2 p-4 ${t.textColor ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-100' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'} rounded-2xl transition-all active:scale-90`}
                      >
                        {tool.icon}
                        <span className="text-[10px] font-bold">{tool.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className={`${t.button} w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all ${showAddMenu ? 'rotate-45' : ''}`}
              >
                <Plus size={28} />
              </button>

              <button
                onClick={() => { 
                  navigator.clipboard.writeText(window.location.href); 
                  setCopied(true); 
                  setTimeout(() => setCopied(false), 2000); 
                }}
                className={`${t.button} px-8 py-4 rounded-full font-black text-xs tracking-[0.2em] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl`}
              >
                {copied ? <Check size={16} /> : <Share2 size={16} />} 
                {copied ? 'COPIED' : 'PUBLISH'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {showMovieSearch && (
            <MovieSearchModal
              onClose={() => { setShowMovieSearch(false); setActiveCardId(null); }}
              onSelect={handleMovieSelect}
              theme={t}
            />
          )}
          {showSongSearch && (
            <SongSearchModal
              onClose={() => { setShowSongSearch(false); setActiveCardId(null); }}
              onSelect={handleSongSelect}
              theme={t}
            />
          )}
          {showVerseSearch && (
            <VerseSearchModal
              onClose={() => { setShowVerseSearch(false); setActiveCardId(null); }}
              onSelect={handleVerseSelect}
              theme={t}
            />
          )}
          {showBookSearch && (
            <BookSearchModal
              onClose={() => { setShowBookSearch(false); setActiveCardId(null); }}
              onSelect={handleBookSelect}
              theme={t}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }