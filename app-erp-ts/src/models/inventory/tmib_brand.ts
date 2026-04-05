export interface Brand {
  id?: string;
  brand_users?: string;
  brand_brnam: string;
  brand_actve?: boolean;
  edit_stop?: boolean;
  [key: string]: any;
}

export interface BrandFormData extends Brand {
  muser_id?: string;
  suser_id?: string;
}
