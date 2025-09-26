export interface Application {
  shortName: string
  launchUrl: string
  id: string
  uniqueNameorId: string
  displayName: string
  shortDescription: string
  description: string
  category: string[]
  applicationLink: string
  ssoRedirectUrl: string
  launcherImage: string
  bannerImagepath: string
  applicationTag: string[]
  status: "active" | "inactive" | "beta" | "delete"
  publisherName: string
  isActive: boolean
  isDeleted: boolean
  isVisible: boolean
  defaultOrgTypeCode: string
  createdDate: string
  lastModified: string
  userCount: number
  smallIconpath: string;
  smallLauncherImage: string;
  largeIconpath: string,
  rolesandFeatures: []
}

export const applicationCategories = [
  "Administrative",
  "Assessment",
  "Data Management",
  "Finance",
  "Human Resources",
  "Instruction",
  "Reporting",
  "Student Information",
  "Other",
] as const 