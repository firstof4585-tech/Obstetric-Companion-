
import React, { useState, useMemo } from 'react';
import type { BishopScoreParams } from '../../types';
import Card from '../ui/Card';
import { BISHOP_SCORE_OPTIONS } from '../../constants';

const BishopScoreCalculator: React.FC = () => {
  const [scores, setScores] = useState<BishopScoreParams>({
    dilation: 0,
    effacement: 0,
    station: 0,
    consistency: 0,
    position: 0,
  });

  const handleScoreChange = <K extends keyof BishopScoreParams,>(param: K, value: BishopScoreParams[K]) => {
    setScores(prev => ({ ...prev, [param]: value }));
  };

  const totalScore = useMemo(() => {
    return Object.values(scores).reduce((sum, value) => sum + value, 0);
  }, [scores]);

  const interpretation = useMemo(() => {
    if (totalScore >= 8) {
      return { text: 'Labor is likely to start spontaneously. Induction is likely to be successful.', color: 'text-green-600 dark:text-green-400' };
    } else if (totalScore >= 6) {
      return { text: 'Cervix is favorable, but may not be ready. Induction is likely to be successful.', color: 'text-yellow-600 dark:text-yellow-400' };
    } else {
      return { text: 'Cervix is unfavorable. Induction is less likely to be successful. Cervical ripening may be needed.', color: 'text-red-600 dark:text-red-400' };
    }
  }, [totalScore]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card title="Modified Bishop Score Calculator">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {Object.entries(BISHOP_SCORE_OPTIONS).map(([key, value]) => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{value.label}</label>
              <select
                id={key}
                name={key}
                value={scores[key as keyof BishopScoreParams]}
                onChange={(e) => handleScoreChange(key as keyof BishopScoreParams, parseInt(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {value.options.map((option, index) => (
                  <option key={index} value={index}>{option} (Score: {index})</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">Total Bishop Score</h3>
            <p className="text-6xl font-bold text-blue-600 dark:text-blue-400 my-2">{totalScore}</p>
            <p className={`text-base font-semibold ${interpretation.color}`}>{interpretation.text}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BishopScoreCalculator;
