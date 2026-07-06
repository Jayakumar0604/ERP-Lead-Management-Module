import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

export const useLead = (id) => {
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLead = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/leads/${id}`);
      setLead(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch lead details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const updateNotes = async (newNotes) => {
    try {
      const updatedLead = await apiClient.patch(`/leads/${id}`, { notes: newNotes });
      setLead(updatedLead);
      return true;
    } catch (err) {
      toast.error('Failed to update notes');
      return false;
    }
  };

  return { lead, isLoading, error, refetch: fetchLead, updateNotes };
};
