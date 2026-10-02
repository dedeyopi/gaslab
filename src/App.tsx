import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import StudentOnboarding from './components/StudentOnboarding';
import Dashboard from './pages/Dashboard';
import Engage from './pages/Engage';
import Explore from './pages/Explore';
import Explain from './pages/Explain';
import Elaborate from './pages/Elaborate';
import Challenge from './pages/Challenge';
import Evaluate from './pages/Evaluate';
import About from './pages/About';
import Certificate from './components/Certificate';
import { useGasLab } from './state/GasLabContext';
import type { SectionId } from './types';

export default function App() {
  const { state, reset, awardBadge, setLastVisitedSection } = useGasLab();

  const [section, setSection] = useState<SectionId>(
    (state.lastVisitedSection as SectionId) || 'dashboard',
  );

  /* ------------------------------ Navigasi ------------------------------- */
  const navigate = (s: SectionId) => {
    setSection(s);
    setLastVisitedSection(s);
    window.scrollTo({ top: 0, behavior: state.reduceMotion ? 'auto' : 'smooth' });
  };

  /* ---------------------- Award badge otomatis --------------------------- */
  useEffect(() => {
    if (
      state.progress.engage &&
      state.progress.explore &&
      state.progress.explain &&
      state.progress.elaborate &&
      state.progress.evaluate
    ) {
      awardBadge('gaslab');
    }
    if (state.progress.explore) awardBadge('explorer');
    if (state.progress.explain) awardBadge('particle');
    if (state.experiments.length >= 3 && state.analysisDone) awardBadge('analyst');
    if (state.calculatorSolved) awardBadge('boyle');
    if (state.challengeScore >= 100) awardBadge('solver');
  }, [state, awardBadge]);

  /* ------------------------ Status semua tahap --------------------------- */
  const allDone =
    state.progress.engage &&
    state.progress.explore &&
    state.progress.explain &&
    state.progress.elaborate &&
    state.progress.evaluate;

  /* --------------------------- Onboarding -------------------------------- */
  // Guard tunggal: bila belum ada siswa, tampilkan onboarding.
  // Tidak ada state `showOnboarding` terpisah — state.student adalah sumber kebenaran.
  if (!state.student) {
    return <StudentOnboarding />;
  }

  /* ------------------------------ Handlers ------------------------------- */
  const handleReset = () => {
    const ok = window.confirm(
      'Semua progress, jawaban, badge, dan data eksperimen akan dihapus. Lanjutkan?',
    );
    if (!ok) return;
    reset(); // state.student menjadi null → onboarding otomatis muncul
    setSection('dashboard');
  };

  const handleChangeStudent = () => {
    const ok = window.confirm(
      'Ganti siswa? Progres saat ini akan dihapus dan kamu akan diminta mengisi identitas baru.',
    );
    if (!ok) return;
    reset(); // state.student menjadi null → onboarding otomatis muncul
  };

  /* ----------------------------- Render isi ------------------------------ */
  const renderSection = () => {
    switch (section) {
      case 'engage':
        return <Engage onNavigate={navigate} />;

      case 'explore':
        return <Explore onNavigate={navigate} />;

      case 'explain':
        return <Explain onNavigate={navigate} />;

      case 'elaborate':
        return <Elaborate onNavigate={navigate} />;

      case 'challenge':
        return <Challenge onNavigate={navigate} />;

      case 'evaluate':
        return <Evaluate />;

      case 'certificate':
        return allDone ? (
          <Certificate />
        ) : (
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-8 text-center">
            <h1 className="text-xl font-bold text-white">Sertifikat belum terbuka</h1>
            <p className="mt-2 text-sm text-slate-400">
              Selesaikan seluruh tahap (Engage, Explore, Explain, Elaborate, Evaluate) terlebih
              dahulu.
            </p>
          </div>
        );

      case 'about':
        return <About onReset={handleReset} onChangeStudent={handleChangeStudent} />;

      case 'dashboard':
      default:
        return (
          <Dashboard onNavigate={navigate} onOpenSettings={() => navigate('about')} />
        );
    }
  };

  return (
    <Layout current={section} onNavigate={navigate}>
      <div key={section} className="animate-fadeUp">
        {renderSection()}
      </div>
    </Layout>
  );
}