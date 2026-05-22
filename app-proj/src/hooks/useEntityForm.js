import { useState, useEffect } from 'react';

export default function useEntityForm({ 
  initialEntity = null, 
  defaultValues = {}, 
  onSaveSuccess, 
  saveUrl 
}) {
  const [draft, setDraft] = useState(defaultValues);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Sync draft with initialEntity when it changes (e.g. switching between add and edit mode)
  useEffect(() => {
    if (initialEntity) {
      setDraft(initialEntity);
    } else {
      setDraft(defaultValues);
    }
    setError(null);
  }, [initialEntity, JSON.stringify(defaultValues)]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let parsedValue = value;
    if (type === 'checkbox') {
      parsedValue = checked;
    } else if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }

    setDraft(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const setCustomField = (name, value) => {
    setDraft(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const isEdit = !!initialEntity?.id;
      const url = isEdit ? `${saveUrl}/${initialEntity.id}` : saveUrl;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(draft)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to save entity`);
      }

      const savedEntity = await response.json();
      if (onSaveSuccess) {
        onSaveSuccess(savedEntity, isEdit);
      }
    } catch (err) {
      console.error('[useEntityForm] Save failed:', err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setDraft(initialEntity || defaultValues);
    setError(null);
  };

  return {
    draft,
    isSaving,
    error,
    handleChange,
    setCustomField,
    handleSubmit,
    resetForm,
    setDraft
  };
}
