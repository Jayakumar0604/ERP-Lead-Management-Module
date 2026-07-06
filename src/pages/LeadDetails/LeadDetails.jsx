import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, ArrowRight, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLead } from '../../hooks/useLead';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lead, isLoading, error, updateNotes } = useLead(id);

  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col text-black">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <span className="font-mono font-bold uppercase tracking-widest">Accessing Record...</span>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="bg-red-50 p-6 border-4 border-red-600 ledger-shadow font-mono">
        <h3 className="text-lg font-bold text-red-800 uppercase tracking-widest">System Error</h3>
        <p className="mt-2 text-red-700 font-bold">{error || 'Record Not Found'}</p>
        <Button variant="danger" className="mt-6" onClick={() => navigate('/leads')}>
          Return to Ledger
        </Button>
      </div>
    );
  }

  const handleSaveNote = async () => {
    if (!noteContent.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    let newNotes = [...lead.notes];

    if (editingNoteId) {
      const noteIndex = newNotes.findIndex(n => n.id === editingNoteId);
      if (noteIndex !== -1) {
        newNotes[noteIndex] = {
          ...newNotes[noteIndex],
          content: noteContent,
        };
      }
    } else {
      newNotes.push({
        id: crypto.randomUUID(),
        content: noteContent,
        createdDate: new Date().toISOString(),
        createdBy: 'Current User'
      });
    }

    const success = await updateNotes(newNotes);
    if (success) {
      toast.success(editingNoteId ? 'Note Updated' : 'Note Appended');
      setNoteContent('');
      setEditingNoteId(null);
    }
    setIsSubmitting(false);
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('PERMANENTLY DELETE THIS NOTE?')) return;
    
    setIsSubmitting(true);
    const newNotes = lead.notes.filter(n => n.id !== noteId);
    const success = await updateNotes(newNotes);
    
    if (success) {
      toast.success('Note Deleted');
    }
    setIsSubmitting(false);
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setNoteContent(note.content);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setNoteContent('');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-4 border-black pb-6 gap-6">
        <div className="flex items-start sm:items-center">
          <button
            onClick={() => navigate('/leads')}
            className="mt-1 sm:mt-0 mr-4 sm:mr-6 p-2 border-2 border-transparent hover:border-black hover:bg-slate-200 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
              <span className="bg-black text-white px-2 py-1 font-mono font-bold text-xs sm:text-sm tracking-widest">#{String(lead.id).padStart(4, '0')}</span>
              <Badge status={lead.status}>{lead.status}</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-black uppercase tracking-tighter break-words">{lead.name}</h1>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <Button variant="primary" className="w-full" onClick={() => navigate(`/leads/${lead.id}/edit`)}>
            Edit Record Details
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader title="Dossier Data" subtitle="Core contact & interest parameters" />
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 font-mono">
                <div className="border-b-2 border-slate-200 pb-4">
                  <dt className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email Address</dt>
                  <dd className="text-base font-bold text-black">{lead.email}</dd>
                </div>
                <div className="border-b-2 border-slate-200 pb-4">
                  <dt className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Mobile Contact</dt>
                  <dd className="text-base font-bold text-black">{lead.mobile}</dd>
                </div>
                <div className="border-b-2 border-slate-200 pb-4">
                  <dt className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Location</dt>
                  <dd className="text-base font-bold text-black">{lead.address || 'N/A'}</dd>
                </div>
                <div className="border-b-2 border-slate-200 pb-4">
                  <dt className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Lead Source</dt>
                  <dd className="text-base font-bold text-black">{lead.leadSource || 'N/A'}</dd>
                </div>
                <div className="sm:col-span-2 border-b-2 border-slate-200 pb-4">
                  <dt className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Target Interest</dt>
                  <dd className="text-base font-bold text-black bg-primary-50 inline-block px-3 py-1 border-2 border-primary-600">{lead.courseInterested || 'N/A'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Interaction Log" subtitle="Chronological notes & updates" />
            <CardContent className="space-y-8">
              {/* Note Input */}
              <div className="bg-slate-200 p-6 border-4 border-black ledger-shadow-sm font-mono">
                <label className="block text-sm font-bold text-black mb-3 uppercase tracking-wider">
                  {editingNoteId ? 'Amend Note Record' : 'Append New Note'}
                </label>
                <textarea
                  rows={4}
                  className="block w-full border-2 border-black p-4 focus:outline-none focus:ring-0 focus:border-primary-600 bg-white font-bold resize-y"
                  placeholder="ENTER LOG DETAILS..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  disabled={isSubmitting}
                />
                <div className="mt-4 flex justify-end space-x-4">
                  {editingNoteId && (
                    <Button variant="ghost" onClick={cancelEdit} disabled={isSubmitting}>
                      Cancel
                    </Button>
                  )}
                  <Button variant="danger" onClick={handleSaveNote} isLoading={isSubmitting}>
                    {editingNoteId ? 'Commit Update' : 'Commit Log'}
                  </Button>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-6">
                {lead.notes && lead.notes.length > 0 ? (
                  lead.notes.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).map((note) => (
                    <div key={note.id} className="bg-white border-2 border-black p-5 ledger-shadow-sm relative font-mono">
                      <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-xs font-bold tracking-widest">
                        {format(new Date(note.createdDate), 'yyyy-MM-dd HH:mm')}
                      </div>
                      
                      <div className="mt-4 text-base font-bold text-black whitespace-pre-wrap leading-relaxed pr-8">
                        {note.content}
                      </div>
                      
                      <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-end border-t-2 border-slate-200 pt-4 gap-4">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          Logged By: <span className="text-black">{note.createdBy}</span>
                        </div>
                        <div className="flex space-x-4 self-start sm:self-auto">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="text-sm font-bold uppercase tracking-wider text-primary-600 hover:text-black transition-colors"
                            disabled={isSubmitting}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-sm font-bold uppercase tracking-wider text-red-600 hover:text-black transition-colors flex items-center"
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Purge
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 border-2 border-dashed border-slate-400 text-center font-mono">
                    <p className="font-bold text-slate-500 uppercase tracking-widest">Log is empty.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader title="System Metadata" />
            <CardContent>
              <div className="space-y-6 font-mono">
                <div className="bg-slate-100 p-4 border-l-4 border-primary-600">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Assigned Operator</h4>
                  <p className="mt-2 text-lg font-black text-black uppercase">{lead.assignedEmployee}</p>
                </div>
                <div className="p-4 border-2 border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Record Creation</h4>
                  <p className="mt-2 text-base font-bold text-black">
                    {format(new Date(lead.createdDate), 'yyyy-MM-dd')}
                  </p>
                </div>
                <div className="p-4 border-2 border-slate-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Status</h4>
                  <div className="mt-3">
                    <Badge status={lead.status}>{lead.status}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
