import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertTriangle, CheckCircle, Target, HelpCircle, BarChart3, Sigma } from 'lucide-react';

// Helper component for displaying key metrics
const MetricCard = ({ icon, title, value, subtext, className }) => (
    <div className={`bg-slate-800/60 p-4 rounded-xl border border-slate-700 ${className}`}>
        <div className="flex items-center text-slate-400 mb-2">
            {icon}
            <span className="ml-2 text-sm font-medium">{title}</span>
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
);

export default function DiDAnalysisCard({ data }) {
    if (!data || data.error) {
        return (
            <div className="bg-red-900/50 border border-red-700 p-6 rounded-lg text-white">
                <div className="flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-3 text-red-400" />
                    <h3 className="text-xl font-bold">DiD Analysis Error</h3>
                </div>
                <p className="mt-2 text-red-200">{data?.error || "An unknown error occurred."}</p>
            </div>
        );
    }

    const {
        did_coef,
        did_pvalue,
        n_obs,
        r_squared,
        ci_95,
        interpretation,
        pre_trends_warning,
        pre_trends,
        post_trends
    } = data;

    // Prepare data for the chart
    const chartData = [...pre_trends, ...post_trends].map(d => ({
        ...d,
        time: new Date(d.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }));
    
    // Find the treatment time for the vertical line
    const treatmentTime = pre_trends.length > 0 
        ? new Date(pre_trends[pre_trends.length - 1].time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null;
        
    const isSignificant = did_pvalue <= 0.05;

    return (
        <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 text-white backdrop-blur-sm">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-cyan-400">Difference-in-Differences Analysis</h2>
                    <p className="text-slate-400">Evaluating the impact of an intervention.</p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                    icon={<Target size={16} />}
                    title="ATT Estimate"
                    value={did_coef?.toFixed(4) ?? 'N/A'}
                    subtext="Avg. Treatment Effect on Treated"
                />
                <MetricCard 
                    icon={isSignificant ? <CheckCircle size={16} className="text-green-500"/> : <HelpCircle size={16} className="text-amber-500" />}
                    title="P-value"
                    value={did_pvalue?.toFixed(4) ?? 'N/A'}
                    subtext={isSignificant ? 'Statistically Significant' : 'Not Significant'}
                    className={isSignificant ? "border-green-500/30" : "border-amber-500/30"}
                />
                 <MetricCard 
                    icon={<BarChart3 size={16} />}
                    title="95% Confidence Interval"
                    value={`[${ci_95?.[0]?.toFixed(3)}, ${ci_95?.[1]?.toFixed(3)}]` ?? '[N/A]'}
                    subtext="Plausible range for the true effect"
                />
                <MetricCard 
                    icon={<Sigma size={16} />}
                    title="Observations (N)"
                    value={n_obs?.toLocaleString() ?? 'N/A'}
                    subtext={`R-Squared: ${r_squared?.toFixed(3) ?? 'N/A'}`}
                />
            </div>
            
            {/* Interpretation */}
            <div className={`mt-6 p-4 rounded-lg border ${pre_trends_warning ? 'bg-amber-900/40 border-amber-700' : 'bg-slate-800/60 border-slate-700'}`}>
                <div className="flex items-center">
                    {pre_trends_warning ? (
                        <AlertTriangle className="h-5 w-5 mr-3 text-amber-400 flex-shrink-0" />
                    ) : (
                        <CheckCircle className="h-5 w-5 mr-3 text-green-400 flex-shrink-0" />
                    )}
                    <h4 className="font-semibold text-lg">Model Interpretation</h4>
                </div>
                <p className="mt-2 text-slate-300 text-sm leading-relaxed">{interpretation}</p>
            </div>


            {/* Trends Chart */}
            <div className="mt-6">
                 <h4 className="font-semibold text-lg mb-2">Outcome Trends: Treatment vs. Control</h4>
                <div className="h-80 w-full bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    borderColor: '#4b5563',
                                    color: '#e5e7eb',
                                    borderRadius: '0.5rem'
                                }}
                                labelStyle={{ fontWeight: 'bold' }}
                            />
                            <Legend wrapperStyle={{fontSize: "14px"}} />
                            <Line type="monotone" dataKey="treatment_mean" name="Treatment Group" stroke="#22d3ee" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="control_mean" name="Control Group" stroke="#6b7280" strokeWidth={2} />
                            {treatmentTime && (
                               <ReferenceLine x={treatmentTime} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Treatment Start', position: 'insideTopRight', fill: '#f59e0b', fontSize: 12, fontWeight: 'bold' }} />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
