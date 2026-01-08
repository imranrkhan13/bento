import React, { useState, useEffect, useRef } from 'react';
import { Link2, Image, Type, Plus, Copy, Check, Trash2, Eye, GripVertical, ExternalLink, Upload, Maximize2, Edit3, Share2 } from 'lucide-react';

function App() {
  const [userId, setUserId] = useState('');
  const [content, setContent] = useState([]);
  const [newContent, setNewContent] = useState({ type: '', value: '', title: '', size: 'medium', preview: null });
  const [shareableLink, setShareableLink] = useState('');
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('edit');
  const [draggedItem, setDraggedItem] = useState(null);
  const [imageMode, setImageMode] = useState('url');
  const [editingItem, setEditingItem] = useState(null);
  const [showSizeMenu, setShowSizeMenu] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadUserData();
    const hash = window.location.hash.substring(1);
    if (hash && hash.startsWith('view_')) {
      setViewMode('shared');
      loadSharedData(hash);
    }
  }, []);

  const loadUserData = async () => {
    try {
      const result = await window.storage.get('userData');
      if (result) {
        const data = JSON.parse(result.value);
        setUserId(data.userId);
        setContent(data.content || []);
        setShareableLink(data.shareableLink);
      }
    } catch (error) {
      console.log('No existing data found');
    }
  };

  const loadSharedData = async (shareId) => {
    try {
      const result = await window.storage.get(shareId, true);
      if (result) {
        const data = JSON.parse(result.value);
        setUserId(data.userId);
        setContent(data.content || []);
      }
    } catch (error) {
      console.log('Shared data not found');
    }
  };

  const saveUserData = async (updatedContent) => {
    const newUserId = userId || `user_${Date.now()}`;
    const shareId = `view_${newUserId}`;
    const newShareableLink = `${window.location.origin}${window.location.pathname}#${shareId}`;

    const userData = {
      userId: newUserId,
      content: updatedContent,
      shareableLink: newShareableLink
    };

    try {
      await window.storage.set('userData', JSON.stringify(userData));
      await window.storage.set(shareId, JSON.stringify(userData), true);
      setUserId(newUserId);
      setShareableLink(newShareableLink);
    } catch (error) {
      console.error('Error saving data', error);
    }
  };

  const fetchLinkPreview = async (url) => {
    setLoadingPreview(true);
    try {
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (data.status === 'success') {
        setLoadingPreview(false);
        return {
          title: data.data.title,
          description: data.data.description,
          image: data.data.image?.url,
          logo: data.data.logo?.url
        };
      }
    } catch (error) {
      console.error('Preview fetch failed:', error);
    }
    setLoadingPreview(false);
    return null;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (editingItem) {
          setEditingItem({ ...editingItem, value: reader.result });
        } else {
          setNewContent({ ...newContent, value: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddContent = async () => {
    if (!newContent.type || !newContent.value) return;

    let contentToAdd = { ...newContent, id: Date.now() };

    if (newContent.type === 'link') {
      const preview = await fetchLinkPreview(newContent.value);
      if (preview) {
        contentToAdd.preview = preview;
      }
    }

    const updatedContent = [...content, contentToAdd];
    setContent(updatedContent);
    saveUserData(updatedContent);
    setNewContent({ type: '', value: '', title: '', size: 'medium', preview: null });
    setIsAddingContent(false);
    setImageMode('url');
  };

  const handleUpdateContent = async () => {
    if (!editingItem || !editingItem.value) return;

    let itemToUpdate = { ...editingItem };

    if (editingItem.type === 'link' && editingItem.value !== content.find(i => i.id === editingItem.id)?.value) {
      const preview = await fetchLinkPreview(editingItem.value);
      if (preview) {
        itemToUpdate.preview = preview;
      }
    }

    const updatedContent = content.map(item =>
      item.id === editingItem.id ? itemToUpdate : item
    );
    setContent(updatedContent);
    saveUserData(updatedContent);
    setEditingItem(null);
    setImageMode('url');
  };

  const handleDeleteContent = (id) => {
    const updatedContent = content.filter(item => item.id !== id);
    setContent(updatedContent);
    saveUserData(updatedContent);
  };

  const handleSizeChange = (id, newSize) => {
    const updatedContent = content.map(item =>
      item.id === id ? { ...item, size: newSize } : item
    );
    setContent(updatedContent);
    saveUserData(updatedContent);
    setShowSizeMenu(null);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const updatedContent = [...content];
    const draggedItemContent = updatedContent[draggedItem];
    updatedContent.splice(draggedItem, 1);
    updatedContent.splice(dropIndex, 0, draggedItemContent);

    setContent(updatedContent);
    saveUserData(updatedContent);
    setDraggedItem(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getGridClass = (size) => {
    switch (size) {
      case 'small': return 'md:col-span-1';
      case 'medium': return 'md:col-span-1';
      case 'large': return 'md:col-span-2';
      case 'xlarge': return 'md:col-span-3';
      default: return 'md:col-span-1';
    }
  };

  const renderCard = (item, index, isShared = false) => (
    <div
      key={item.id}
      draggable={!isShared}
      onDragStart={(e) => !isShared && handleDragStart(e, index)}
      onDragOver={(e) => !isShared && handleDragOver(e, index)}
      onDrop={(e) => !isShared && handleDrop(e, index)}
      className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-slate-700/50 hover:border-slate-600/50 transition-all ${!isShared ? 'cursor-move' : ''} ${getGridClass(item.size)} ${draggedItem === index ? 'opacity-40 scale-95' : ''
        } group relative`}
      style={{ minHeight: '200px' }}
    >
      {!isShared && (
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <div className="text-slate-400 hover:text-slate-200 transition-colors bg-black/60 backdrop-blur-md rounded-lg p-2 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSizeMenu(showSizeMenu === item.id ? null : item.id);
                }}
                className="text-slate-400 hover:text-slate-200 p-2 rounded-lg transition-colors bg-black/60 backdrop-blur-md"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              {showSizeMenu === item.id && (
                <div className="absolute left-0 top-12 bg-slate-800 rounded-xl p-2 border border-slate-700 shadow-2xl z-30">
                  <div className="flex gap-1">
                    {[
                      { size: 'small', label: 'S' },
                      { size: 'medium', label: 'M' },
                      { size: 'large', label: 'L' },
                      { size: 'xlarge', label: 'XL' }
                    ].map(({ size, label }) => (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSizeChange(item.id, size);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${item.size === size
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700'
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingItem(item);
                setImageMode('url');
              }}
              className="text-slate-400 hover:text-slate-200 hover:bg-black/60 p-2 rounded-lg transition-all backdrop-blur-md"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteContent(item.id);
              }}
              className="text-red-400 hover:text-red-300 hover:bg-black/60 p-2 rounded-lg transition-all backdrop-blur-md"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {item.type === 'link' && (
        <a href={item.value} target="_blank" rel="noopener noreferrer" className="block h-full hover:bg-slate-700/20 transition-colors">
          {item.preview ? (
            <div className="h-full flex flex-col">
              {item.preview.image && (
                <div className="h-48 overflow-hidden">
                  <img src={item.preview.image} alt={item.preview.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {item.preview.logo && (
                      <img src={item.preview.logo} alt="" className="w-8 h-8 rounded-lg" />
                    )}
                    <h3 className="font-semibold text-white text-xl line-clamp-2">{item.title || item.preview.title}</h3>
                  </div>
                  {item.preview.description && (
                    <p className="text-slate-400 text-sm line-clamp-3">{item.preview.description}</p>
                  )}
                </div>
                <div className="flex items-center text-slate-500 group-hover:text-emerald-400 transition-colors mt-4">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span className="text-sm truncate">{new URL(item.value).hostname}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full p-8 flex flex-col justify-center">
              <h3 className="font-semibold text-white text-2xl mb-3">{item.title || 'Link'}</h3>
              <p className="text-slate-400 break-all mb-4 text-sm">{item.value}</p>
              <div className="flex items-center text-slate-500 group-hover:text-emerald-400 transition-colors">
                <ExternalLink className="w-5 h-5" />
              </div>
            </div>
          )}
        </a>
      )}

      {item.type === 'image' && (
        <div className="h-full relative">
          <img src={item.value} alt={item.title} className="w-full h-full object-cover" />
          {item.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="font-semibold text-white text-2xl">{item.title}</h3>
            </div>
          )}
        </div>
      )}

      {item.type === 'text' && (
        <div className="h-full p-8 flex flex-col justify-center">
          {item.title && <h3 className="font-semibold text-white text-2xl mb-4">{item.title}</h3>}
          <p className="text-slate-300 text-lg leading-relaxed">{item.value}</p>
        </div>
      )}
    </div>
  );

  if (viewMode === 'shared' || viewMode === 'preview') {
    return (
      <div className="min-h-screen bg-slate-950" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {viewMode === 'preview' && (
          <button
            onClick={() => setViewMode('edit')}
            className="fixed top-6 right-6 bg-slate-800 border border-slate-700 px-6 py-3 rounded-2xl text-sm font-medium text-white hover:bg-slate-700 hover:border-slate-600 transition-all z-50"
          >
            Back to Edit
          </button>
        )}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-2xl mx-auto">
              {userId ? userId.charAt(5).toUpperCase() : 'U'}
            </div>
            <h1 className="text-5xl font-bold text-white mb-2">{userId || 'username'}</h1>
            <p className="text-slate-400 text-lg">bento style links</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.map((item, index) => renderCard(item, index, true))}
          </div>

          {content.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <p className="text-xl">No content available</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
        {/* <div className="mb-12">
          <h1 className="text-6xl font-bold text-white mb-3">bento</h1>
          <p className="text-slate-400 text-xl">your bento style website</p>
        </div> */}

        {shareableLink && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 mb-6 border border-slate-700/50 animate-slide-up">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-500 mb-2 font-medium flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Your shareable link
                </p>
                <p className="text-emerald-400 font-medium truncate text-sm bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-700">
                  {shareableLink}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setViewMode('preview')}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all flex items-center gap-2 text-white font-medium border border-slate-700"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all flex items-center gap-2 font-medium shadow-lg shadow-emerald-500/20"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {content.map((item, index) => renderCard(item, index, false))}
        </div>

        {!isAddingContent && !editingItem && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 shadow-2xl flex items-center gap-2">
              <button
                onClick={() => {
                  setIsAddingContent(true);
                  setNewContent({ ...newContent, type: 'link' });
                }}
                className="p-4 rounded-xl bg-slate-700 hover:bg-emerald-600 transition-all group"
                title="Add Link"
              >
                <Link2 className="w-6 h-6 text-slate-300 group-hover:text-white" />
              </button>
              <button
                onClick={() => {
                  setIsAddingContent(true);
                  setNewContent({ ...newContent, type: 'image' });
                }}
                className="p-4 rounded-xl bg-slate-700 hover:bg-emerald-600 transition-all group"
                title="Add Image"
              >
                <Image className="w-6 h-6 text-slate-300 group-hover:text-white" />
              </button>
              <button
                onClick={() => {
                  setIsAddingContent(true);
                  setNewContent({ ...newContent, type: 'text' });
                }}
                className="p-4 rounded-xl bg-slate-700 hover:bg-emerald-600 transition-all group"
                title="Add Text"
              >
                <Type className="w-6 h-6 text-slate-300 group-hover:text-white" />
              </button>
            </div>
          </div>
        )}

        {(isAddingContent || editingItem) && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 animate-slide-up max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-semibold text-white mb-6">{editingItem ? 'Edit Content' : 'Add New Content'}</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">Card Size</label>
                  <div className="flex gap-2">
                    {[
                      { size: 'small', label: 'S' },
                      { size: 'medium', label: 'M' },
                      { size: 'large', label: 'L' },
                      { size: 'xlarge', label: 'XL' }
                    ].map(({ size, label }) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => editingItem ? setEditingItem({ ...editingItem, size }) : setNewContent({ ...newContent, size })}
                        className={`flex-1 p-3 rounded-xl border-2 transition-all text-sm font-bold ${(editingItem ? editingItem.size : newContent.size) === size
                          ? 'border-emerald-500 bg-emerald-950/50 text-emerald-400'
                          : 'border-slate-700 hover:border-slate-600 bg-slate-800/50 text-slate-400'
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">Title (optional)</label>
                  <input
                    type="text"
                    placeholder="Enter a title"
                    value={editingItem ? editingItem.title : newContent.title}
                    onChange={(e) => editingItem ? setEditingItem({ ...editingItem, title: e.target.value }) : setNewContent({ ...newContent, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder-slate-500"
                  />
                </div>

                {(editingItem ? editingItem.type : newContent.type) === 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-3">Image Source</label>
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all ${imageMode === 'url'
                          ? 'border-emerald-500 bg-emerald-950/50 text-emerald-400'
                          : 'border-slate-700 bg-slate-800/50 text-slate-400'
                          }`}
                      >
                        URL
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageMode('upload');
                          fileInputRef.current?.click();
                        }}
                        className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${imageMode === 'upload'
                          ? 'border-emerald-500 bg-emerald-950/50 text-emerald-400'
                          : 'border-slate-700 bg-slate-800/50 text-slate-400'
                          }`}
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {imageMode === 'url' && (
                      <input
                        type="text"
                        placeholder="Enter image URL"
                        value={editingItem ? editingItem.value : newContent.value}
                        onChange={(e) => editingItem ? setEditingItem({ ...editingItem, value: e.target.value }) : setNewContent({ ...newContent, value: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder-slate-500"
                      />
                    )}
                    {(editingItem ? editingItem.value : newContent.value) && (
                      <img src={editingItem ? editingItem.value : newContent.value} alt="Preview" className="w-full max-w-xs rounded-xl mt-3" />
                    )}
                  </div>
                )}

                {(editingItem ? editingItem.type : newContent.type) !== 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-3">
                      {(editingItem ? editingItem.type : newContent.type) === 'link' ? 'URL' : 'Text Content'}
                    </label>
                    {(editingItem ? editingItem.type : newContent.type) === 'text' ? (
                      <textarea
                        placeholder="Enter your text"
                        value={editingItem ? editingItem.value : newContent.value}
                        onChange={(e) => editingItem ? setEditingItem({ ...editingItem, value: e.target.value }) : setNewContent({ ...newContent, value: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all min-h-32 resize-none text-white placeholder-slate-500"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter URL (e.g., https://bsky.app/profile/yourname)"
                        value={editingItem ? editingItem.value : newContent.value}
                        onChange={(e) => editingItem ? setEditingItem({ ...editingItem, value: e.target.value }) : setNewContent({ ...newContent, value: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder-slate-500"
                      />
                    )}
                  </div>
                )}

                {loadingPreview && (
                  <div className="text-center py-4">
                    <div className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-sm mt-2">Loading preview...</p>
                  </div>
                )}

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={editingItem ? handleUpdateContent : handleAddContent}
                    disabled={editingItem ? !editingItem.value : !newContent.value || loadingPreview}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-2xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingItem ? 'Update Content' : 'Add Content'}
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingContent(false);
                      setEditingItem(null);
                      setNewContent({ type: '', value: '', title: '', size: 'medium', preview: null });
                      setImageMode('url');
                    }}
                    className="px-8 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-2xl font-medium transition-all border border-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div> {content.length === 0 && !isAddingContent && (
                <div className="text-center py-20 text-slate-600">
                  <p className="text-xl">Click the + card to get started</p>
                </div>
              )}
            </div>
          </div>
)}
      </div>
      </div>
)}
export default App;