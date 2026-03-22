-- Qudrah — 100 exercices (25 calisthénie + 75 musculation)
-- Supabase → SQL Editor → Coller → Run
-- Supprime d'abord les exos de base insérés par schema.sql pour éviter les doublons

DELETE FROM exercises WHERE is_public = true AND created_by IS NULL;

INSERT INTO exercises (name, muscle_group, equipment, is_public) VALUES

-- ═══════════════════════════════════════════════════════
-- CALISTHÉNIE / POIDS DU CORPS (25 exercices)
-- ═══════════════════════════════════════════════════════

-- Poussée (8)
('Pompes', 'chest', 'bodyweight', true),
('Pompes diamant', 'arms', 'bodyweight', true),
('Pompes larges', 'chest', 'bodyweight', true),
('Pompes déclinées', 'chest', 'bodyweight', true),
('Pompes inclinées', 'chest', 'bodyweight', true),
('Pike push-ups', 'shoulders', 'bodyweight', true),
('Pompes archer', 'chest', 'bodyweight', true),
('Dips entre chaises', 'arms', 'bodyweight', true),

-- Tirage (5)
('Tractions pronation', 'back', 'bodyweight', true),
('Tractions supination', 'back', 'bodyweight', true),
('Tractions neutres', 'back', 'bodyweight', true),
('Tractions australiennes', 'back', 'bodyweight', true),
('Tractions explosives', 'back', 'bodyweight', true),

-- Jambes (5)
('Squats poids du corps', 'legs', 'bodyweight', true),
('Fentes avant alternées', 'legs', 'bodyweight', true),
('Squats sautés', 'legs', 'bodyweight', true),
('Bulgarian split squat', 'legs', 'bodyweight', true),
('Pistol squat assisté', 'legs', 'bodyweight', true),

-- Core (5)
('Gainage planche', 'core', 'bodyweight', true),
('Relevés de jambes suspendu', 'core', 'bodyweight', true),
('Crunch', 'core', 'bodyweight', true),
('Russian twist', 'core', 'bodyweight', true),
('Mountain climbers', 'core', 'bodyweight', true),

-- Full body / Cardio (2)
('Burpees', 'full_body', 'bodyweight', true),
('Bear crawl', 'full_body', 'bodyweight', true),

-- ═══════════════════════════════════════════════════════
-- MUSCULATION (75 exercices)
-- ═══════════════════════════════════════════════════════

-- ── BARRE (22) ──────────────────────────────────────────

-- Pectoraux
('Développé couché barre', 'chest', 'barbell', true),
('Développé incliné barre', 'chest', 'barbell', true),
('Développé décliné barre', 'chest', 'barbell', true),

-- Dos
('Soulevé de terre', 'back', 'barbell', true),
('Soulevé de terre roumain', 'back', 'barbell', true),
('Rowing barre pronation', 'back', 'barbell', true),
('Rowing barre supination', 'back', 'barbell', true),
('Good morning', 'back', 'barbell', true),

-- Jambes
('Squat barre arrière', 'legs', 'barbell', true),
('Squat avant barre', 'legs', 'barbell', true),
('Fentes barre', 'legs', 'barbell', true),
('Hip thrust barre', 'legs', 'barbell', true),
('Jefferson squat', 'legs', 'barbell', true),

-- Épaules
('Développé militaire barre', 'shoulders', 'barbell', true),
('Tirage menton barre', 'shoulders', 'barbell', true),
('Shrugs barre', 'shoulders', 'barbell', true),

-- Bras
('Curl barre droite', 'arms', 'barbell', true),
('Curl barre EZ', 'arms', 'barbell', true),
('Extension triceps barre front squat', 'arms', 'barbell', true),
('Close grip bench press', 'arms', 'barbell', true),
('Skull crushers barre', 'arms', 'barbell', true),

-- Full body
('Épaulé-jeté', 'full_body', 'barbell', true),

-- ── HALTÈRES (21) ───────────────────────────────────────

-- Pectoraux
('Développé couché haltères', 'chest', 'dumbbell', true),
('Développé incliné haltères', 'chest', 'dumbbell', true),
('Écarté couché haltères', 'chest', 'dumbbell', true),
('Pull-over haltère', 'chest', 'dumbbell', true),

-- Dos
('Rowing unilatéral haltère', 'back', 'dumbbell', true),
('Soulevé de terre haltères', 'back', 'dumbbell', true),

-- Jambes
('Squat goblet', 'legs', 'dumbbell', true),
('Fentes haltères marchées', 'legs', 'dumbbell', true),
('Hip thrust haltère', 'legs', 'dumbbell', true),
('Step-up haltères', 'legs', 'dumbbell', true),

-- Épaules
('Développé épaules haltères assis', 'shoulders', 'dumbbell', true),
('Arnold press', 'shoulders', 'dumbbell', true),
('Élévations latérales haltères', 'shoulders', 'dumbbell', true),
('Élévations frontales haltères', 'shoulders', 'dumbbell', true),
('Oiseau haltères', 'shoulders', 'dumbbell', true),

-- Bras
('Curl haltères alternatif', 'arms', 'dumbbell', true),
('Curl marteau haltères', 'arms', 'dumbbell', true),
('Curl incliné haltères', 'arms', 'dumbbell', true),
('Extension triceps unilatérale', 'arms', 'dumbbell', true),
('Kickback triceps haltère', 'arms', 'dumbbell', true),

-- Full body
('Farmer carry haltères', 'full_body', 'dumbbell', true),

-- ── MACHINE (18) ────────────────────────────────────────

-- Pectoraux
('Pec deck machine', 'chest', 'machine', true),
('Chest press machine', 'chest', 'machine', true),

-- Dos
('Tirage vertical machine', 'back', 'machine', true),
('Rowing assis machine', 'back', 'machine', true),
('Back extension machine', 'back', 'machine', true),

-- Jambes
('Presse à cuisses', 'legs', 'machine', true),
('Leg extension', 'legs', 'machine', true),
('Leg curl allongé', 'legs', 'machine', true),
('Leg curl assis', 'legs', 'machine', true),
('Hack squat machine', 'legs', 'machine', true),
('Hip abducteur machine', 'legs', 'machine', true),
('Hip adducteur machine', 'legs', 'machine', true),
('Mollets à la presse', 'legs', 'machine', true),

-- Épaules
('Développé épaules machine', 'shoulders', 'machine', true),
('Élévations latérales machine', 'shoulders', 'machine', true),

-- Bras
('Preacher curl machine', 'arms', 'machine', true),
('Extension triceps machine', 'arms', 'machine', true),

-- Core
('Crunch machine abdos', 'core', 'machine', true),

-- ── CÂBLE / POULIE (14) ─────────────────────────────────

-- Pectoraux
('Croisé poulie haute', 'chest', 'cable', true),
('Croisé poulie basse', 'chest', 'cable', true),
('Fly câble unilatéral', 'chest', 'cable', true),

-- Dos
('Tirage vertical poulie', 'back', 'cable', true),
('Rowing à la poulie basse', 'back', 'cable', true),
('Pull-over câble', 'back', 'cable', true),

-- Épaules
('Face pull câble', 'shoulders', 'cable', true),
('Élévation latérale câble', 'shoulders', 'cable', true),
('Tirage menton câble', 'shoulders', 'cable', true),

-- Bras
('Curl biceps câble barre', 'arms', 'cable', true),
('Curl marteau câble', 'arms', 'cable', true),
('Pushdown triceps corde', 'arms', 'cable', true),
('Extension triceps poulie haute', 'arms', 'cable', true),
('Curl poulie basse', 'arms', 'cable', true);
