import usePersistedState from './usePersistedState';

const createDataHook = ({
  key,
  initialData,
  dataKey,
  idPrefix,
  idFn,
  prepend = false,
  onCreate,
  onUpdate,
}) => {
  const singular = dataKey.replace(/s$/, '');
  const prefix = singular.charAt(0).toUpperCase() + singular.slice(1);

  return () => {
    const [data, setData] = usePersistedState(key, initialData);

    const add = (input) => {
      const newItem = {
        ...(onCreate ? onCreate(input, data) : input),
        id: idFn ? idFn(data) : `${idPrefix || ''}${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      setData((prev) => (prepend ? [newItem, ...prev] : [...prev, newItem]));
      return newItem;
    };

    const update = (id, fields) => {
      setData((prev) =>
        prev.map((item) =>
          item.id === id
            ? onUpdate
              ? onUpdate(item, fields)
              : { ...item, ...fields }
            : item
        )
      );
    };

    const remove = (id) => {
      setData((prev) => prev.filter((i) => i.id !== id));
    };

    return {
      [dataKey]: data,
      [`add${prefix}`]: add,
      [`update${prefix}`]: update,
      [`delete${prefix}`]: remove,
    };
  };
};

export default createDataHook;
