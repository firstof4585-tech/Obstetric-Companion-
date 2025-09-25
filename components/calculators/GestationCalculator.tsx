import React, { useState, useMemo } from 'react';
import type { CalendarType, Milestone, AncVisit } from '../../types';
import Card from '../ui/Card';
import PrintButton from '../ui/PrintButton';
import { MILESTONE_WEEKS, WHO_ANC_SCHEDULE, GREGORIAN_MONTHS, ETHIOPIAN_MONTHS } from '../../constants';
import { gregorianToEthiopian, ethiopianToGregorian, formatDualDate, calculateGa, addWeeks } from '../../utils/dateUtils';

interface DateInputProps {
  calendar: CalendarType;
  year: number; setYear: (y: number) => void;
  month: number; setMonth: (m: number) => void;
  day: number; setDay: (d: number) => void;
}

const DateInput: React.FC<DateInputProps> = ({ calendar, year, setYear, month, setMonth, day, setDay }) => {
    const currentYear = new Date().getFullYear();
    const ecCurrentYear = gregorianToEthiopian(new Date()).year;

    const years = calendar === 'GC'
        ? Array.from({ length: 5 }, (_, i) => currentYear - i)
        : Array.from({ length: 5 }, (_, i) => ecCurrentYear - i);

    const months = calendar === 'GC' ? GREGORIAN_MONTHS : ETHIOPIAN_MONTHS;

    const daysInMonth = useMemo(() => {
        if (calendar === 'GC') {
            return new Date(year, month, 0).getDate();
        } else {
            if (month <= 12) return 30;
            return (year % 4) === 3 ? 6 : 5; // Pagumē days
        }
    }, [calendar, year, month]);

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="grid grid-cols-3 gap-2 mt-1">
            <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="form-select">
                <option value="" disabled>Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="form-select">
                <option value="" disabled>Month</option>
                {months.map((m, index) => <option key={index} value={index + 1}>{m}</option>)}
            </select>
            <select value={day} onChange={e => setDay(parseInt(e.target.value))} className="form-select">
                <option value="" disabled>Day</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
        </div>
    );
};


