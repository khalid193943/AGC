import fs from 'fs';

let eventContent = fs.readFileSync('src/components/admin/EventManagement.tsx', 'utf-8');
eventContent = eventContent.replace(/>"Vidéo \(Optionnel\)"</g, '>Vidéo (Optionnel)<');
eventContent = eventContent.replace(/>"Heure"</g, '>Heure<');
eventContent = eventContent.replace(/>"Image de couverture"</g, '>Image de couverture<');
eventContent = eventContent.replace(/>"Média Vidéo"</g, '>Média Vidéo<');
eventContent = eventContent.replace(/>"Aperçu"</g, '>Aperçu<');
eventContent = eventContent.replace(/>"Édition d'événement"</g, ">Édition d'événement<");
eventContent = eventContent.replace(/placeholder="Détails de l'événement..."/g, "placeholder='Détails de l\\'événement...'");
eventContent = eventContent.replace(/placeholder="Ex: 09:00"/g, "placeholder='Ex: 09:00'");
eventContent = eventContent.replace(/placeholder="https:\/\/\.\.\."/g, "placeholder='https://...'");
eventContent = eventContent.replace(/placeholder="https:\/\/youtube\.\.\."/g, "placeholder='https://youtube...'");


fs.writeFileSync('src/components/admin/EventManagement.tsx', eventContent);

let newsContent = fs.readFileSync('src/components/admin/NewsManagement.tsx', 'utf-8');
newsContent = newsContent.replace(/>"Vidéo \(Optionnel\)"</g, '>Vidéo (Optionnel)<');
newsContent = newsContent.replace(/>"Image de couverture"</g, '>Image de couverture<');
newsContent = newsContent.replace(/>"Média Vidéo"</g, '>Média Vidéo<');
newsContent = newsContent.replace(/>"Aperçu"</g, '>Aperçu<');
newsContent = newsContent.replace(/>"Édition d'actualité"</g, ">Édition d'actualité<");
newsContent = newsContent.replace(/placeholder="Détails de l'actualité..."/g, "placeholder='Détails de l\\'actualité...'");
newsContent = newsContent.replace(/placeholder="https:\/\/\.\.\."/g, "placeholder='https://...'");
newsContent = newsContent.replace(/placeholder="https:\/\/youtube\.\.\."/g, "placeholder='https://youtube...'");

fs.writeFileSync('src/components/admin/NewsManagement.tsx', newsContent);
