import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import BiometryChart from '../charts/BiometryChart';

const FetalBiometryCalculator: React.FC = () => {
    const [ga, setGa] = useState(32); // Gestational age in weeks
    const [bpd, setBpd] = useState(8.2); // Biparietal diameter (cm)
    const [hc, setHc] = useState(30.0); // Head circumference (cm)
    const [ac, setAc] = useState(28.0); // Abdominal circumference (cm)
    const [fl, setFl] = useState(6.2); // Femur length (cm)
    
    const [afi1, setAfi1] = useState(4);
    const [afi2, setAfi2] = useState(5);
    const [afi3, setAfi3] = useState(4);
    const [afi4, setAfi4] = useState(5);

    const handlePositiveNumberChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(Math.max(0, Number(e.target.value)));
    };

    const efw = useMemo(() => {
        // Hadlock 1985 formula (often cited as Hadlock 4)
        if (!ac || !fl || !hc || !bpd) return null;
        const efwGrams = Math.pow(10, 1.326 - (0.00326 * ac * fl) + (0.0107 * hc) + (0.0438 * ac) + (0.158 * fl));
        return Math.round(efwGrams);
    }, [bpd, hc, ac, fl]);

    const afi = useMemo(() => {
        return afi1 + afi2 + afi3 + afi4;
    }, [afi1, afi2, afi3, afi4]);
    
    const afiInterpretation = useMemo(() => {
        if (afi <= 5) return { text: "Oligohydramnios", color: "text-red-500" };
        if (afi > 5 && afi <= 24) return { text: "Normal", color: "text-green-500" };
        return { text: "Polyhydramnios", color: "text-orange-500" };
    }, [afi]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card title="Fetal Biometry Inputs">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">GA at Scan (weeks)</label>
                            <input type="number" step="1" min="0" value={ga} onChange={handlePositiveNumberChange(setGa)} className="mt-1 w-full form-input"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">BPD (cm)</label>
                            <input type="number" step="0.1" min="0" value={bpd} onChange={handlePositiveNumberChange(setBpd)} className="mt-1 w-full form-input"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">HC (cm)</label>
                            <input type="number" step="0.1" min="0" value={hc} onChange={handlePositiveNumberChange(setHc)} className="mt-1 w-full form-input"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">AC (cm)</label>
                            <input type="number" step="0.1" min="0" value={ac} onChange={handlePositiveNumberChange(setAc)} className="mt-1 w-full form-input"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">FL (cm)</label>
                            <input type="number" step="0.1" min="0" value={fl} onChange={handlePositiveNumberChange(setFl)} className="mt-1 w-full form-input"/>
                        </div>
                    </div>
                </Card>
                <Card title="Amniotic Fluid Index (AFI)">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Q1</label>
                            <input type="number" min="0" value={afi1} onChange={handlePositiveNumberChange(setAfi1)} className="mt-1 w-full form-input"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Q2</label>
                            <input type="number" min="0" value={afi2} onChange={handlePositiveNumberChange(setAfi2)} className="mt-1 w-full form-input"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Q3</label>
                            <input type="number" min="0" value={afi3} onChange={handlePositiveNumberChange(setAfi3)} className="mt-1 w-full form-input"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Q4</label>
                            <input type="number" min="0" value={afi4} onChange={handlePositiveNumberChange(setAfi4)} className="mt-1 w-full form-input"/>
                        </div>
                     </div>
                </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <Card title="Results & Visualization">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center mb-6">
                        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Estimated Fetal Weight (EFW)</h3>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{efw ? `${efw} g` : 'N/A'}</p>
                        </div>
                         <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Amniotic Fluid Index (AFI)</h3>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{afi} cm</p>
                            <p className={`text-sm font-semibold ${afiInterpretation.color}`}>{afiInterpretation.text}</p>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                       <BiometryChart title="EFW Growth Chart" dataKey="efw" measuredGa={ga} measuredValue={efw} />
                    </div>
                     <div className="h-80 w-full mt-6">
                       <BiometryChart title="AFI Chart" dataKey="afi" measuredGa={ga} measuredValue={afi} />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FetalBiometryCalculator;
