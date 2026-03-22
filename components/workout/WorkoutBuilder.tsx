"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createClient } from "@/lib/supabase/client";
import { GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { Exercise } from "@/lib/types/database.types";
import { muscleGroupLabel } from "@/lib/utils";

interface WorkoutExerciseRow {
  id: string;
  exercise_id: string;
  sets: number;
  reps: number | null;
  duration_seconds: number | null;
  weight_kg: number | null;
  rest_seconds: number;
}

interface Props {
  exercises: Pick<Exercise, "id" | "name" | "muscle_group" | "equipment">[];
  userId: string;
}

function SortableRow({
  row, exercises, onChange, onRemove,
}: {
  row: WorkoutExerciseRow;
  exercises: Props["exercises"];
  onChange: (id: string, field: string, value: unknown) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const ex = exercises.find((e) => e.id === row.exercise_id);

  const inputCls = "w-full px-2 py-1.5 text-sm outline-none text-center";
  const inputSt = { fontFamily: "var(--font-bebas)", fontSize: "18px", color: "var(--text-primary)", background: "var(--bg-deep)", border: "1px solid var(--border)" };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 py-3 border-b" {...{}}>
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex-shrink-0" style={{ color: "var(--text-faint)", touchAction: "none" }}>
        <GripVertical size={16} />
      </button>

      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: "var(--font-bebas)", fontSize: "17px", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
          {ex?.name ?? "—"}
        </p>
        {ex?.muscle_group && (
          <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}>
            {muscleGroupLabel(ex.muscle_group)}
          </p>
        )}
      </div>

      {/* Sets */}
      <div className="text-center" style={{ width: 44 }}>
        <p className="text-xs mb-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase" }}>Sets</p>
        <input type="number" min={1} max={20} value={row.sets} onChange={(e) => onChange(row.id, "sets", +e.target.value)} className={inputCls} style={inputSt} />
      </div>

      {/* Reps */}
      <div className="text-center" style={{ width: 52 }}>
        <p className="text-xs mb-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase" }}>Reps</p>
        <input type="number" min={1} max={100} value={row.reps ?? ""} placeholder="—" onChange={(e) => onChange(row.id, "reps", e.target.value ? +e.target.value : null)} className={inputCls} style={inputSt} />
      </div>

      {/* Weight */}
      <div className="text-center hidden sm:block" style={{ width: 56 }}>
        <p className="text-xs mb-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase" }}>Poids</p>
        <input type="number" min={0} step={0.5} value={row.weight_kg ?? ""} placeholder="—" onChange={(e) => onChange(row.id, "weight_kg", e.target.value ? +e.target.value : null)} className={inputCls} style={inputSt} />
      </div>

      {/* Rest */}
      <div className="text-center hidden sm:block" style={{ width: 52 }}>
        <p className="text-xs mb-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase" }}>Repos</p>
        <input type="number" min={0} max={600} step={15} value={row.rest_seconds} onChange={(e) => onChange(row.id, "rest_seconds", +e.target.value)} className={inputCls} style={inputSt} />
      </div>

      <button onClick={() => onRemove(row.id)} className="flex-shrink-0 p-1 transition-colors" style={{ color: "var(--text-faint)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}>
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function WorkoutBuilder({ exercises, userId }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState<"routine" | "challenge">("routine");
  const [isPublic, setIsPublic] = useState(false);
  const [duration, setDuration] = useState<number | "">("");
  const [rows, setRows] = useState<WorkoutExerciseRow[]>([]);
  const [search, setSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredExercises = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    (e.muscle_group ?? "").toLowerCase().includes(search.toLowerCase())
  );

  function addExercise(ex: Props["exercises"][0]) {
    setRows((prev) => [...prev, {
      id: crypto.randomUUID(),
      exercise_id: ex.id,
      sets: 3, reps: 10, duration_seconds: null, weight_kg: null, rest_seconds: 60,
    }]);
    setShowPicker(false);
    setSearch("");
  }

  function updateRow(id: string, field: string, value: unknown) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setRows((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  async function handleSave() {
    if (!title.trim()) { setError("Le titre est requis."); return; }
    if (rows.length === 0) { setError("Ajoute au moins un exercice."); return; }
    setSaving(true);
    setError(null);
    const supabase = createClient();

    const { data: workout, error: wErr } = await supabase
      .from("workouts")
      .insert({ title: title.trim(), description: description.trim() || null, format, is_public: isPublic, created_by: userId, duration_estimate: duration || null })
      .select("id")
      .single();

    if (wErr || !workout) { setError("Erreur lors de la sauvegarde."); setSaving(false); return; }

    const weRows = rows.map((r, i) => ({
      workout_id: workout.id, exercise_id: r.exercise_id, order_index: i,
      sets: r.sets, reps: r.reps, duration_seconds: r.duration_seconds,
      weight_kg: r.weight_kg, rest_seconds: r.rest_seconds,
    }));

    await supabase.from("workout_exercises").insert(weRows);
    router.push(`/workouts/${workout.id}`);
    router.refresh();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8" style={{ fontFamily: "var(--font-bebas)", fontSize: "clamp(36px, 5vw, 52px)", color: "var(--text-primary)", letterSpacing: "0.02em" }}>
        Nouveau Workout
      </h1>

      {/* Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-5 border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
        <div className="sm:col-span-2 flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-muted)" }}>Titre *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Push Day A" className="px-4 py-2.5 text-sm outline-none" style={{ fontFamily: "var(--font-bebas)", fontSize: "20px", color: "var(--text-primary)", background: "var(--bg-raised)", border: "1px solid var(--border)", letterSpacing: "0.02em" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--text-faint)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-muted)" }}>Format</label>
          <div className="grid grid-cols-2 gap-2">
            {(["routine", "challenge"] as const).map((f) => (
              <button key={f} onClick={() => setFormat(f)} className="py-2 text-xs uppercase tracking-widest transition-all" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, background: format === f ? "var(--accent)" : "var(--bg-raised)", color: format === f ? "#fff" : "var(--text-muted)", border: format === f ? "1px solid var(--accent)" : "1px solid var(--border)" }}>
                {f === "routine" ? "Routine" : "Challenge"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-muted)" }}>Durée estimée (min)</label>
          <input type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value ? +e.target.value : "")} placeholder="45" className="px-4 py-2.5 text-sm outline-none" style={{ fontFamily: "var(--font-inter)", color: "var(--text-primary)", background: "var(--bg-raised)", border: "1px solid var(--border)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--text-faint)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
        </div>

        <div className="sm:col-span-2 flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-muted)" }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Optionnel…" className="px-4 py-2.5 text-sm outline-none resize-none" style={{ fontFamily: "var(--font-inter)", color: "var(--text-primary)", background: "var(--bg-raised)", border: "1px solid var(--border)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--text-faint)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
        </div>

        <div className="sm:col-span-2 flex items-center gap-3">
          <button onClick={() => setIsPublic(!isPublic)} className="w-10 h-5 relative flex-shrink-0 transition-colors" style={{ background: isPublic ? "var(--accent)" : "var(--bg-raised)", border: "1px solid var(--border)" }} aria-label="Toggle public">
            <span className="absolute top-0.5 w-4 h-4 transition-all" style={{ background: "#fff", left: isPublic ? "calc(100% - 18px)" : "2px" }} />
          </button>
          <span className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}>
            Visible dans Explorer (coachs uniquement)
          </span>
        </div>
      </div>

      {/* Exercise list */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontFamily: "var(--font-bebas)", fontSize: "22px", color: "var(--text-primary)", letterSpacing: "0.03em" }}>
            Exercices {rows.length > 0 && `(${rows.length})`}
          </h2>
          <button onClick={() => setShowPicker(!showPicker)} className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, background: "var(--accent)", color: "#fff" }}>
            <Plus size={13} /> Ajouter
          </button>
        </div>

        {/* Exercise picker */}
        {showPicker && (
          <div className="mb-4 border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Chercher un exercice…" autoFocus className="w-full px-3 py-2 text-sm outline-none" style={{ fontFamily: "var(--font-inter)", color: "var(--text-primary)", background: "var(--bg-raised)", border: "1px solid var(--border)" }} />
            </div>
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              {filteredExercises.slice(0, 40).map((ex) => (
                <button key={ex.id} onClick={() => addExercise(ex)} className="w-full flex items-center justify-between px-4 py-3 text-left border-b transition-colors" style={{ borderColor: "var(--border)", background: "transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-raised)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <span style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", color: "var(--text-primary)", letterSpacing: "0.02em" }}>{ex.name}</span>
                  <span className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-muted)" }}>{muscleGroupLabel(ex.muscle_group)}</span>
                </button>
              ))}
              {filteredExercises.length === 0 && (
                <p className="px-4 py-6 text-sm text-center" style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)" }}>Aucun exercice trouvé.</p>
              )}
            </div>
          </div>
        )}

        {/* Sortable rows */}
        {rows.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
              <div className="border" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
                {/* Header */}
                <div className="flex items-center gap-2 px-2 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                  <div style={{ width: 20 }} />
                  <div className="flex-1" />
                  {["Sets", "Reps", "Poids", "Repos"].map((h, i) => (
                    <span key={h} className={`text-xs uppercase text-center ${i >= 2 ? "hidden sm:block" : ""}`} style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, color: "var(--text-faint)", width: i === 0 ? 44 : i === 1 ? 52 : i === 2 ? 56 : 52 }}>
                      {h}
                    </span>
                  ))}
                  <div style={{ width: 30 }} />
                </div>
                <div className="px-3">
                  {rows.map((row) => (
                    <SortableRow key={row.id} row={row} exercises={exercises} onChange={updateRow} onRemove={removeRow} />
                  ))}
                </div>
              </div>
            </SortableContext>
          </DndContext>
        )}

        {rows.length === 0 && !showPicker && (
          <div className="py-12 text-center border" style={{ borderColor: "var(--border)", borderStyle: "dashed", background: "var(--bg-surface)" }}>
            <p className="text-sm" style={{ fontFamily: "var(--font-inter)", color: "var(--text-faint)" }}>Clique sur «&nbsp;Ajouter&nbsp;» pour choisir tes exercices.</p>
          </div>
        )}
      </div>

      {error && (
        <p className="mb-4 px-4 py-2 text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--accent)", background: "rgba(200,16,46,0.08)", border: "1px solid rgba(200,16,46,0.2)" }}>
          {error}
        </p>
      )}

      <button onClick={handleSave} disabled={saving} className="w-full py-3.5 text-sm uppercase tracking-widest transition-opacity disabled:opacity-50" style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, background: "var(--accent)", color: "#fff", letterSpacing: "0.08em" }}>
        {saving ? "Sauvegarde…" : "Enregistrer le workout"}
      </button>
    </div>
  );
}
