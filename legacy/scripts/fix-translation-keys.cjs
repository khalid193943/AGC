const fs = require('fs');

let content = fs.readFileSync('src/components/admin/EventManagement.tsx', 'utf-8');

content = content.replace(/\{t\.admin\.events\.eventTitle\}/g, '{t.admin.events.titleLabel}');
content = content.replace(/t\.admin\.events\.eventTitle/g, 't.admin.events.titleLabel');

content = content.replace(/\{t\.admin\.events\.timeLabel\}/g, '"Heure"');
content = content.replace(/t\.admin\.events\.timePlaceholder/g, '"Ex: 09:00"');
content = content.replace(/\{t\.admin\.events\.imageLabel \|\| "Image de couverture"\}/g, '"Image de couverture"');
content = content.replace(/\{t\.admin\.events\.imageLabel\}/g, '"Image de couverture"');
content = content.replace(/t\.admin\.events\.imageUrlPlaceholder/g, '"https://..."');
content = content.replace(/\{t\.admin\.events\.videoOptional\}/g, '"Vidéo (Optionnel)"');
content = content.replace(/t\.admin\.events\.videoUrlPlaceholder/g, '"https://youtube..."');
content = content.replace(/\{t\.admin\.events\.detailedDescription\}/g, '{t.admin.events.descLabel}');
content = content.replace(/t\.admin\.events\.descriptionPlaceholder/g, '"Détails de l\'événement..."');
content = content.replace(/\{t\.admin\.events\.publishEvent\}/g, '{t.admin.events.saveBtn}');
content = content.replace(/\{t\.admin\.events\.livePreview\}/g, '"Aperçu"');
content = content.replace(/\{t\.admin\.events\.eventEdition\}/g, '"Édition d\'événement"');
content = content.replace(/\{t\.admin\.events\.newEvent\}/g, '{t.admin.events.addBtn}');
content = content.replace(/\{t\.admin\.events\.editEvent\}/g, '{t.admin.events.editBtn}');
content = content.replace(/\{t\.admin\.events\.videoMedia\}/g, '"Média Vidéo"');
content = content.replace(/\{t\.admin\.events\.tryAdjustSearch\}/g, '"Essayez de modifier votre recherche"');

fs.writeFileSync('src/components/admin/EventManagement.tsx', content);

let newsContent = fs.readFileSync('src/components/admin/NewsManagement.tsx', 'utf-8');

newsContent = newsContent.replace(/\{t\.admin\.news\.newsTitle\}/g, '{t.admin.news.titleLabel}');
newsContent = newsContent.replace(/t\.admin\.news\.newsTitle/g, 't.admin.news.titleLabel');

newsContent = newsContent.replace(/\{t\.admin\.news\.publishDate\}/g, '{t.admin.news.dateLabel}');
newsContent = newsContent.replace(/\{t\.admin\.news\.categoryLabel\}/g, '{t.admin.news.categoryLabel}');

newsContent = newsContent.replace(/\{t\.admin\.news\.imageLabel \|\| "Image de couverture"\}/g, '{t.admin.news.imageLabel || "Image"}');
newsContent = newsContent.replace(/t\.admin\.news\.imageUrlPlaceholder/g, '"https://..."');
newsContent = newsContent.replace(/\{t\.admin\.news\.videoOptional\}/g, '"Vidéo (Optionnel)"');
newsContent = newsContent.replace(/t\.admin\.news\.videoUrlPlaceholder/g, '"https://youtube..."');
newsContent = newsContent.replace(/\{t\.admin\.news\.detailedContent\}/g, '{t.admin.news.contentLabel}');
newsContent = newsContent.replace(/t\.admin\.news\.contentPlaceholder/g, '"Détails de l\'actualité..."');
newsContent = newsContent.replace(/\{t\.admin\.news\.publishNews\}/g, '{t.admin.news.saveBtn}');
newsContent = newsContent.replace(/\{t\.admin\.news\.livePreview\}/g, '"Aperçu"');
newsContent = newsContent.replace(/\{t\.admin\.news\.contentEditing\}/g, '"Édition d\'actualité"');
newsContent = newsContent.replace(/\{t\.admin\.news\.newNews\}/g, '{t.admin.news.addBtn}');
newsContent = newsContent.replace(/\{t\.admin\.news\.editNews\}/g, '{t.admin.news.editBtn}');
newsContent = newsContent.replace(/\{t\.admin\.news\.videoMedia\}/g, '"Média Vidéo"');
newsContent = newsContent.replace(/\{t\.admin\.news\.tryAdjustSearch\}/g, '"Essayez de modifier votre recherche"');
newsContent = newsContent.replace(/\{t\.admin\.news\.setFeatured\}/g, '{t.admin.news.featured}');

fs.writeFileSync('src/components/admin/NewsManagement.tsx', newsContent);
