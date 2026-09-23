/**
 * Questions fréquentes — source unique pour l'accueil, la page Inscription
 * et les données structurées FAQPage (SEO / moteurs de réponse).
 * Les réponses restent factuelles : uniquement des informations confirmées par l'école.
 */
import type { Lang } from './site';

export interface FaqItem { q: string; a: string; home?: boolean }

export const FAQ: Record<Lang, FaqItem[]> = {
  FR: [
    { home: true, q: 'Quelles sont les modalités d’inscription ?', a: 'La demande se fait en ligne depuis la page Inscription ou directement au secrétariat, à Sidi Bouzid. Un entretien avec la famille et un test de niveau sont organisés pour les nouveaux élèves, puis le dossier est finalisé sur place.' },
    { home: true, q: 'Quels niveaux l’école accueille-t-elle ?', a: 'Georges Claude Private Academy accueille les élèves de la maternelle (dès 3 ans) au baccalauréat : maternelle, primaire, collège et lycée, dans un seul et même établissement.' },
    { home: true, q: 'L’école est-elle homologuée ?', a: 'Oui. L’académie est homologuée par le Ministère de l’Éducation Nationale et prépare aux examens nationaux (Brevet/BEM et Baccalauréat). Elle intègre progressivement le programme international Cambridge.' },
    { home: true, q: 'Quels sont les horaires de l’école ?', a: 'Les cours ont lieu du lundi au vendredi de 8h00 à 12h00, puis de 12h30 à 15h30, avec une pause déjeuner de 30 minutes. Les activités parascolaires sont organisées selon le planning communiqué en début d’année.' },
    { home: true, q: 'Proposez-vous un transport scolaire ?', a: 'Oui. Une flotte de bus dessert El Jadida et ses environs : Sidi Bouzid, Haouzia et les quartiers voisins. Les circuits sont communiqués à l’inscription.' },
    { home: true, q: 'Quelles langues sont enseignées ?', a: 'L’enseignement est trilingue : arabe, français et anglais, avec une immersion en anglais dès la maternelle et une préparation aux certifications Cambridge.' },
    { q: 'Y a-t-il une cantine ?', a: 'Oui. La cantine sert des repas préparés sur place avec des produits frais, sous contrôle HACCP, avec des menus équilibrés adaptés à chaque âge.' },
    { q: 'Combien d’élèves par classe ?', a: 'Les classes sont limitées à 25 élèves afin de garantir un suivi individualisé et une véritable attention à chaque enfant.' },
    { q: 'Quels sont les résultats aux examens ?', a: 'Pour l’année 2025-2026, l’académie affiche 100 % de réussite au Baccalauréat et au Brevet (BEM), avec des mentions très bien au baccalauréat.' },
    { q: 'Quelles activités parascolaires sont proposées ?', a: 'Plus de quinze activités hebdomadaires : sports de compétition, natation, arts plastiques, théâtre, robotique et coding (drones, impression 3D, robots), échecs, arts martiaux, intelligence artificielle, entre autres.' },
    { q: 'Peut-on inscrire un enfant en cours d’année ?', a: 'Oui, dans la limite des places disponibles. Contactez le secrétariat : un entretien et un test de niveau permettent d’intégrer l’élève au bon niveau.' },
    { q: 'Où se trouve l’école ?', a: 'À Sidi Bouzid, sur la route de Casablanca, à El Jadida (24005). L’établissement est accessible en voiture et par le transport scolaire ; l’itinéraire est disponible sur Google Maps depuis la page Contact.' },
    { q: 'Comment visiter le campus ?', a: 'Les visites se font sur rendez-vous, du lundi au vendredi. Appelez le +212 5233-48010, écrivez à contact@agc.ma ou utilisez le formulaire de la page Contact.' },
    { q: 'Quelles pièces composent le dossier d’inscription ?', a: 'Le formulaire d’inscription rempli, une copie de l’acte de naissance, les bulletins des deux dernières années, le certificat de scolarité de l’établissement précédent, quatre photos d’identité et une copie de la carte d’identité des parents.' },
  ],
  EN: [
    { home: true, q: 'How do I enrol my child?', a: 'Apply online from the Enrolment page or directly at the school office in Sidi Bouzid. New students take a placement test and families meet the team, then the file is completed on site.' },
    { home: true, q: 'Which levels does the school offer?', a: 'Georges Claude Private Academy welcomes students from preschool (age 3) to the baccalaureate: preschool, primary, middle and high school, all in one establishment.' },
    { home: true, q: 'Is the school accredited?', a: 'Yes. The academy is accredited by the Ministry of National Education and prepares students for the national exams (middle-school certificate and Baccalaureate). It is progressively integrating the Cambridge international programme.' },
    { home: true, q: 'What are the school hours?', a: 'Classes run Monday to Friday from 8:00 to 12:00 and from 12:30 to 15:30, with a 30-minute lunch break. Extracurricular activities follow the schedule shared at the start of the year.' },
    { home: true, q: 'Is there school transport?', a: 'Yes. A fleet of buses serves El Jadida and its surroundings: Sidi Bouzid, Haouzia and nearby neighbourhoods. Routes are shared at enrolment.' },
    { home: true, q: 'Which languages are taught?', a: 'Teaching is trilingual: Arabic, French and English, with English immersion from preschool and preparation for Cambridge certifications.' },
    { q: 'Is there a canteen?', a: 'Yes. The canteen serves meals prepared on site with fresh produce under HACCP control, with balanced menus adapted to each age.' },
    { q: 'How many students per class?', a: 'Classes are limited to 25 students to guarantee individual follow-up and real attention to every child.' },
    { q: 'What are the exam results?', a: 'For 2025-2026 the academy achieved a 100% pass rate at the Baccalaureate and the middle-school certificate, with highest honours at the baccalaureate.' },
    { q: 'Which extracurricular activities are offered?', a: 'More than fifteen weekly activities: competitive sports, swimming, visual arts, theatre, robotics and coding (drones, 3D printing, robots), chess, martial arts and artificial intelligence, among others.' },
    { q: 'Can a child join during the school year?', a: 'Yes, subject to available places. Contact the office: an interview and a placement test allow the student to join at the right level.' },
    { q: 'Where is the school?', a: 'In Sidi Bouzid, on the Casablanca road, El Jadida (24005). The school is reachable by car and by school transport; directions are available on Google Maps from the Contact page.' },
    { q: 'How can I visit the campus?', a: 'Visits are by appointment, Monday to Friday. Call +212 5233-48010, write to contact@agc.ma or use the form on the Contact page.' },
    { q: 'What documents are required to enrol?', a: 'The completed enrolment form, a copy of the birth certificate, school reports for the last two years, the attendance certificate from the previous school, four ID photos and a copy of the parents’ ID card.' },
  ],
};
