import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  Save,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import AuroraBackground from '../components/ui/AuroraBackground';
import GlassCard from '../components/ui/GlassCard';
import WizardProgress from '../components/wizard/WizardProgress';
import StepWho from '../components/wizard/StepWho';
import StepWhen from '../components/wizard/StepWhen';
import StepWhere from '../components/wizard/StepWhere';
import StepHow from '../components/wizard/StepHow';
import ResultsPreview from '../components/wizard/ResultsPreview';
import { useWizardStore, isStepValid, WIZARD_STEPS } from '../stores/wizardStore';
import { previewItinerary, createTrip } from '../lib/tripApi';
import { ApiError } from '../lib/api';
import type { Itinerary } from '../types/trip';

/** The four step bodies, indexed by currentStep. */
const STEP_COMPONENTS = [StepWho, StepWhen, StepWhere, StepHow] as const;

/**
 * The 4-step trip-planning wizard (/plan). Collects a TripBrief across
 * Who → When → Where → How, then either previews an AI itinerary inline
 * (no auth) or saves a tripboard (needs login/DB).
 */
export default function PlanPage() {
  const navigate = useNavigate();

  // Pull the slice of state the page itself needs. Steps read their own slices.
  const state = useWizardStore();
  const { currentStep, next, back, goTo, buildBrief } = state;

  // Compute per-step validity once; drives Next + progress checkmarks.
  const completed = WIZARD_STEPS.map((_, i) => isStepValid(state, i));
  const isLastStep = currentStep === WIZARD_STEPS.length - 1;
  const canAdvance = completed[currentStep];

  // ── Submit state ──────────────────────────────────────────────────────
  const [previewLoading, setPreviewLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const StepBody = STEP_COMPONENTS[currentStep];

  /** Generate an AI preview inline — no auth required. */
  const handlePreview = async () => {
    setError(null);
    setSaveNotice(null);
    setPreviewLoading(true);
    try {
      const result = await previewItinerary(buildBrief());
      setItinerary(result);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `Couldn't generate a preview (${err.status}). ${err.message}`
          : "Couldn't reach the AI engine. Please try again.",
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  /** Save a real tripboard — needs auth/DB. Fails gracefully. */
  const handleSave = async () => {
    setError(null);
    setSaveNotice(null);
    setSaveLoading(true);
    try {
      const trip = await createTrip(buildBrief());
      navigate(`/t/${trip.shareSlug}`);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        setSaveNotice(
          "Saving a tripboard needs you to be signed in. You can still use Generate preview to see your itinerary right now.",
        );
      } else {
        setSaveNotice(
          "Couldn't save your tripboard (the database may be offline). Generate preview still works without saving.",
        );
      }
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <AuroraBackground subtle>
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-aurora-muted transition-colors hover:text-aurora-text"
        >
          <ArrowLeft size={16} /> Back home
        </Link>

        {/* Sticky progress */}
        <WizardProgress currentStep={currentStep} completed={completed} onJump={goTo} />

        <GlassCard className="p-6 sm:p-8">
          {/* Animated step body */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <StepBody />
            </motion.div>
          </AnimatePresence>

          {/* Footer · Back / Next or final actions */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-aurora-line pt-6">
            <button
              type="button"
              onClick={back}
              disabled={currentStep === 0}
              className="btn-glass disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={16} /> Back
            </button>

            {!isLastStep ? (
              <button
                type="button"
                onClick={next}
                disabled={!canAdvance}
                className="btn-aurora disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saveLoading || !canAdvance}
                  className="btn-glass disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saveLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save &amp; open tripboard
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={previewLoading || !canAdvance}
                  className="btn-aurora disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                >
                  {previewLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Generating…
                    </>
                  ) : (
                    <>
                      Generate preview <Sparkles size={15} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Inline notices */}
          {error && (
            <Notice tone="error">
              <AlertCircle size={15} className="mt-px flex-none" />
              {error}
            </Notice>
          )}
          {saveNotice && (
            <Notice tone="info">
              <AlertCircle size={15} className="mt-px flex-none" />
              {saveNotice}
            </Notice>
          )}
        </GlassCard>

        {/* Loading skeleton while the AI thinks */}
        {previewLoading && !itinerary && (
          <div className="mt-8 flex flex-col items-center gap-3 text-center text-aurora-muted">
            <Loader2 size={28} className="animate-spin text-aurora-cyan" />
            <p className="text-sm">Crafting your day-by-day itinerary…</p>
          </div>
        )}

        {/* Results panel */}
        {itinerary && (
          <div className="mt-10">
            <ResultsPreview itinerary={itinerary} currency={state.currency} />
            <div className="mt-6 flex justify-center">
              <button type="button" onClick={handlePreview} disabled={previewLoading} className="btn-glass">
                <RotateCcw size={15} /> Regenerate preview
              </button>
            </div>
          </div>
        )}
      </div>
    </AuroraBackground>
  );
}

function Notice({ tone, children }: { tone: 'error' | 'info'; children: React.ReactNode }) {
  return (
    <div
      className={
        tone === 'error'
          ? 'mt-4 flex items-start gap-2 rounded-2xl border border-aurora-coral/40 bg-aurora-coral/10 px-4 py-3 text-sm text-aurora-coral'
          : 'mt-4 flex items-start gap-2 rounded-2xl border border-aurora-cyan/40 bg-aurora-cyan/10 px-4 py-3 text-sm text-aurora-text'
      }
    >
      {children}
    </div>
  );
}
