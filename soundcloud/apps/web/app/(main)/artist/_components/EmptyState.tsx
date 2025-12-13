import React from 'react';
import { Music } from "lucide-react";

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-12 text-gray-400 bg-gray-100 dark:bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-white/10">
    <Music size={32} className="mx-auto mb-2 opacity-50" />
    <p className="text-sm">{message}</p>
  </div>
);

export default EmptyState;