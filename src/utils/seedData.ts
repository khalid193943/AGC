import { collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';

export const seedSchoolData = async () => {
  try {
    const batch = writeBatch(db);

    // 1. Clear existing data (optional, but good for a clean slate)
    const collectionsToClear = ['sections', 'classes', 'subjects', 'rooms', 'teachers', 'timetable_config'];
    for (const colName of collectionsToClear) {
      const snapshot = await getDocs(collection(db, colName));
      snapshot.docs.forEach(d => {
        batch.delete(d.ref);
      });
    }

    // Commit deletions first
    await batch.commit();

    const newBatch = writeBatch(db);

    // 2. Create Sections
    const sectionsData = [
      { name: 'Maternelle', description: 'Préscolaire' },
      { name: 'Primaire', description: 'Enseignement primaire' },
      { name: 'Collège', description: 'Enseignement secondaire collégial' },
      { name: 'Lycée', description: 'Enseignement secondaire qualifiant' }
    ];
    
    const sectionRefs: Record<string, string> = {};
    for (const s of sectionsData) {
      const ref = doc(collection(db, 'sections'));
      newBatch.set(ref, s);
      sectionRefs[s.name] = ref.id;
    }

    // 3. Create Classes
    const classesData = [
      // Maternelle
      { name: 'Petite Section (PS)', sectionId: sectionRefs['Maternelle'] },
      { name: 'Moyenne Section (MS)', sectionId: sectionRefs['Maternelle'] },
      { name: 'Grande Section (GS)', sectionId: sectionRefs['Maternelle'] },
      // Primaire
      { name: 'CP', sectionId: sectionRefs['Primaire'] },
      { name: 'CE1', sectionId: sectionRefs['Primaire'] },
      { name: 'CE2', sectionId: sectionRefs['Primaire'] },
      { name: 'CM1', sectionId: sectionRefs['Primaire'] },
      { name: 'CM2', sectionId: sectionRefs['Primaire'] },
      { name: '6APG', sectionId: sectionRefs['Primaire'] },
      // Collège
      { name: '1AC', sectionId: sectionRefs['Collège'] },
      { name: '2AC', sectionId: sectionRefs['Collège'] },
      { name: '3AC', sectionId: sectionRefs['Collège'] },
      // Lycée
      { name: 'Tronc Commun (TC)', sectionId: sectionRefs['Lycée'] },
      { name: '1Bac', sectionId: sectionRefs['Lycée'] },
      { name: '2Bac', sectionId: sectionRefs['Lycée'] },
    ];

    const classRefs: Record<string, string> = {};
    for (const c of classesData) {
      const ref = doc(collection(db, 'classes'));
      newBatch.set(ref, c);
      classRefs[c.name] = ref.id;
    }

    // 4. Create Subjects
    const subjectsData = [
      // Collège (keeping some for 1AC, 2AC)
      { name: 'Mathématiques (1AC)', classId: classRefs['1AC'], weeklyHours: 5 },
      { name: 'Langue Arabe (1AC)', classId: classRefs['1AC'], weeklyHours: 4 },
      { name: 'Langue Française (1AC)', classId: classRefs['1AC'], weeklyHours: 4 },
      { name: 'Mathématiques (2AC)', classId: classRefs['2AC'], weeklyHours: 5 },
      { name: 'Langue Arabe (2AC)', classId: classRefs['2AC'], weeklyHours: 4 },
      { name: 'Langue Française (2AC)', classId: classRefs['2AC'], weeklyHours: 4 },
      
      // Tronc Commun (TC)
      { name: 'Arabe (TC)', classId: classRefs['Tronc Commun (TC)'], weeklyHours: 4 },
      { name: 'Français (TC)', classId: classRefs['Tronc Commun (TC)'], weeklyHours: 4 },
      { name: 'Anglais (TC)', classId: classRefs['Tronc Commun (TC)'], weeklyHours: 2 },
      { name: 'Mathématiques (TC)', classId: classRefs['Tronc Commun (TC)'], weeklyHours: 6 },
      { name: 'Physique-Chimie (TC)', classId: classRefs['Tronc Commun (TC)'], weeklyHours: 4, requiredRoomType: 'lab' },
      { name: 'SVT (TC)', classId: classRefs['Tronc Commun (TC)'], weeklyHours: 2, requiredRoomType: 'lab' },
      { name: 'Histoire-Géo (TC)', classId: classRefs['Tronc Commun (TC)'], weeklyHours: 2 },
      { name: 'Éducation Islamique (TC)', classId: classRefs['Tronc Commun (TC)'], weeklyHours: 2 },
      { name: 'Philosophie (TC)', classId: classRefs['Tronc Commun (TC)'], weeklyHours: 2 },
      { name: 'Sport (TC)', classId: classRefs['Tronc Commun (TC)'], weeklyHours: 2, requiredRoomType: 'sport' },
      { name: 'Informatique (TC)', classId: classRefs['Tronc Commun (TC)'], weeklyHours: 2, requiredRoomType: 'computer' },

      // 1BAC
      { name: 'Mathématiques (1Bac)', classId: classRefs['1Bac'], weeklyHours: 20 },
      { name: 'Physique-Chimie (1Bac)', classId: classRefs['1Bac'], weeklyHours: 5, requiredRoomType: 'lab' },
      { name: 'SVT (1Bac)', classId: classRefs['1Bac'], weeklyHours: 2, requiredRoomType: 'lab' },
      { name: 'Français (1Bac)', classId: classRefs['1Bac'], weeklyHours: 3 },
      { name: 'Anglais (1Bac)', classId: classRefs['1Bac'], weeklyHours: 2 },
      { name: 'Arabe (1Bac)', classId: classRefs['1Bac'], weeklyHours: 2 },
      { name: 'Histoire-Géo (1Bac)', classId: classRefs['1Bac'], weeklyHours: 2 },
      { name: 'Éducation Islamique (1Bac)', classId: classRefs['1Bac'], weeklyHours: 1 },
      { name: 'Sport (1Bac)', classId: classRefs['1Bac'], weeklyHours: 2, requiredRoomType: 'sport' },
      { name: 'Informatique (1Bac)', classId: classRefs['1Bac'], weeklyHours: 2, requiredRoomType: 'computer' },

      // 2BAC
      { name: 'Mathématiques (2Bac)', classId: classRefs['2Bac'], weeklyHours: 14 },
      { name: 'Physique-Chimie (2Bac)', classId: classRefs['2Bac'], weeklyHours: 7, requiredRoomType: 'lab' },
      { name: 'Philosophie (2Bac)', classId: classRefs['2Bac'], weeklyHours: 2 },
      { name: 'Français (2Bac)', classId: classRefs['2Bac'], weeklyHours: 2 },
      { name: 'Anglais (2Bac)', classId: classRefs['2Bac'], weeklyHours: 2 },
      { name: 'Arabe (2Bac)', classId: classRefs['2Bac'], weeklyHours: 2 },
      { name: 'Sport (2Bac)', classId: classRefs['2Bac'], weeklyHours: 2, requiredRoomType: 'sport' },
      { name: 'Informatique (2Bac)', classId: classRefs['2Bac'], weeklyHours: 2, requiredRoomType: 'computer' },
    ];

    const subjectRefs: Record<string, string> = {};
    for (const sub of subjectsData) {
      const ref = doc(collection(db, 'subjects'));
      newBatch.set(ref, sub);
      subjectRefs[sub.name] = ref.id;
    }

    // 5. Create Rooms
    const roomsData = [
      { name: 'Salle 1', type: 'standard', capacity: 30, classId: classRefs['1AC'] },
      { name: 'Salle 2', type: 'standard', capacity: 30, classId: classRefs['2AC'] },
      { name: 'Salle 3', type: 'standard', capacity: 30, classId: classRefs['3AC'] },
      { name: 'Salle 4', type: 'standard', capacity: 30, classId: classRefs['CP'] },
      { name: 'Labo SVT 1', type: 'lab', capacity: 24 },
      { name: 'Labo PC 1', type: 'lab', capacity: 24 },
      { name: 'Terrain de Sport', type: 'sport', capacity: 60 },
      { name: 'Salle Informatique', type: 'computer', capacity: 20 },
    ];

    for (const r of roomsData) {
      const ref = doc(collection(db, 'rooms'));
      newBatch.set(ref, r);
    }

    // 6. Create Teachers
    const teachersData = [
      { name: 'M. Ahmed (Maths)', email: 'ahmed@ecole.com', subjectIds: [subjectRefs['Mathématiques']], maxWorkload: 24, availability: {} },
      { name: 'Mme. Fatima (Arabe)', email: 'fatima@ecole.com', subjectIds: [subjectRefs['Langue Arabe']], maxWorkload: 24, availability: {} },
      { name: 'M. Karim (Français)', email: 'karim@ecole.com', subjectIds: [subjectRefs['Langue Française']], maxWorkload: 24, availability: {} },
      { name: 'Mme. Sara (SVT)', email: 'sara@ecole.com', subjectIds: [subjectRefs['SVT']], maxWorkload: 24, availability: {} },
      { name: 'M. Youssef (PC)', email: 'youssef@ecole.com', subjectIds: [subjectRefs['Physique-Chimie']], maxWorkload: 24, availability: {} },
      { name: 'M. Hassan (EPS)', email: 'hassan@ecole.com', subjectIds: [subjectRefs['EPS']], maxWorkload: 24, availability: {} },
    ];

    for (const t of teachersData) {
      const ref = doc(collection(db, 'teachers'));
      newBatch.set(ref, t);
    }

    // 7. Create Timetable Config
    const configRef = doc(db, 'timetable_config', 'global');
    newBatch.set(configRef, {
      workingDays: [0, 1, 2, 3, 4], // Lundi au Vendredi
      timeSlots: [
        { start: '08:30', end: '10:30' },
        { start: '10:45', end: '12:30' },
        { start: '13:30', end: '16:30' }
      ],
      dayOverrides: {}
    });

    await newBatch.commit();
    return true;
  } catch (error) {
    console.error("Error seeding data:", error);
    return false;
  }
};
