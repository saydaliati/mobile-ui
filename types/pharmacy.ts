export interface Pharmacy {
    id: string;
    name: string;
    address: string;
    phone: string;
    latitude: number;
    longitude: number;
    hours: string;
    closingTime: string;
    services?: string[];
    isOpen?: boolean;
  }