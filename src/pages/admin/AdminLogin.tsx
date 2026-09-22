import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, checkAdminStatus } from '../../firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'motion/react';
import { ShieldCheck, AlertCircle, Loader2, User as UserIcon, Lock, RefreshCw, ArrowLeft } from 'lucide-react';
import { ASSETS } from '../../constants';

export default function AdminLogin() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState({ q: '', a: 0 });
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ q: `${n1} + ${n2}`, a: n1 + n2 });
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdmin = await checkAdminStatus(user);
        if (isAdmin) {
          navigate('/admin/dashboard');
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Check Captcha
    if (parseInt(captchaInput) !== captcha.a) {
      setError(t.admin.errorCaptcha);
      generateCaptcha();
      setLoading(false);
      return;
    }

    // 2. Check Credentials (only salma26 or user email is allowed)
    const isSalma = username === 'salma26' && password === 'salma26';
    const isUser = (username === 'khalid.lagouiti@gmail.com' || username === 'admin') && password === 'salma26';
    const isAdminHugo = username === 'adminhugo' && password === 'adminhugo26';
    const isSuperAdminHugo = username === 'hugo' && password === 'hugo2026$$';

    let email = '';
    let foundInFirestore = false;
    let firestoreRole: 'admin' | 'editor' = 'editor';
    let firestorePermissions: string[] = [];

    if (isSalma) {
      email = 'salma26@academie.com';
    } else if (username === 'admin') {
      email = 'admin@academie.com';
    } else if (isAdminHugo) {
      email = 'adminhugo@academie.com';
    } else if (isSuperAdminHugo) {
      email = 'hugo@academie.com';
    } else if (isUser) {
      email = username;
    } else {
      // Check Firestore for custom admin users
      try {
        const q = query(collection(db, 'admin_users'), where('username', '==', username), where('password', '==', password));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          email = userData.email;
          firestoreRole = userData.role || 'editor';
          firestorePermissions = userData.permissions || [];
          foundInFirestore = true;
        }
      } catch (err) {
        console.error("Firestore check error:", err);
      }
    }

    if (!isSalma && !isUser && !isAdminHugo && !isSuperAdminHugo && !foundInFirestore) {
      setError(t.admin.errorCredentials);
      generateCaptcha();
      setLoading(false);
      return;
    }

    // 3. Firebase Auth (using a mapped email)
    const firebasePassword = 'salma26_secure_password'; // Internal secure password

    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, firebasePassword);
      } catch (signInErr: any) {
        // If user doesn't exist, create it (first time only)
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, email, firebasePassword);
          } catch (createErr: any) {
            if (createErr.code === 'auth/email-already-in-use') {
              // This means the password was wrong for an existing user
              throw new Error(t.admin.errorAuth);
            }
            throw createErr;
          }
        } else {
          throw signInErr;
        }
      }

      // Ensure user document exists in 'users' collection for security rules
      if (userCredential.user) {
        try {
          const userDocRef = doc(db, 'users', userCredential.user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            // Determine role
            let role = 'editor';
            let permissions: string[] = [];
            if (isSalma || isAdminHugo || isSuperAdminHugo || username === 'admin' || username === 'khalid.lagouiti@gmail.com') {
              role = 'admin';
            } else if (foundInFirestore) {
              role = firestoreRole;
              permissions = firestorePermissions;
            }

            await setDoc(userDocRef, {
              uid: userCredential.user.uid,
              email: email,
              role: role,
              permissions: permissions
            });
          } else {
             // always update permissions if it's a generic firestore user logging in (to sync latest permission changes)
             if (foundInFirestore) {
                await setDoc(userDocRef, {
                  role: firestoreRole,
                  permissions: firestorePermissions
                }, { merge: true });
             }
          }
        } catch (firestoreErr) {
          console.warn("Could not reach Firestore to setup user roles, skipping for now.", firestoreErr);
          // Don't throw for Firestore errors here, let them login
        }
      }
      
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || t.admin.errorGeneral);
      generateCaptcha();
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url("https://cdn.prod.website-files.com/682f40cedbb46cd6e15b45cb/69c1e202af4328ddcab216c8_Waterside-180423-0184.jpg")' }}
    >
      {/* Overlay to ensure readability */}
      <div className="absolute inset-0 bg-blue-950/20 backdrop-blur-[2px]" />

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-50" />
      </div>

      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all group z-10"
      >
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-all">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="text-sm tracking-wide uppercase">Retour au site</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden relative z-10 border border-slate-100"
      >
        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <img 
                src={ASSETS.logo} 
                alt="Logo" 
                className="w-24 h-24 object-contain relative z-10"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-blue-950 tracking-tight mb-3">{t.admin.title}</h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[240px] mx-auto">{t.admin.loginSubtitle}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t.admin.username}</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-950 focus:bg-white transition-all outline-none"
                  placeholder="login"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t.admin.password}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-950 focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t.admin.captcha} : {captcha.q} = ?</label>
              <div className="flex gap-3">
                <input
                  required
                  type="number"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="flex-grow px-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-950 focus:bg-white transition-all outline-none"
                  placeholder={t.admin.captchaResult}
                />
                <button 
                  type="button"
                  aria-label="Rafraîchir le captcha"
                  onClick={generateCaptcha}
                  className="p-4 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-all"
                >
                  <RefreshCw className="w-6 h-6" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 px-6 bg-blue-950 text-white rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-xl shadow-blue-950/20 active:scale-[0.98]"
            >
              {t.admin.loginBtn}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50">
            <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest leading-loose">
              {t.admin.accessReserved} <br />
              {t.admin.supportContact}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
