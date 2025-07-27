import React from 'react';
import { Icon } from '@iconify/react';
import { MockInput } from '@/db/mock-inputs';
import { motion } from 'framer-motion';

interface InputCardProps {
  inputs: MockInput[];
  onCardClick: (content: string) => void;
}

function InputCard({ inputs, onCardClick }: InputCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {inputs.map((item, index) => (
        <motion.button
          key={item.id}
          className="border p-4 rounded shadow w-full text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          onClick={() => onCardClick(item.input)}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Icon icon={item.icon} width={32} height={32} className="mb-3" />
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-gray-600">{item.input}</p>
        </motion.button>
      ))}
    </div>
  );
}

export default InputCard;
