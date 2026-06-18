import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Download } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { useInterventionStore } from '../../stores/appStore';
import { mockMonthlyStats } from '../../stores/mockData';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function ReportsPage() {
  const { t } = useI18n();
  const { interventions } = useInterventionStore();

  const typeCounts = useMemo(() => {
    const counts = { rodent: 0, disinfection: 0, insect: 0 };
    interventions.forEach((i) => counts[i.type]++);
    return counts;
  }, [interventions]);

  const statusCounts = useMemo(() => {
    const counts = { scheduled: 0, 'in-progress': 0, completed: 0, cancelled: 0 };
    interventions.forEach((i) => counts[i.status]++);
    return counts;
  }, [interventions]);

  const satisfactionRate = 98;

  const barData = {
    labels: mockMonthlyStats.map((s) => s.month),
    datasets: [
      {
        label: t.reports.interventions,
        data: mockMonthlyStats.map((s) => s.interventions),
        backgroundColor: '#E8562A',
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: [t.interventions.rodent, t.interventions.disinfection, t.interventions.insect],
    datasets: [{
      data: [typeCounts.rodent, typeCounts.disinfection, typeCounts.insect],
      backgroundColor: ['#E8562A', '#27AE60', '#F0A830'],
      borderWidth: 0,
    }],
  };

  const lineData = {
    labels: mockMonthlyStats.map((s) => s.month),
    datasets: [{
      label: t.reports.revenue,
      data: mockMonthlyStats.map((s) => s.revenue),
      borderColor: '#E8562A',
      backgroundColor: 'rgba(232, 86, 42, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#E8562A',
      pointRadius: 4,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1E272E', padding: 12, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#95A5A6', font: { size: 11 } } },
      y: {
        grid: { color: '#F0F2F5' },
        ticks: { color: '#95A5A6', font: { size: 11 }, maxTicksLimit: 6 },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { padding: 16, usePointStyle: true, color: '#636E72', font: { size: 12 } },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t.reports.title}</h1>
          <p className="text-sm text-gray-400 mt-1">{t.reports.subtitle}</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors">
          <Download size={18} /> {t.reports.exportBtn}
        </motion.button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.reports.interventions, value: interventions.length, color: '#E8562A', bg: '#FFF0EA' },
          { label: 'Complétées', value: statusCounts.completed, color: '#27AE60', bg: '#E8F8F0' },
          { label: 'En cours', value: statusCounts['in-progress'], color: '#F39C12', bg: '#FFF8E1' },
          { label: t.reports.satisfaction, value: `${satisfactionRate}%`, color: '#3498DB', bg: '#EBF5FF' },
        ].map((item, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-3xl font-bold" style={{ color: item.color }}>{item.value}</p>
            <p className="text-sm text-gray-400 mt-1">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly interventions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.reports.monthly}</h3>
          <div style={{ height: 250 }}>
            <Bar data={barData} options={options} />
          </div>
        </motion.div>

        {/* Revenue trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.reports.revenue}</h3>
          <div style={{ height: 250 }}>
            <Line data={lineData} options={options} />
          </div>
        </motion.div>

        {/* Breakdown by type */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.reports.byType}</h3>
          <div className="flex justify-center" style={{ height: 250 }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </motion.div>

        {/* Intervention status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Statut des interventions</h3>
          <div className="space-y-4">
            {[
              { label: t.interventions.scheduled, count: statusCounts.scheduled, color: '#3498DB' },
              { label: t.interventions.inProgress, count: statusCounts['in-progress'], color: '#F39C12' },
              { label: t.interventions.completed, count: statusCounts.completed, color: '#27AE60' },
              { label: t.interventions.cancelled, count: statusCounts.cancelled, color: '#E74C3C' },
            ].map((status) => {
              const total = interventions.length || 1;
              const pct = Math.round((status.count / total) * 100);
              return (
                <div key={status.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{status.label}</span>
                    <span className="text-sm font-medium text-gray-800">{status.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: status.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
