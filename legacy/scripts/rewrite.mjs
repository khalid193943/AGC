import fs from 'fs';

// Helper to fully overwrite
function rewriteEvent() {
  let code = fs.readFileSync('src/components/admin/EventManagement.tsx', 'utf-8');
  
  // 1. Update interface
  code = code.replace("video?: string;", "additionalImages?: string[];");
  
  // 2. Remove video from form init
  code = code.replace("video: '',", "additionalImages: [],");
  
  // 3. Update upload states
  code = code.replace("useState<'image' | 'video' | null>", "useState<string | null>");
  
  // 4. Update file upload function
  code = code.replace("type: 'image' | 'video'", "type: string");
  
  // Max size
  code = code.replace("const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos", "const maxSize = 5 * 1024 * 1024; // 5MB for images");
  
  code = code.replace("setError(`Le fichier est trop volumineux (max ${type === 'image' ? '5MB' : '50MB'})`);", "setError(`Le fichier est trop volumineux (max 5MB)`);");
  
  // Storage path
  code = code.replace("const storagePath = `${type === 'image' ? 'events' : 'event_videos'}/${fileName}`;", "const storagePath = `events/${fileName}`;");
  
  // Updating formData inside upload
  code = code.replace("setFormData(prev => ({ ...prev, [type]: downloadURL }));", `
            if (type === 'additionalImages') {
              setFormData(prev => ({ ...prev, additionalImages: [...(prev.additionalImages || []), downloadURL].slice(0, 4) }));
            } else {
              setFormData(prev => ({ ...prev, [type]: downloadURL }));
            }
`);

  // Replace modal wrapper
  code = code.replace("className=\"relative w-full max-w-6xl bg-white rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]\"", 
                      "className=\"relative w-full max-w-2xl bg-white rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-auto max-h-[90vh]\"");

  // Fix md:border-r on the form wrapper
  code = code.replace("className=\"flex-grow overflow-y-auto p-6 md:p-16 md:border-r border-slate-50\"",
                      "className=\"flex-grow overflow-y-auto p-6 md:p-12\"");
                      
  // Replace the Video section with Additional Images section
  let videoSection = `                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Vidéo (Optionnel)</label>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <input
                            type="url"
                            name="video"
                            value={formData.video || ''}
                            onChange={handleInputChange}
                            className="flex-grow px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all outline-none text-sm font-medium text-blue-950 placeholder:text-slate-400"
                            placeholder={"https://youtube..."}
                          />
                          <label className={\`flex items-center justify-center px-6 bg-slate-50 text-slate-400 rounded-2xl cursor-pointer hover:bg-slate-100 hover:text-blue-950 transition-all border border-slate-100 \${uploading && uploadType === 'video' ? 'opacity-50 cursor-not-allowed' : ''}\`}>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, 'video')}
                              disabled={uploading}
                            />
                            {uploading && uploadType === 'video' ? (
                              <div className="relative w-6 h-6">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-950" />
                              </div>
                            ) : (
                              <Upload className="w-6 h-6" />
                            )}
                          </label>
                        </div>
                      </div>
                    </div>`;

  let imagesSection = `                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Images Supplémentaires (Max 4)</label>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {(formData.additionalImages || []).map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 hover:border-red-400 group">
                              <img src={img} alt="Additional" className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, additionalImages: prev.additionalImages?.filter((_, i) => i !== idx) }))}
                                className="absolute inset-0 bg-red-500/20 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 className="w-6 h-6 drop-shadow-md" />
                              </button>
                            </div>
                          ))}
                          
                          {(!formData.additionalImages || formData.additionalImages.length < 4) && (
                            <label className={\`aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-900/30 hover:text-blue-900 hover:bg-blue-50/50 transition-all cursor-pointer \${uploading && uploadType === 'additionalImages' ? 'opacity-50 cursor-not-allowed' : ''}\`}>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'additionalImages')}
                                disabled={uploading}
                              />
                              {uploading && uploadType === 'additionalImages' ? (
                                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                              ) : (
                                <Plus className="w-6 h-6 mb-2" />
                              )}
                              <span className="text-xs font-medium">Ajouter</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>`;
                    
  code = code.replace(videoSection, imagesSection);

  // Remove the preview wrapper and all its contents
  // The preview wrapper starts with `<div className="hidden lg:block w-[400px]`
  // and ends before `</motion.div>`
  
  let previewRegex = /<div className="hidden lg:block w-\[400px\][\s\S]*?(?=<\/motion\.div>)/;
  code = code.replace(previewRegex, "");

  fs.writeFileSync('src/components/admin/EventManagement.tsx', code);
}

