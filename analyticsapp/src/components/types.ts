export interface ActivityLog {
  id: number;
  userId: number;
  appName?: string;
  userFullName: string;
  emailAddress: string;
  districtName: string;
  schoolName: string;
  friendlyName: string;
  providerName: string;
  moduleId: number | null;
  moduleName: string;
  entityId: string;
  endPointUrl: string;
  actionResult: boolean;
  requestPayload: string;
  requestResponse: string;
  failedReason: string;
  ipaddress: string;
  actionFriendlyName: string;
  locationDetails: string;
  authProvider: string;
  macAddress: string;
  latitude: string;
  longitude: string;
  systemInformation: string;
  actionPerformedDate: string;
  actionName: string;
  activity?: string;
  module?: string;
  userName?: string;
  actionType?: number; 
}
export interface LocationInfo {
  city: string;
  suburb: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
}
export interface FilterField {
  label: string;
  name: string;
  type?: "text" | "date";
  placeholder?: string;
  value: string;
}
export interface FilterState {
  userName: string;
  provider: string;
  city: string;
  state: string;
  country: string;
  module: string | number;
  dateFrom: string;
  dateTo: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type ActivityLogResponse = ApiResponse<ActivityLog[]>;

