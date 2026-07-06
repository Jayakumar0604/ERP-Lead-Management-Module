import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';

export const useLeads = (filters) => {
  const [data, setData] = useState({ leads: [], totalCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // json-server specific query params for v1 beta:
      // _page, _per_page for pagination
      // q for full-text search
      const params = {
        _page: filters.page,
        _per_page: filters.limit,
      };

      if (filters.search) {
        params.q = filters.search; // Global search across fields
      }
      
      if (filters.status) {
        params.status = filters.status;
      }
      
      if (filters.assignedEmployee) {
        params.assignedEmployee = filters.assignedEmployee;
      }
      
      if (filters.dateFrom) {
        params.createdDate_gte = filters.dateFrom;
      }
      
      if (filters.dateTo) {
        params.createdDate_lte = filters.dateTo;
      }

      const response = await apiClient.get('/leads', params);
      setData({ leads: response.data, totalCount: response.totalCount });
    } catch (err) {
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { ...data, isLoading, error, refetch: fetchLeads };
};