function rewriteNews() {
  let code = fs.readFileSync('src/components/admin/NewsManagement.tsx', 'utf-8');
  
  // 1. Update interface
  code = code.replace("video?: string;", "additionalImages?: string[];");
  
  // 2. Remove video from form init
  code = code.replace("video: '',", "additionalImages: [],");
  
  // 3. Update upload states
  code = code.replace("useState<'image' | 'video' | null>", "useState<string | null>");
  
  // 4. Update file upload function
  code = code.replace("type: 'image' | 'video'", "type: string");
  
  // Max size
  code = code.replace("const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos", "const maxSize = 5 * 1024 * 1024; // 5MB for images");
  
  code = code.replace("setError(`Le fichier est trop volumineux (max ${type === 'image' ? '5MB' : '50MB'})`);", "setError(`Le fichier est trop volumineux (max 5MB)`);");
  
  // Storage path
  code = code.replace("const storagePath = `${type === 'image' ? 'news' : 'news_videos'}/${fileName}`;", "const storagePath = `news/${fileName}`;");
  
  // Updating formData inside upload
  code = code.replace("setFormData(prev => ({ ...prev, [type]: downloadURL }));", `
            if (type === 'additionalImages') {
              setFormData(prev => ({ ...prev, additionalImages: [...(prev.additionalImages || []), downloadURL].slice(0, 4) }));
            } else {
              setFormData(prev => ({ ...prev, [type]: downloadURL }));
            }
`);

  // Replace modal wrapper
  code = code.replace("className=\"relative w-full max-w-6xl bg-white rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]\"", 
                      "className=\"relative w-full max-w-2xl bg-white rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-auto max-h-[90vh]\"");

  // Fix md:border-r on the form wrapper for News (it also has isRTL in the string)
  let rtlWrapperRegex = /className=\{\`flex-grow overflow-y-auto p-6 md:p-16 \$\{isRTL \? 'md:border-l text-right' : 'md:border-r'\} border-slate-50\`\}/;
  code = code.replace(rtlWrapperRegex, "className={`flex-grow overflow-y-auto p-6 md:p-12 ${isRTL ? 'text-right' : ''}`}");

  // Replace the Video section with Additional Images section
  let videoSection = `                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Vidéo (Optionnel)</label>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <input
                            type="url"
                            name="video"
                            value={formData.video || ''}
                            onChange={handleInputChange}
                            className={\`flex-grow px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10 transition-all outline-none text-sm font-medium text-blue-950 placeholder:text-slate-400 \${isRTL ? 'text-right' : ''}\`}
                            placeholder={"https://youtube..."}
                          />
                          <label className={\`flex items-center justify-center px-6 bg-slate-50 text-slate-400 rounded-2xl cursor-pointer hover:bg-slate-100 hover:text-blue-950 transition-all border border-slate-100 \${uploading && uploadType === 'video' ? 'opacity-50 cursor-not-allowed' : ''}\`}>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, 'video')}
                              disabled={uploading}
                            />
                            {uploading && uploadType === 'video' ? (
                              <div className="relative w-6 h-6">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-950" />
                              </div>
                            ) : (
                              <Upload className="w-6 h-6" />
                            )}
                          </label>
                        </div>
                      </div>
                    </div>`;

  let imagesSection = `                    <div className="col-span-full">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Images Supplémentaires (Max 4)</label>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {(formData.additionalImages || []).map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 hover:border-red-400 group">
                              <img src={img} alt="Additional" className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, additionalImages: prev.additionalImages?.filter((_, i) => i !== idx) }))}
                                className="absolute inset-0 bg-red-500/20 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 className="w-6 h-6 drop-shadow-md" />
                              </button>
                            </div>
                          ))}
                          
                          {(!formData.additionalImages || formData.additionalImages.length < 4) && (
                            <label className={\`aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-900/30 hover:text-blue-900 hover:bg-blue-50/50 transition-all cursor-pointer \${uploading && uploadType === 'additionalImages' ? 'opacity-50 cursor-not-allowed' : ''}\`}>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'additionalImages')}
                                disabled={uploading}
                              />
                              {uploading && uploadType === 'additionalImages' ? (
                                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                              ) : (
                                <Plus className="w-6 h-6 mb-2" />
                              )}
                              <span className="text-xs font-medium">Ajouter</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>`;

  code = code.replace(videoSection, imagesSection);

  // Remove the preview wrapper and all its contents
  // The preview wrapper starts with `<div className={\`hidden lg:block w-[400px]`
  // and ends before `</motion.div>`
  
  let previewRegex = /<div className=\{\`hidden lg:block w-\[400px\][\s\S]*?(?=<\/motion\.div>)/;
  code = code.replace(previewRegex, "");

  fs.writeFileSync('src/components/admin/NewsManagement.tsx', code);
}

rewriteEvent();
rewriteNews();
console.log("Done");
