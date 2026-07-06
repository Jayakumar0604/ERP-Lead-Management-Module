import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiClient } from '../../api/client';
import { useLead } from '../../hooks/useLead';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const leadSchema = z.object({
  name: z.string().min(1, 'NAME REQUIRED'),
  email: z.string().email('INVALID EMAIL FORMAT'),
  mobile: z.string().regex(/^[0-9]{10}$/, 'MUST BE EXACTLY 10 DIGITS'),
  address: z.string().optional(),
  courseInterested: z.string().optional(),
  leadSource: z.string().optional(),
  assignedEmployee: z.string().min(1, 'ASSIGNMENT REQUIRED'),
  status: z.string().min(1, 'STATUS REQUIRED'),
});

const employees = ['Priya Singh', 'Amit Kumar', 'Neha Sharma', 'Rohan Desai', 'Vikram Singh'];
const statuses = ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'];

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lead, isLoading: isLoadingLead, error } = useLead(id);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leadSchema),
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        mobile: lead.mobile,
        address: lead.address || '',
        courseInterested: lead.courseInterested || '',
        leadSource: lead.leadSource || '',
        assignedEmployee: lead.assignedEmployee,
        status: lead.status,
      });
    }
  }, [lead, reset]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      if (id === 'new') {
        const newLead = {
          ...data,
          id: Date.now().toString(),
          createdDate: new Date().toISOString(),
          notes: []
        };
        await apiClient.post('/leads', newLead);
        toast.success('RECORD INITIATED');
        navigate('/leads');
      } else {
        await apiClient.patch(`/leads/${id}`, data);
        toast.success('RECORD AMENDED');
        navigate(`/leads/${id}`);
      }
    } catch (err) {
      toast.error('SYSTEM ERROR ON SAVE');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingLead && id !== 'new') {
    return (
      <div className="flex justify-center items-center h-64 flex-col text-black">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <span className="font-mono font-bold uppercase tracking-widest">Loading...</span>
      </div>
    );
  }

  if (error && id !== 'new') {
    return (
      <div className="bg-red-50 p-6 border-4 border-red-600 ledger-shadow font-mono">
        <h3 className="text-lg font-bold text-red-800 uppercase tracking-widest">System Error</h3>
        <p className="mt-2 text-red-700 font-bold">{error}</p>
        <Button variant="danger" className="mt-6" onClick={() => navigate('/leads')}>
          Return to Ledger
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center border-b-4 border-black pb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-6 p-2 border-2 border-transparent hover:border-black hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="h-8 w-8" />
        </button>
        <h1 className="text-4xl font-serif font-black text-black uppercase tracking-tighter">
          {id === 'new' ? 'New Lead Record' : 'Amend Record'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader title="Input Data Matrix" subtitle="Strict validation rules apply to all required fields." />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Full Name *"
                {...register('name')}
                error={errors.name?.message}
                placeholder="ENTER FULL NAME..."
              />
              <Input
                label="Email Address *"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="ENTER EMAIL..."
              />
              <Input
                label="Mobile Contact *"
                {...register('mobile')}
                error={errors.mobile?.message}
                placeholder="ENTER 10 DIGIT NUMBER..."
              />
              <Input
                label="Location / Address"
                {...register('address')}
                error={errors.address?.message}
                placeholder="ENTER LOCATION..."
              />
              <Input
                label="Target Interest"
                {...register('courseInterested')}
                error={errors.courseInterested?.message}
                placeholder="ENTER TARGET PRODUCT..."
              />
              <Input
                label="Acquisition Source"
                {...register('leadSource')}
                error={errors.leadSource?.message}
                placeholder="ENTER SOURCE..."
              />
              
              <div>
                <label className="block text-sm font-mono font-bold text-black mb-2 uppercase tracking-wide">
                  Assigned Operator *
                </label>
                <select
                  className={`block w-full border-2 p-3 focus:outline-none focus:ring-0 focus:border-black font-mono font-bold uppercase transition-shadow bg-white cursor-pointer ${errors.assignedEmployee ? 'border-red-600 bg-red-50 text-red-900' : 'border-black hover:ledger-shadow-sm focus:ledger-shadow'}`}
                  {...register('assignedEmployee')}
                >
                  <option value="">-- SELECT OPERATOR --</option>
                  {employees.map(emp => (
                    <option key={emp} value={emp}>{emp}</option>
                  ))}
                </select>
                {errors.assignedEmployee && (
                  <p className="mt-2 text-sm font-mono font-bold text-red-600">! {errors.assignedEmployee.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-mono font-bold text-black mb-2 uppercase tracking-wide">
                  Current Status *
                </label>
                <select
                  className={`block w-full border-2 p-3 focus:outline-none focus:ring-0 focus:border-black font-mono font-bold uppercase transition-shadow bg-white cursor-pointer ${errors.status ? 'border-red-600 bg-red-50 text-red-900' : 'border-black hover:ledger-shadow-sm focus:ledger-shadow'}`}
                  {...register('status')}
                >
                  <option value="">-- SELECT STATUS --</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-2 text-sm font-mono font-bold text-red-600">! {errors.status.message}</p>
                )}
              </div>
            </div>
            
            <div className="mt-10 flex flex-col-reverse sm:flex-row sm:justify-end gap-4 pt-8 border-t-4 border-black">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" variant="danger" isLoading={isSaving} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {id === 'new' ? 'Commit Record' : 'Commit Amendments'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default EditLead;
