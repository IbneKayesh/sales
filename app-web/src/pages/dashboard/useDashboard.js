import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from "@/utils/api.js";

const useDashboard = (initialConfig) => {
  const [history, setHistory] = useState([initialConfig]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const currentLayer = history[history.length - 1];

  // Recursive search function
  const searchConfig = useCallback((config, term, path = []) => {
    let results = [];
    const currentPath = [...path, config];
    
    if (config.items) {
      config.items.forEach(item => {
        if (item.title.toLowerCase().includes(term.toLowerCase())) {
          results.push({
            ...item,
            fullPath: currentPath.map(p => p.title).join(' > '),
            historyPath: currentPath
          });
        }
        if (item.children) {
          results = [...results, ...searchConfig(item.children, term, currentPath)];
        }
      });
    }
    return results;
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const results = searchConfig(initialConfig, searchTerm);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  }, [searchTerm, initialConfig, searchConfig]);

  const fetchData = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest(url, {});
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Dashboard Fetch Error:', err);
      setError(err.message || 'An error occurred while fetching dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentLayer?.apiUrl) {
      fetchData(currentLayer.apiUrl);
    }
  }, [currentLayer?.apiUrl, fetchData]);

  const drillDown = (childLayer) => {
    if (childLayer) {
      setHistory((prev) => [...prev, childLayer]);
    }
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const jumpToLayer = (index) => {
    if (index >= 0 && index < history.length) {
      setHistory((prev) => prev.slice(0, index + 1));
    }
  };

  const navigateToSearchResult = (result) => {
    if (result.historyPath) {
      // If it's a child layer, we need to add the children object to history
      if (result.children) {
        setHistory([...result.historyPath, result.children]);
      } else {
        setHistory(result.historyPath);
      }
      setSearchTerm('');
    }
  };

  const reset = () => {
    setHistory([initialConfig]);
    setSearchTerm('');
  };

  return {
    currentLayer,
    data,
    loading,
    error,
    history,
    searchTerm,
    setSearchTerm,
    searchResults,
    drillDown,
    goBack,
    jumpToLayer,
    navigateToSearchResult,
    reset
  };
};

export default useDashboard;
