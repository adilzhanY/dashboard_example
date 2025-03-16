export interface ClientData {
  contacts: {
    lastWeek: number[];
    thisWeek: number[];
  };

  support: {
    email: string;
  };

  shopifyRevenue: {
    lastWeek: number;
    thisWeek: number;
  };

  contactSources: ContactSource[];
}

export interface ContactSource {
  source: string;
  count: number;
}