const GestationCalculator: React.FC = () => {
  const [calcMethod, setCalcMethod] = useState<'lnmp' | 'ultrasound'>('lnmp');
  const [calendar, setCalendar] = useState<CalendarType>('GC');
  
  const today = new Date();
  const todayEc = gregorianToEthiopian(today);

  // LNMP Date State
  const [gcLnmpYear, setGcLnmpYear] = useState(today.getFullYear());
  const [gcLnmpMonth, setGcLnmpMonth] = useState(today.getMonth() + 1);
  const [gcLnmpDay, setGcLnmpDay] = useState(today.getDate());
  const [ecLnmpYear, setEcLnmpYear] = useState(todayEc.year);
  const [ecLnmpMonth, setEcLnmpMonth] = useState(todayEc.month);
  const [ecLnmpDay, setEcLnmpDay] = useState(todayEc.day);

  // Ultrasound Date State
  const [gcUsYear, setGcUsYear] = useState(today.getFullYear());
  const [gcUsMonth, setGcUsMonth] = useState(today.getMonth() + 1);
  const [gcUsDay, setGcUsDay] = useState(today.getDate());
  const [ecUsYear, setEcUsYear] = useState(todayEc.year);
  const [ecUsMonth, setEcUsMonth] = useState(todayEc.month);
  const [ecUsDay, setEcUsDay] = useState(todayEc.day);

  const [usGaWeeks, setUsGaWeeks] = useState<number>(8);
  const [usGaDays, setUsGaDays] = useState<number>(0);

  const [results, setResults] = useState<{ga: string, edd: string, milestones: Milestone[], ancSchedule: AncVisit[]} | null>(null);

  const handleCalculate = () => {
    let lnmp: Date | null = null;
    const today = new Date();
    today.setHours(0,0,0,0);

    if (calcMethod === 'lnmp') {
      if (calendar === 'GC') {
        lnmp = new Date(gcLnmpYear, gcLnmpMonth - 1, gcLnmpDay);
      } else {
        lnmp = ethiopianToGregorian(ecLnmpYear, ecLnmpMonth, ecLnmpDay);
      }
    } else { // ultrasound
      const usGaTotalDays = usGaWeeks * 7 + usGaDays;
      let ultrasoundDate: Date;
       if (calendar === 'GC') {
        ultrasoundDate = new Date(gcUsYear, gcUsMonth - 1, gcUsDay);
      } else {
        ultrasoundDate = ethiopianToGregorian(ecUsYear, ecUsMonth, ecUsDay);
      }
      lnmp = new Date(ultrasoundDate.getTime() - usGaTotalDays * 24 * 60 * 60 * 1000);
    }
    lnmp.setHours(0,0,0,0);
    
    const { weeks, days } = calculateGa(lnmp, today);
    const edd = new Date(lnmp.getTime() + 280 * 24 * 60 * 60 * 1000);

    const milestones: Milestone[] = Object.entries(MILESTONE_WEEKS).map(([name, weekVal]) => {
      if (Array.isArray(weekVal)) {
        const startDate = addWeeks(lnmp!, weekVal[0]);
        const endDate = addWeeks(lnmp!, weekVal[1]);
        return {
          name,
          date: `${formatDualDate(startDate)} to ${formatDualDate(endDate)}`,
          ga: `${weekVal[0]}w 0d - ${weekVal[1]}w 0d`
        };
      } else {
        return {
          name,
          date: formatDualDate(addWeeks(lnmp!, weekVal)),
          ga: `${weekVal}w 0d`
        };
      }
    });

    const ancSchedule: AncVisit[] = WHO_ANC_SCHEDULE.map(visit => {
      const visitDate = addWeeks(lnmp!, visit.weeks);
      return {
        visit: visit.visit,
        gaRange: `${visit.weeks} weeks`,
        recommendedDate: formatDualDate(visitDate),
        details: visit.details
      }
    });

    setResults({
      ga: `${weeks} weeks, ${days} days`,
      edd: formatDualDate(edd),
      milestones,
      ancSchedule,
    });
  };

  return (
    <div className="space-y-6">
      <style>{`.form-select { appearance: none; background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 8 4 4 4-4"/></svg>'); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; padding-right: 2.5rem; display: block; width: 100%; padding-left: 0.75rem; padding-top: 0.5rem; padding-bottom: 0.5rem; background-color: white; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); } .dark .form-select { background-color: #374151; border-color: #4b5563; color: #d1d5db; background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%239ca3af" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 8 4 4 4-4"/></svg>'); }`}</style>
      <Card title="Input Parameters">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Calculation Method</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <button onClick={() => setCalcMethod('lnmp')} className={`px-4 py-2 rounded-l-md text-sm font-medium ${calcMethod === 'lnmp' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'} border border-slate-300 dark:border-slate-600 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}>LNMP</button>
              <button onClick={() => setCalcMethod('ultrasound')} className={`-ml-px px-4 py-2 rounded-r-md text-sm font-medium ${calcMethod === 'ultrasound' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'} border border-slate-300 dark:border-slate-600 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}>Ultrasound</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Calendar System</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <button onClick={() => setCalendar('GC')} className={`px-4 py-2 rounded-l-md text-sm font-medium ${calendar === 'GC' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'} border border-slate-300 dark:border-slate-600 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}>Gregorian</button>
              <button onClick={() => setCalendar('EC')} className={`-ml-px px-4 py-2 rounded-r-md text-sm font-medium ${calendar === 'EC' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'} border border-slate-300 dark:border-slate-600 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}>Ethiopian</button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {calcMethod === 'lnmp' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Last Normal Menstrual Period (LNMP)</label>
              <DateInput calendar={calendar} year={calendar==='GC' ? gcLnmpYear : ecLnmpYear} setYear={calendar==='GC' ? setGcLnmpYear : setEcLnmpYear} month={calendar==='GC' ? gcLnmpMonth : ecLnmpMonth} setMonth={calendar==='GC' ? setGcLnmpMonth : setEcLnmpMonth} day={calendar==='GC' ? gcLnmpDay : ecLnmpDay} setDay={calendar==='GC' ? setGcLnmpDay : setEcLnmpDay} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ultrasound Date</label>
                <DateInput calendar={calendar} year={calendar==='GC' ? gcUsYear : ecUsYear} setYear={calendar==='GC' ? setGcUsYear : setEcUsYear} month={calendar==='GC' ? gcUsMonth : ecUsMonth} setMonth={calendar==='GC' ? setGcUsMonth : setEcUsMonth} day={calendar==='GC' ? gcUsDay : ecUsDay} setDay={calendar==='GC' ? setGcUsDay : setEcUsDay} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Gestational Age at Ultrasound</label>
                <div className="flex items-center space-x-2 mt-1">
                  <input type="number" value={usGaWeeks} min="0" onChange={(e) => setUsGaWeeks(Math.max(0, parseInt(e.target.value)))} className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                  <span className="text-sm">weeks</span>
                  <input type="number" value={usGaDays} min="0" onChange={(e) => setUsGaDays(Math.max(0, parseInt(e.target.value)))} className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                  <span className="text-sm">days</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleCalculate} className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Calculate</button>
        </div>
      </Card>
      
      {results && (
        <div className="space-y-6">
           <Card title="Key Dates & Milestones" actions={<PrintButton targetId="print-area" />}>
             <div id="print-area">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">GA Today</p>
                        <p className="text-xl font-bold text-blue-800 dark:text-blue-300">{results.ga}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-slate-700 p-4 rounded-lg">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Estimated Due Date (EDD)</p>
                        <p className="text-lg font-bold text-green-800 dark:text-green-300">{results.edd}</p>
                    </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">Pregnancy Milestones</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Milestone</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">GA</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date (GC/EC)</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {results.milestones.map((m, i) => (
                            <tr key={i}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">{m.name}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{m.ga}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{m.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <h3 className="text-lg font-semibold mt-8 mb-2 text-slate-800 dark:text-slate-200">WHO ANC Visit Schedule</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Visit</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Recommended Date</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Key Actions / Interventions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {results.ancSchedule.map((v, i) => (
                            <tr key={i}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200 align-top">
                                    {v.visit}<br/><span className="text-xs text-slate-500">({v.gaRange})</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 align-top">{v.recommendedDate}</td>
                                <td className="px-4 py-3 whitespace-normal text-sm text-slate-500 dark:text-slate-400">
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        {v.details.map((d, j) => <li key={j}>{d}</li>)}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
           </Card>
        </div>
      )}
    </div>
  );
};

export default GestationCalculator;
