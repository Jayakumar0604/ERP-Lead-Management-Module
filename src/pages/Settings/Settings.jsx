import { Construction } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/common/Card';

const Settings = () => {
  return (
    <div className="space-y-8">
      <div className="border-b-4 border-black pb-6">
        <h1 className="text-4xl font-serif font-black text-black uppercase tracking-tighter">System Configuration</h1>
        <p className="mt-2 text-sm font-mono font-bold text-slate-500 uppercase tracking-widest">
          Manage application preferences and operator settings
        </p>
      </div>

      <Card>
        <CardHeader title="Module Status" subtitle="System components under maintenance" />
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center border-4 border-dashed border-slate-300">
            <Construction className="h-16 w-16 text-primary-600 mb-4" />
            <h3 className="text-2xl font-serif font-bold text-black uppercase tracking-tight">Under Construction</h3>
            <p className="mt-4 text-slate-600 font-mono font-bold max-w-md mx-auto">
              The configuration module is currently being built. Please check back after the next deployment cycle.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
