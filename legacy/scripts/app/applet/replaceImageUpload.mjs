import fs from 'fs';

let eventCode = fs.readFileSync('src/components/admin/EventManagement.tsx', 'utf-8');

let eventImageUploadRegex = /<div className="col-span-full">\s*<label className="block text-xs font-semibold text-slate-700 mb-2">Image de couverture<\/label>\s*<div className="space-y-4">\s*<div className="flex gap-4">[\s\S]*?<\/label>\s*<\/div>\s*<\/div>\s*<\/div>/;

let eventReplacement = `                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Image de couverture</label>
                      {formData.image ? (
                        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-slate-200 group">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                            className="absolute inset-0 bg-red-500/20 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-8 h-8 drop-shadow-md" />
                          </button>
                        </div>
                      ) : (
                        <label className={\`aspect-[21/9] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-900/30 hover:text-blue-900 hover:bg-blue-50/50 transition-all cursor-pointer \${uploading && uploadType === 'image' ? 'opacity-50 cursor-not-allowed' : ''}\`}>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'image')}
                            disabled={uploading}
                          />
                          {uploading && uploadType === 'image' ? (
                            <Loader2 className="w-8 h-8 animate-spin mb-3" />
                          ) : (
                            <Upload className="w-8 h-8 mb-3" />
                          )}
                          <span className="text-sm font-medium">Cliquez pour ajouter une image</span>
                        </label>
                      )}
                    </div>`;

eventCode = eventCode.replace(eventImageUploadRegex, eventReplacement);
fs.writeFileSync('src/components/admin/EventManagement.tsx', eventCode);

let newsCode = fs.readFileSync('src/components/admin/NewsManagement.tsx', 'utf-8');

let newsImageUploadRegex = /<div className="col-span-full">\s*<label className="block text-xs font-semibold text-slate-700 mb-2">\{t\.admin\.news\.imageLabel\}<\/label>\s*<div className="space-y-4">\s*<div className=\{\`flex gap-4 \$\{isRTL \? 'flex-row-reverse' : ''\}\`\}>[\s\S]*?<\/label>\s*<\/div>\s*(?:\{error && uploadType === 'image' && \([\s\S]*?<\/div>\s*\)\}\s*)?<\/div>\s*<\/div>/;

let newsReplacement = `                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">{t.admin.news.imageLabel}</label>
                      {formData.image ? (
                        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-slate-200 group">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                            className="absolute inset-0 bg-red-500/20 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-8 h-8 drop-shadow-md" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className={\`aspect-[21/9] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-900/30 hover:text-blue-900 hover:bg-blue-50/50 transition-all cursor-pointer \${uploading && uploadType === 'image' ? 'opacity-50 cursor-not-allowed' : ''}\`}>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, 'image')}
                              disabled={uploading}
                            />
                            {uploading && uploadType === 'image' ? (
                              <Loader2 className="w-8 h-8 animate-spin mb-3" />
                            ) : (
                              <Upload className="w-8 h-8 mb-3" />
                            )}
                            <span className="text-sm font-medium">Cliquez pour ajouter une image</span>
                          </label>
                          {error && uploadType === 'image' && (
                            <div className={\`flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider \${isRTL ? 'flex-row-reverse' : ''}\`}>
                              <AlertCircle className="w-4 h-4" />
                              <span>{error}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>`;

newsCode = newsCode.replace(newsImageUploadRegex, newsReplacement);
fs.writeFileSync('src/components/admin/NewsManagement.tsx', newsCode);
