import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { jsPDF } from 'jspdf';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  CheckSquare, 
  Square, 
  AlertCircle,
  HelpCircle,
  Heart,
  Stethoscope
} from 'lucide-react';
import { formatFriendlyDate, calculateCycleStatistics } from '../../lib/cycleMath';

export const ReportScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { periodLogs, symptomLogs, dailyCheckins, profile } = useApp();

  const [dateRangeMonths, setDateRangeMonths] = useState<number>(3);
  const [includeCycles, setIncludeCycles] = useState<boolean>(true);
  const [includeFlow, setIncludeFlow] = useState<boolean>(true);
  const [includeSymptoms, setIncludeSymptoms] = useState<boolean>(true);
  const [includeMoods, setIncludeMoods] = useState<boolean>(true);
  const [includeNotes, setIncludeNotes] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const reportRef = useRef<HTMLDivElement>(null);

  const stats = calculateCycleStatistics([28, 29, 27]);

  // Questions for doctor
  const doctorQuestions = [
    'Are my cycle lengths (averaging 28-29 days with occasional variations) within a healthy range for my age bracket?',
    'Could my recurring cramps (intensity reaching 7-8/10) indicate pelvic inflammation or endometriosis?',
    'Should we run a basic hormonal profile (FSH, LH, Prolactin, AMH, TSH) or fasting insulin to evaluate PCOS indicators?',
    'What non-hormonal or dietary interventions can help soothe luteal phase fatigue and bloating?'
  ];

  const handleDownloadPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
      });

      const title = 'SheOra - Confidential Patient Cycle Summary Report';
      const disclaimer = 'NOTICE FOR HEALTHCARE PROVIDER: This report is compiled from personal self-reported logs. It does not constitute a diagnostic evaluation.';
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(190, 24, 93); // Pink 700
      doc.text(title, 40, 50);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(disclaimer, 40, 70, { maxWidth: 515 });

      doc.setDrawColor(244, 114, 182);
      doc.line(40, 85, 555, 85);

      let yPos = 110;

      // Section 1: Baseline Demographics
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text('1. Patient Profile Summary', 40, yPos);
      yPos += 18;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Age Bracket: ${profile.age_group} years`, 40, yPos);
      doc.text(`Primary Focus: ${profile.goal.replace('_', ' ')}`, 220, yPos);
      doc.text(`Estimated Rhythm: ${profile.is_cycle_regular ? 'Regular' : 'Irregular'} (Avg: ${stats.averageLength} days)`, 400, yPos);
      yPos += 30;

      // Section 2: Period & Bleeding Logs
      if (includeCycles || includeFlow) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('2. Menstrual Dates & Flow Intensity Logs', 40, yPos);
        yPos += 18;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const recentLogs = periodLogs.slice(0, 8);
        if (recentLogs.length === 0) {
          doc.text('No period logs recorded in this period.', 40, yPos);
          yPos += 20;
        } else {
          recentLogs.forEach(p => {
            doc.text(`• ${p.log_date}: Flow Intensity: ${p.flow_intensity.toUpperCase()} ${p.is_spotting ? '(Spotting noted)' : ''}`, 50, yPos);
            yPos += 15;
          });
        }
        yPos += 15;
      }

      // Section 3: Symptoms
      if (includeSymptoms) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('3. Reported Symptoms & Severity (0-10 Scale)', 40, yPos);
        yPos += 18;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const recentSymptoms = symptomLogs.slice(0, 8);
        if (recentSymptoms.length === 0) {
          doc.text('No symptoms recorded in this period.', 40, yPos);
          yPos += 20;
        } else {
          recentSymptoms.forEach(s => {
            doc.text(`• ${s.log_date} - ${s.symptom_code.replace('_', ' ')}: Severity ${s.intensity}/10 ${s.notes ? `("${s.notes}")` : ''}`, 50, yPos);
            yPos += 15;
          });
        }
        yPos += 15;
      }

      // Section 4: Doctor Questions
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('4. Recommended Discussion Points for Physician', 40, yPos);
      yPos += 18;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doctorQuestions.forEach(q => {
        doc.text(`- ${q}`, 50, yPos, { maxWidth: 500 });
        yPos += 22;
      });

      doc.save(`SheOra_Doctor_Summary_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4 animate-fadeIn">
      {/* Title */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-2xl border border-pink-100">
        <div className="flex items-center space-x-2 text-rose-600 mb-1">
          <Stethoscope className="w-5 h-5" />
          <h2 className="text-sm font-bold text-slate-800">
            {t('report.title')}
          </h2>
        </div>
        <p className="text-xs text-slate-600">
          {t('report.subtitle')}
        </p>
      </div>

      {/* Mandatory Provider Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start space-x-2 text-[11px] text-amber-900 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>{t('report.disclaimer')}</span>
      </div>

      {/* Customization Options */}
      <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800">
          {t('report.dateRange')}
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {[3, 6, 12].map(m => (
            <button
              key={m}
              onClick={() => setDateRangeMonths(m)}
              className={`py-2 rounded-xl text-xs font-medium border transition ${
                dateRangeMonths === m
                  ? 'border-pink-500 bg-pink-50 text-pink-800 font-semibold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:border-pink-200'
              }`}
            >
              Past {m} Months
            </button>
          ))}
        </div>

        <h4 className="text-xs font-bold text-slate-800 pt-2">
          {t('report.categories')}
        </h4>

        <div className="space-y-2 text-xs">
          {[
            { label: t('report.catCycles'), checked: includeCycles, toggle: () => setIncludeCycles(!includeCycles) },
            { label: t('report.catFlow'), checked: includeFlow, toggle: () => setIncludeFlow(!includeFlow) },
            { label: t('report.catSymptoms'), checked: includeSymptoms, toggle: () => setIncludeSymptoms(!includeSymptoms) },
            { label: t('report.catMoods'), checked: includeMoods, toggle: () => setIncludeMoods(!includeMoods) },
            { label: t('report.catNotes'), checked: includeNotes, toggle: () => setIncludeNotes(!includeNotes) },
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={cat.toggle}
              className="flex items-center space-x-2 cursor-pointer text-slate-700"
            >
              {cat.checked ? (
                <CheckSquare className="w-4 h-4 text-pink-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-300" />
              )}
              <span>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Report Preview Card */}
      <div 
        ref={reportRef}
        className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 print:p-0 print:border-none print:shadow-none"
      >
        <div className="border-b border-pink-100 pb-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-pink-600">
                SheOra Clinical Summary
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                {t('report.doctorSummaryTitle')}
              </h2>
            </div>
            <span className="text-[10px] text-slate-400">
              Generated: {new Date().toLocaleDateString()}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 italic">
            Reporting Period: Past {dateRangeMonths} Months
          </p>
        </div>

        {/* Section 1: Metrics */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 mb-1.5">
            1. Rhythm & Variability
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div>Average Length: <strong className="text-slate-800">{stats.averageLength} days</strong></div>
            <div>Variability: <strong className="text-slate-800">±{stats.variability} days</strong></div>
            <div>Self-Reported Rhythm: <strong className="text-slate-800">{profile.is_cycle_regular ? 'Regular' : 'Irregular'}</strong></div>
            <div>Age Bracket: <strong className="text-slate-800">{profile.age_group}</strong></div>
          </div>
        </div>

        {/* Section 2: Flow & Symptom Highlights */}
        {includeFlow && (
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-1.5">
              2. Bleeding Records (Recent Logs)
            </h4>
            <div className="space-y-1 text-[11px] text-slate-700">
              {periodLogs.slice(0, 4).map(p => (
                <div key={p.id} className="flex justify-between border-b border-slate-100 py-1">
                  <span>{formatFriendlyDate(p.log_date, i18n.language)}</span>
                  <span className="font-semibold capitalize">{p.flow_intensity.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Questions to Ask Doctor */}
        <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100 space-y-2">
          <h4 className="text-xs font-bold text-purple-900 flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>{t('report.questionsTitle')}</span>
          </h4>
          <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc pl-4 leading-relaxed">
            {doctorQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Export / Print Actions */}
      <div className="flex space-x-3 pt-2">
        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-2xl shadow-sm text-xs transition flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating...' : t('report.downloadPdf')}</span>
        </button>

        <button
          onClick={() => window.print()}
          className="p-3 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition"
          title="Print Report"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
