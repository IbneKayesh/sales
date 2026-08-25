import { useMemo } from 'react';
import { deliveryOptions } from '@/data/deliveryOptions';

const useDeliveryOptions = () => {
  return useMemo(() => ({
    options: deliveryOptions,
    defaultOption: deliveryOptions[0],
    getOptionById: (id) => deliveryOptions.find(option => option.id === id)
  }), []);
};

export default useDeliveryOptions;
