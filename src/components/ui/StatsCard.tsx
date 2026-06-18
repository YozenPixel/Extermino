import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
  color: string;
}

export default function StatsCard({ icon, label, value, trend, color }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-card-hover transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
          }`}>
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-800 mt-4">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </motion.div>
  );
}
