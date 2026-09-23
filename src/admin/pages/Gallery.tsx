import { useRef, useState } from 'react';
import { Plus, Trash2, Play, Loader2, Film } from 'lucide-react';
import { useCollection, create, patch, remove, compressImage, uploadVideo } from '../data';
import { PageTitle, Btn, Empty, Tabs, useConfirm, useToast, Drawer, F } from '../ui';

const CATS = ['Vie scolaire', 'Événements', 'Sport', 'Activités', 'Espaces', 'Sorties'];

export default function GalleryPage() {
  const { rows, loading } = useCollection<any>('moments', 'createdAt');
  const [cat, setCat] = useState('all');
  const [busy, setBusy] = useState<string | null>(null);
  const [video, setVideo] = useState(false);
  const [vform, setVform] = useState({ title: '', category: CATS[0], file: null as File | null, progress: 0 });
  const [defaultCat, setDefaultCat] = useState(CATS[0]);
  const input = useRef<HTMLInputElement>(null);
  const { confirm, node } = useConfirm(); const toast = useToast();
  const cats = Array.from(new Set([...CATS, ...rows.map((r) => r.category).filter(Boolean)]));
  const list = cat === 'all' ? rows : rows.filter((r) => r.category === cat);

  const addImages = async (files: FileList | null) => {
    if (!files?.length) return;
    let n = 0;
    for (const f of Array.from(files)) {
      setBusy(`${++n} / ${files.length}`);
      try { await create('moments', { url: await compressImage(f, 1600, 0.8), type: 'image', title: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '), category: defaultCat }); } catch (ex: any) { toast(ex?.message || 'Envoi impossible.', 'err'); }
    }
    setBusy(null); toast(`${files.length} photo${files.length > 1 ? 's' : ''} ajoutée${files.length > 1 ? 's' : ''}.`);
  };
  const addVideo = async () => {
    if (!vform.file) return;
    setBusy('vidéo');
    try { const url = await uploadVideo(vform.file, 'moments', (p) => setVform((v) => ({ ...v, progress: p }))); await create('moments', { url, type: 'video', title: vform.title || vform.file.name, category: vform.category }); toast('Vidéo ajoutée.'); setVideo(false); setVform({ title: '', category: CATS[0], file: null, progress: 0 }); }
    catch (ex: any) { toast('Envoi de la vidéo impossible : ' + (ex?.message || ''), 'err'); } finally { setBusy(null); }
  };
  const del = async (m: any) => { if (await confirm('Supprimer cet élément de la galerie ?')) { await remove('moments', m.id); } };
  const rename = async (m: any, title: string) => { if (title !== m.title) await patch('moments', m.id, { title }); };

  return (
    <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addImages(e.dataTransfer.files); }}>
      <PageTitle title="Galerie" desc="Glissez des photos n’importe où sur cette page pour les ajouter." actions={<>
        <select value={defaultCat} onChange={(e) => setDefaultCat(e.target.value)} className="h-11 rounded-full border border-ink/12 bg-white px-4 text-sm">{cats.map((c) => <option key={c}>{c}</option>)}</select>
        <Btn onClick={() => input.current?.click()} disabled={!!busy}>{busy && busy !== 'vidéo' ? <><Loader2 className="animate-spin" size={16} /> {busy}</> : <><Plus size={16} /> Ajouter des photos</>}</Btn>
        <Btn variant="ghost" onClick={() => setVideo(true)}><Film size={16} /> Vidéo</Btn>
        <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addImages(e.target.files)} />
      </>} />
      <Tabs items={[{ key: 'all', label: 'Tout', count: rows.length }, ...cats.map((c) => ({ key: c, label: c, count: rows.filter((r) => r.category === c).length }))]} value={cat} onChange={setCat} />
      <div className="mt-5">
        {loading ? <p className="text-mute text-sm">Chargement…</p> : list.length === 0 ? <Empty text="La galerie est vide." action={<Btn onClick={() => input.current?.click()}><Plus size={16} /> Ajouter des photos</Btn>} /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {list.map((m) => (
              <figure key={m.id} className="group relative rounded-xl overflow-hidden bg-white border border-ink/10">
                <div className="aspect-square bg-sea/40 relative">
                  {m.type === 'video' ? <video src={m.url} muted className="w-full h-full object-cover" /> : <img src={m.url} alt="" className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />}
                  {m.type === 'video' && <span className="absolute inset-0 flex items-center justify-center"><span className="w-10 h-10 rounded-full bg-white/85 flex items-center justify-center"><Play size={16} /></span></span>}
                  <button onClick={() => del(m)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-logo-red flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Supprimer"><Trash2 size={14} /></button>
                </div>
                <figcaption className="p-2.5">
                  <input defaultValue={m.title || ''} onBlur={(e) => rename(m, e.target.value)} className="w-full text-sm font-medium bg-transparent focus:outline-none focus:bg-salt rounded px-1 -mx-1" placeholder="Titre" />
                  <select value={m.category || ''} onChange={(e) => patch('moments', m.id, { category: e.target.value })} className="w-full text-xs text-mute bg-transparent mt-0.5">{cats.map((c) => <option key={c}>{c}</option>)}</select>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
      <Drawer open={video} onClose={() => setVideo(false)} title="Ajouter une vidéo" footer={<><Btn variant="ghost" onClick={() => setVideo(false)}>Annuler</Btn><Btn onClick={addVideo} disabled={!vform.file || busy === 'vidéo'}>{busy === 'vidéo' ? `Envoi… ${vform.progress}%` : 'Ajouter'}</Btn></>}>
        <div className="grid gap-5">
          <F label="Titre"><input value={vform.title} onChange={(e) => setVform({ ...vform, title: e.target.value })} /></F>
          <F label="Catégorie"><select value={vform.category} onChange={(e) => setVform({ ...vform, category: e.target.value })}>{cats.map((c) => <option key={c}>{c}</option>)}</select></F>
          <F label="Fichier vidéo (MP4, max ~100 Mo)" hint="Les vidéos sont hébergées sur Firebase Storage."><input type="file" accept="video/*" onChange={(e) => setVform({ ...vform, file: e.target.files?.[0] || null })} /></F>
        </div>
      </Drawer>
      {node}
    </div>
  );
}
