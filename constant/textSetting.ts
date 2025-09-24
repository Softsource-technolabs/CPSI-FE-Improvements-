// Define the module types
type ModuleKey = 'dashboard' | 'applicationProfiles' | 'appManager' | 'analytics' | 'rolesManagement' | 'tenantManager' | 'notFound' | 'maintenance' | 'settings' | 'sideMenu';
// Define the structure for FiltedMapper
type FiltedMapperType = Record<ModuleKey, ModuleContent>;

interface ModuleContent {
  [key: string]: any;
}

export const FiltedMapper: FiltedMapperType = {
  // "dashboard": {
  "dashboard": {
    "dashboard": {
      "label": "Dashboard",
      "description": "Dashboard title",
      "defaultvalue": "Dashboard"
    },
    "dashUserInfo": {
      "label": "Dashboard content would go here",
      "description": "Dashboard sub title",
      "defaultvalue": "Dashboard Sub Title"
    },
  },
  // }

  // "application profile": {
  "applicationProfiles": {
    "Info Header": {
      "applicationProfiles": {
        "label": "Application Profiles",
        "description": "Profile Page title",
        "defaultvalue": "Application Profiles"
      },
      "userInfo": {
        "label": "User Information",
        "description": "Card Information",
        "defaultvalue": "Card Title"
      },
      "id": {
        "label": "Staff ID",
        "description": "Staff ID",
        "defaultvalue": "Staff ID"
      },
      "userName": {
        "label": "Name",
        "description": "User Name",
        "defaultvalue": "User Name"
      },
      "appInfo": {
        "label": "Application & Roles",
        "description": "Sub Card Information",
        "defaultvalue": "Sub Card Title"
      },
      "editProfile": {
        "label": "Edit Profile",
        "description": "Edit Profile button",
        "defaultvalue": "Edit Profile"
      },
    },
  },
  // }

  // "application Management": {
  // "applicationManagement": {
  //   "applicationManagement": {
  //     "label": "Application Management",
  //     "description": "Application Management Page title",
  //     "defaultvalue": "Application Management"
  //   },
  //   "addApplication": {
  //     "label": "Add Application",
  //     "description": "Add Application button",
  //     "defaultvalue": "Add Application"
  //   },
  //   "editApplication": {
  //     "label": "Edit Application",
  //     "description": "Edit Application button",
  //     "defaultvalue": "Edit Application"
  //   },
  //   "deleteApplication": {
  //     "label": "Delete Application",
  //     "description": "Delete Application button",
  //     "defaultvalue": "Delete Application"
  //   },
  // },
  // }

  // "app manager" : {
  "appManager": {
    "Info Header": {
      "appManager": {
        "label": "Applications",
        "description": "App Manager Page title",
        "defaultvalue": "App Manager"
      },
      "subTitle": {
        "label": "Application List",
        "description": "Application sub title",
        "defaultvalue": "Sub Title"
      },
      "createApp": {
        "label": "Add Application",
        "description": "Button Name",
        "defaultvalue": "Button Name"
      }
    },
    "Create / Edit Application": {
      "createApplicationTitle": {
        "label": "Create New Application",
        "description": "Create Application Label",
        "defaultvalue": "Create Application"
      },
      "UniqueName": {
        "label": "Application Unique Name/ID",
        "description": "Your Application Unique Name",
        "defaultvalue": "Application Unique Name"
      },
      "displayName": {
        "label": "Application Display Name",
        "description": "Application Display Name",
        "defaultvalue": "Application Display"
      },
      "shortName": {
        "label": "Application Short Name",
        "description": "Your Short Name for Application",
        "defaultvalue": "Short Application name"
      },
      "shortDescription": {
        "label": "Application Short Description",
        "description": "Short Desc for Application",
        "defaultvalue": "short Description"
      },
      "longDescription": {
        "label": "Application Long Description",
        "description": "Long Descriotion App",
        "defaultvalue": "Long Descritpion"
      },
      "category": {
        "label": "Application Category",
        "description": "Category of Application",
        "defaultvalue": "Category Application"
      },
      "publisherName": {
        "label": "Publisher Name",
        "description": "Publisher Application Name",
        "defaultvalue": "Publisher Application"
      },
      "publisherAppLink": {
        "label": "Publisher Application Link",
        "description": "Your Application Link",
        "defaultvalue": "Publisher Application Link"
      },
      "tags": {
        "label": "Application Tags",
        "description": "Your Application Tags",
        "defaultvalue": "Application Tags"
      },
      "lunchConfig": {
        "label": "Launch Configure",
        "description": "Application Launch Configure",
        "defaultvalue": "Launch Configure"
      },
      "appLauchURL": {
        "label": "Application Lanuch URL",
        "description": "Application Lanuch URL",
        "defaultvalue": "Application Lanuch URL"
      },
      "statusActivation": {
        "label": "Status & Activation",
        "description": "Status & Activation of Application",
        "defaultvalue": "Status & Activation"
      },
      "accessControl": {
        "label": "Access Control",
        "description": "Access Control Application",
        "defaultvalue": "Access Control"
      },
      "launcherIcons": {
        "label": "Launcher Icons",
        "description": "Application Launcher Icons",
        "defaultvalue": "Launcher Icons"
      },
      "largeIcon": {
        "label": "Large Launcher Icon",
        "description": "App Large Launcher Icon",
        "defaultvalue": "Large Launcher Icon"
      },
      "smallIcon": {
        "label": "Small Launcher Icon",
        "description": "Application Small Launcher Icon",
        "defaultvalue": "Small Launcher Icon"
      },
      "bannerImg": {
        "label": "Banner Image",
        "description": "Application Banner Image",
        "defaultvalue": "Banner Image"
      }
    },
  },
  // }

  // "analytics": {
  "analytics": {
    "Info Header": {
      "analytics": {
        "label": "Analytics",
        "description": "Analytics Page title",
        "defaultvalue": "Analytics"
      },
      "analyticsInfo": {
        "label": "Analytics Information",
        "description": "Analytics sub title",
        "defaultvalue": "Analytics Sub Title"
      }
    },
    "Datatable Header": {
      "user": {
        "label": "User",
        "description": "User Name",
        "defaultvalue": "User"
      },
      "activity": {
        "label": "Activity",
        "description": "User Activity",
        "defaultvalue": "Activity"
      },
      "actionFriendlyName": {
        "label": "Action Friendly Name",
        "description": "Friendly Name for Action",
        "defaultvalue": "Action Friendly Name"
      },
      "city": {
        "label": "City",
        "description": "User City",
        "defaultvalue": "City"
      },
      "state": {
        "label": "State",
        "description": "User State",
        "defaultvalue": "State"
      },
      "country": {
        "label": "Country",
        "description": "User Country",
        "defaultvalue": "Country"
      },
      "authProvider": {
        "label": "Auth Provider",
        "description": "Authentication Provider",
        "defaultvalue": "Auth Provider"
      },
      "dateTime": {
        "label": "Date & Time",
        "description": "Date and Time of Activity",
        "defaultvalue": "Date/Time"
      },
      "actionResult": {
        "label": "Action Result",
        "description": "Result of the Action",
        "defaultvalue": "Action Result"
      },
      "action": {
        "label": "Action",
        "description": "Action Performed",
        "defaultvalue": "Action"
      },
      "viewDetails": {
        "label": "View Details",
        "description": "View Details button",
        "defaultvalue": "View Details"
      }
    },
    "Action Detail": {
      "activityDetails": {
        "label": "Activity Details",
        "description": "Activity Details button",
        "defaultvalue": "Activity Details"
      },
      "locationAndSystem": {
        "label": "Location & System Details",
        "description": "Location and System Details",
        "defaultvalue": "Location & System Details"
      },
      "locationDetails": {
        "label": "Location Details",
        "description": "Location Details",
        "defaultvalue": "Location Details"
      },
      "lat": {
        "label": "Latitude",
        "description": "Latitude of User Location",
        "defaultvalue": "Latitude"
      },
      "long": {
        "label": "Longitude",
        "description": "Longitude of User Location",
        "defaultvalue": "Longitude"
      },
      "ipAddress": {
        "label": "IP Address",
        "description": "User IP Address",
        "defaultvalue": "IP Address"
      },
      "macAddress": {
        "label": "MAC Address",
        "description": "User MAC Address",
        "defaultvalue": "MAC Address"
      },
      "suburb": {
        "label": "Suburb",
        "description": "Suburb Area",
        "defaultvalue": "Suburb"
      },
      "systemDetails": {
        "label": "System Details",
        "description": "User System Details",
        "defaultvalue": "System Details"
      },
      "browser": {
        "label": "Browser",
        "description": "User Browser",
        "defaultvalue": "Browser"
      },
      "layoutEngine": {
        "label": "Layout Engine",
        "description": "Layout Engine of Browser",
        "defaultvalue": "Layout Engine"
      },
      "userAgent": {
        "label": "User Agent",
        "description": "User Agent String",
        "defaultvalue": "User Agent"
      },
      "os": {
        "label": "Operating System",
        "description": "User Operating System",
        "defaultvalue": "Operating System"
      },
      "userInformation": {
        "label": "User Information",
        "description": "User Information Details",
        "defaultvalue": "User Information"
      },
      "districtName": {
        "label": "District Name",
        "description": "User District Name",
        "defaultvalue": "District Name"
      },
      "schoolName": {
        "label": "School Name",
        "description": "User School Name",
        "defaultvalue": "School Name"
      },
      "friendlyName": {
        "label": "Friendly Name",
        "description": "Friendly Name of User",
        "defaultvalue": "Friendly Name"
      },
      "authProviderName": {
        "label": "Auth Provider Name",
        "description": "Name of Authentication Provider",
        "defaultvalue": "Auth Provider Name"
      },
      "moduleName": {
        "label": "Module Name",
        "description": "Name of the Module",
        "defaultvalue": "Module Name"
      },
      "userName": {
        "label": "User Name",
        "description": "Name of the User",
        "defaultvalue": "User Name"
      },
      "email": {
        "label": "User Email",
        "description": "Email of the User",
        "defaultvalue": "User Email"
      },
      "tenantName": {
        "label": "Tenant Name",
        "description": "Name of the Tenant",
        "defaultvalue": "Tenant Name"
      },
      "tenantId": {
        "label": "Tenant ID",
        "description": "Unique Identifier for Tenant",
        "defaultvalue": "Tenant ID"
      },
      "actionDetails": {
        "label": "Action Details",
        "description": "Details of the Action",
        "defaultvalue": "Action Details"
      },
      "requestAction": {
        "label": "Request Action",
        "description": "Action Requested",
        "defaultvalue": "Request Action"
      },
      "endPointURL": {
        "label": "Endpoint URL",
        "description": "URL of the Endpoint",
        "defaultvalue": "Endpoint URL"
      },
      "requestPayload": {
        "label": "Request Payload",
        "description": "Payload of the Request",
        "defaultvalue": "Request Payload"
      },
      "responsePayload": {
        "label": "Response Payload",
        "description": "Payload of the Response",
        "defaultvalue": "Response Payload"
      }
    },
    "Module Filters": {
      "application": {
        "label": "Application",
        "description": "Name of the Application",
        "defaultvalue": "Application"
      },
      "applicationCategory": {
        "label": "Application Category",
        "description": "Category of the Application",
        "defaultvalue": "Application Category"
      },
      "applicationSettings": {
        "label": "Application Settings",
        "description": "Settings of the Application",
        "defaultvalue": "Application Settings"
      },
      "samlAuthentication": {
        "label": "SAML Authentication",
        "description": "SAML Authentication Details",
        "defaultvalue": "SAML Authentication"
      },
      "identityProvider": {
        "label": "Identity Provider",
        "description": "Identity Provider Details",
        "defaultvalue": "Identity Provider"
      },
      "oauthAuthentication": {
        "label": "OAuth Authentication",
        "description": "OAuth Authentication Details",
        "defaultvalue": "OAuth Authentication"
      },
      "organization": {
        "label": "Organization",
        "description": "Organization Details",
        "defaultvalue": "Organization"
      },
      "routings": {
        "label": "Routings",
        "description": "Routing Details",
        "defaultvalue": "Routing"
      },
      "serviceProviderMetaData": {
        "label": "Service Provider Metadata",
        "description": "Metadata for Service Provider",
        "defaultvalue": "Service Provider Metadata"
      },
      "tenantManagement": {
        "label": "Tenant Management",
        "description": "Tenant Management Details",
        "defaultvalue": "Tenant Management"
      },
      "webServices": {
        "label": "Web Service",
        "description": "Web Service Details",
        "defaultvalue": "Web Service"
      },
      "allData": {
        "label": "All",
        "description": "All Data Analytics",
        "defaultvalue": "All Data"
      },
      "applicationDefaultRoles": {
        "label": "Application Default Roles",
        "description": "Default Roles for Application",
        "defaultvalue": "Application Default Roles"
      }
    }
  },
  // }

  // "roles"
  "rolesManagement": {
    "Dashboard": {
      "rolesDashboard": {
        "label": "Roles Dashboard",
        "description": "Roles Dashboard Page title",
        "defaultvalue": "Roles Dashboard"
      },
      "dashboardInfo": {
        "label": "Idaho SSO Portal - Centralized Role & Permission Management",
        "description": "Roles Dashboard sub title",
        "defaultvalue": "Idaho SSO Portal - Centralized Role & Permission Management"
      },
      "refreshBtn": {
        "label": "Refresh",
        "description": "Refresh button",
        "defaultvalue": "Refresh"
      },
      "totalRoles": {
        "label": "Total Roles",
        "description": "Total Roles card title",
        "defaultvalue": "Total Roles"
      },
      "activeRoles": {
        "label": "Active Roles",
        "description": "Active Roles card title",
        "defaultvalue": "Active Roles"
      },
      "applications": {
        "label": "Applications",
        "description": "Inactive Roles card title",
        "defaultvalue": "Applications"
      },
      "pendingApprovals": {
        "label": "Pending Approvals",
        "description": "Pending Approvals card title",
        "defaultvalue": "Pending Approvals"
      },
      "quickActions": {
        "label": "Quick Actions",
        "description": "Quick Actions section title",
        "defaultvalue": "Quick Actions"
      },
      "recentActivity": {
        "label": "Recent Activity",
        "description": "Recent Activity section title",
        "defaultvalue": "Recent Activity"
      },
      "systemStatus": {
        "label": "System Status",
        "description": "System Status section title",
        "defaultvalue": "System Status"
      },
    },
    "Roles Catalog": {
      "rolesCatalogTitle": {
        "label": "Roles Catalog",
        "description": "Title for the roles catalog page",
        "defaultvalue": "Roles Catalog"
      },
      "rolesCatalogDescription": {
        "label": "Manage and configure user roles within the system",
        "description": "Description for the roles catalog page",
        "defaultvalue": "Manage and configure user roles within the system"
      },

      "editRole": {
        "label": "Edit Role",
        "description": "Button to edit a role",
        "defaultvalue": "Edit Role"
      },
      "deleteRole": {
        "label": "Delete Role",
        "description": "Button to delete a role",
        "defaultvalue": "Delete Role"
      },
      "roleName": {
        "label": "Role Name",
        "description": "Column header for role name",
        "defaultvalue": "Role Name"
      },
      "roleDescription": {
        "label": "Description",
        "description": "Column header for role description",
        "defaultvalue": "Description"
      },
      "department": {
        "label": "Department",
        "description": "Column header for department",
        "defaultvalue": "Department"
      },
      "status": {
        "label": "Status",
        "description": "Column header for status",
        "defaultvalue": "Status"
      },
      "expirationDate": {
        "label": "Expiration Date",
        "description": "Column header for expiration date",
        "defaultvalue": "Expiration Date"
      },
      "actions": {
        "label": "Actions",
        "description": "Column header for actions",
        "defaultvalue": "Actions"
      },
      "searchPlaceholder": {
        "label": "Search roles by name, description, or application...",
        "description": "Placeholder for the search input",
        "defaultvalue": "Search roles by name, description, or application..."
      },
      "filters": {
        "label": "Filters",
        "description": "Button to open filters",
        "defaultvalue": "Filters"
      },
      "clearFilters": {
        "label": "Clear",
        "description": "Button to clear filters",
        "defaultvalue": "Clear"
      },
      "noRolesFound": {
        "label": "No roles found",
        "description": "Message when no roles are found",
        "defaultvalue": "No roles found"
      },
    },
    "Create / Edit Role": {
      "createNewRole": {
        "label": "Create New Role",
        "description": "Button to create a new role",
        "defaultvalue": "Create New Role"
      },
      "generalRoleInformation": {
        "label": "General Role Information",
        "description": "Section for general role information",
        "defaultvalue": "General Role Information"
      },
      "roleInformation": {
        "label": "Role Information",
        "description": "Section for role information",
        "defaultvalue": "Role Information"
      },
      "roleNameLabel": {
        "label": "Role Name",
        "description": "Label for role name input",
        "defaultvalue": "Role Name"
      },
      "roleDescriptionLabel": {
        "label": "Role Description",
        "description": "Label for role description input",
        "defaultvalue": "Role Description"
      },
      "roleExpirationDateLabel": {
        "label": "Role Expiration Date",
        "description": "Label for role expiration date input",
        "defaultvalue": "Role Expiration Date"
      },
      "roleDepartmentLabel": {
        "label": "Role Department",
        "description": "Label for role department input",
        "defaultvalue": "Role Department"
      },
      "roleStatusLabel": {
        "label": "Role Status",
        "description": "Label for role status input",
        "defaultvalue": "Role Status"
      },
      "notes": {
        "label": "Notes",
        "description": "Section for additional notes",
        "defaultvalue": "Notes"
      },
      "approvalWorkflow": {
        "label": "Approval Workflow",
        "description": "Section for approval workflow settings",
        "defaultvalue": "Approval Workflow"
      },
      "AdvancedSettings": {
        "label": "Advanced Settings",
        "description": "Section for advanced settings",
        "defaultvalue": "Advanced Settings"
      }
    },
  },
  // "tenant manager": {
  // Main Tenant Manager Page Start
  "tenantManager": {
    "Tenant Manager": {
      "tenantManager": {
        "label": "Tenants",
        "description": "Tenant Manager Page title",
        "defaultvalue": "Tenant Manager"
      },
      "tenantListInfo": {
        "label": "Tenant List",
        "description": "Tenant Manager sub title",
        "defaultvalue": "Tenant Manager Sub Title"
      },
      "addTenant": {
        "label": "Add Tenant",
        "description": "Add Tenant button",
        "defaultvalue": "Add Tenant"
      },
    },
    "Create / Edit Tenant": {
      "createTenant": {
        "label": "Create New Tenant",
        "description": "Create Tenant Label",
        "defaultvalue": "Create Tenant"
      },

      // Main Tenant Manager Page end 

      // Organization Info Start
      "organizationName": {
        "label": "Organization Name",
        "description": "Your Organization Name",
        "defaultvalue": "Organization Name"
      },
      "abbreviatedName": {
        "label": "Abbreviated Name",
        "description": "Abbreviated Name Value",
        "defaultvalue": "Abbreviated Name"
      },
      "zoneRoutingTag": {
        "label": "Zone Routing Tag",
        "description": "Zone Routing Tag Value",
        "defaultvalue": "Zone Routing Tag"
      },
      "adminPassword": {
        "label": "Admin Password",
        "description": "Admin Password Value",
        "defaultvalue": "Admin Password"
      },
      // Organization Info End

      // URL Routing Start
      "basePortalRoutingURL": {
        "label": "Base Portal Routing URL",
        "description": "Base Portal Routing URL for routing",
        "defaultvalue": "Base Portal Routing URL"
      },
      "backupURL": {
        "label": "Backup URL",
        "description": "Backup URL for routing",
        "defaultvalue": "Backup URL"
      },
      "tokenExpirationTime": {
        "label": "Token Expiration Time (hours)",
        "description": "Token Expiration Time for authentication tokens",
        "defaultvalue": "Token Expiration Time"
      },
      // URL Routing End

      // Web Service Start
      "baseOneUserURL": {
        "label": "Base OneUser API URL",
        "description": "Base OneUser API URL for web service",
        "defaultvalue": "Base OneUser API URL",
      },
      "backupOneUserURL": {
        "label": "Backup OneUser API URL",
        "description": "Backup OneUser API URL for web service",
        "defaultvalue": "Backup OneUser API URL",
      },
      "clientId": {
        "label": "Client ID",
        "description": "Client ID for web service",
        "defaultvalue": "Client ID",
      },
      "clientSecret": {
        "label": "Client Secret",
        "description": "Enter client Password",
        "defaultvalue": "Client Secret",
      },
      "enableLoadBalancer": {
        "label": "Enable Load Balancing",
        "description": "Enable Load Balancing for web service",
        "defaultvalue": "Enable Load Balancing",
      },
      // Web Service End

      // SSO Metadata Start

      "selectIdentityProvider": {
        "label": "Select Identity Provider",
        "description": "Select Identity Provider for SSO",
        "defaultvalue": "Select Identity Provider",
      },
      "selectAuthenticationType": {
        "label": "Select Authentication Type",
        "description": "Select Authentication Type for SSO",
        "defaultvalue": "Select Authentication Type",
      },
      "providerConfig": {
        "label": "Provider Configuration",
        "description": "Provider Configuration Table",
        "defaultvalue": "Provider Configuration",
      },
      "spMetadata": {
        "label": "SP Metadata",
        "description": "SP Metadata (Service Provider Metadata)",
        "defaultvalue": "SP Metadata",
      },
      "smalConfig": {
        "label": "SAML Config Settings",
        "description": "SAML Config Settings (SAML Configuration Settings)",
        "defaultvalue": "SAML Config Settings",
      },
      "spMetadataProvider": {
        "label": "Service Provider Metadata",
        "description": "Service Provider Metadata for download files",
        "defaultvalue": "Service Provider Metadata",
      },
      "metadataDownload": {
        "label": "Download Metadata",
        "description": "Download Metadata for download metadata files",
        "defaultvalue": "Download Metadata",
      },
      "basciInfo": {
        "label": "Basic Information",
        "description": "Basic Information for sp metadata",
        "defaultvalue": "Basic Information",
      },
      "entityId": {
        "label": "Entity ID",
        "description": "Unique identifier for your service provider",
        "defaultvalue": "Entity ID",
      },
      "urn": {
        "label": "Name ID Format(URN)",
        "description": "Format of the Name ID in SAML assertions",
        "defaultvalue": "Name ID Format(URN)",
      },
      "serviceEndpoint": {
        "label": "SSO Service Endpoint",
        "description": "URL where SAML responses will be sent",
        "defaultvalue": "SSO Service Endpoint",
      },
      "logoutEndpoint": {
        "label": "SSO Logout Endpoint",
        "description": "URL for handling single logout requests",
        "defaultvalue": "SSO Logout Endpoint",
      },
      "OrgDetails": {
        "label": "Organization Details",
        "description": "Information about your organization and technical contacts",
        "defaultvalue": "Organization Details",
      },

      "siteName": {
        "label": "Site Name",
        "description": "Your website or application name",
        "defaultvalue": "Site Name",
      },
      "siteUrl": {
        "label": "Site Website URL",
        "description": "Your website or application URL",
        "defaultvalue": "Site Website URL",
      },
      "techName": {
        "label": "Technical Contact Name",
        "description": "Name of the technical contact for your organization",
        "defaultvalue": "Technical Contact Name",
      },
      "techEmail": {
        "label": "Technical Contact Email",
        "description": "Email of the technical contact for your organization",
        "defaultvalue": "Technical Contact Email",
      },
      "certificatSettings": {
        "label": "Certificate Settings",
        "description": "Security certificates and signing configuration for SAML communication",
        "defaultvalue": "Certificate Settings",
      },
      "privateKey": {
        "label": "Private Key",
        "description": "Private key used for signing SAML requests",
        "defaultvalue": "Private Key",
      },
      "certificate": {
        "label": "X.509 Certificate",
        "description": "Public certificate for verifying signatures",
        "defaultvalue": "X.509 Certificate",
      },
      "idpConfig": {
        "label": "Google Workspace IDP Configuration",
        "description": "Upload the metadata file from Google Workspace to configure your Identity Provider settings",
        "defaultvalue": "Google Workspace IDP Configuration",
      },
      "uploadFile": {
        "label": "Upload Metadata File",
        "description": "Your metadata file for SSO configuration",
        "defaultvalue": "Upload Metadata File",
      },
      "providerSetting": {
        "label": "Identity Provider Settings",
        "description": "These fields will be populated when you upload the metadata file",
        "defaultvalue": "Identity Provider Settings",
      },
      "fName": {
        "label": "Friendly Name",
        "description": "Friendly Name for your application",
        "defaultvalue": "Friendly Name",
      },
      "singleUrl": {
        "label": "Single Sign On URL",
        "description": "One time URL for SSO",
        "defaultvalue": "Single Sign On URL",
      },
      "singleLogoutUrl": {
        "label": "Single Log Out URL",
        "description": "One time URL for SSO Logout",
        "defaultvalue": "Single Log Out URL",
      },
      "issuer": {
        "label": "Issuer",
        "description": "issuer of the SAML assertion",
        "defaultvalue": "Issuer",
      },
      "tenantId": {
        "label": "Tenant Id",
        "description": "Unique identifier for your tenant",
        "defaultvalue": "Tenant Id",
      },
      "signatureAlgo": {
        "label": "Signature Algorithm",
        "description": "algorithm used to sign SAML assertions",
        "defaultvalue": "Signature Algorithm",
      },
      "assertionUrl": {
        "label": "Assertion URL",
        "description": "URL where SAML assertions will be sent",
        "defaultvalue": "Assertion URL",
      },
    },
    // SSO Metadata End
  },

  // "settings": {
  "settings": {
    "visualSettings": {
      "label": "Visual Settings",
      "description": "Visual Settings Title",
      "defaultvalue": "Visual Settings"
    },
    "customsSettings": {
      "label": "Customs Settings",
      "description": "Customs Settings Title",
      "defaultvalue": "Customs Settings"
    },
    "timeZone": {
      "label": "Timezone Settings",
      "defaultvalue": "Timezone Settings"
    }
  },
  "notFound": {
    "Page Info": {
      "notFound": {
        "label": "404",
        "description": "Page not found",
        "defaultvalue": "Not Found"
      },
      "notFoundTitle": {
        "label": "Oops! Page not found.",
        "description": "The page you’re looking for doesn’t exist or has been moved.",
        "defaultvalue": "Oops! Page not found."
      },
      "notFoundInfo": {
        "label": "The page you’re looking for doesn’t exist or has been moved.",
        "description": "Information about the missing page.",
        "defaultvalue": "The page you’re looking for doesn’t exist or has been moved."
      },
      "goBack": {
        "label": "Go Back to Home",
        "description": "Button to navigate back to the home page.",
        "defaultvalue": "Go Back to Home"
      }
    },
  },
  "maintenance": {
    "Page Info": {
      "maintenance": {
        "label": "The application cannot start",
        "description": "The configuration file (appsettings.json) is missing.",
        "defaultvalue": "The application cannot start"
      },
      "maintenanceInfo": {
        "label": "The configuration file (appsettings.json) is missing.",
        "description": "Please ensure the file is present in the application directory and try again.",
        "defaultvalue": "The configuration file (appsettings.json) is missing."
      },
      "contactSupport": {
        "label": "Please ensure the file is present in the application directory and try again.",
        "description": "Contact support if the issue persists.",
        "defaultvalue": "Please ensure the file is present in the application directory and try again."
      }
    },
  },

  // }

  // "side menu": {
  "sideMenu": {
    "Dashboard": {
      "dashboard": {
        "label": "Dashboard",
        "description": "Dashboard Description",
        "defaultvalue": "Dashboard"
      },
    },
    "Application Profiles": {
      "applicationProfiles": {
        "label": "Application Profiles",
        "description": "Application Profile Description",
        "defaultvalue": "Application Profiles"
      },
    },
    // "applicationManagement": {
    //   "label": "Application Management",
    //   "description": "Application Management Description",
    //   "defaultvalue": "Application Management"
    // },
    "App Manager": {
      "appManager": {
        "label": "App Manager",
        "description": "App Manager Description",
        "defaultvalue": "App Manager"
      },
    },
    "Analytics": {
      "analytics": {
        "label": "Analytics",
        "description": "Analytics Description",
        "defaultvalue": "Analytics"
      },
    },
    "Roles Management": {
      "rolesManagement": {
        "label": "Roles Management",
        "description": "Roles Description",
        "defaultvalue": "Roles"
      },
    },
    "Tenant Manager": {
      "tenantManager": {
        "label": "Tenant Manager",
        "description": "Tenant Manager Description",
        "defaultvalue": "Tenant Manager"
      },
    },
    "Settings": {
      "settings": {
        "label": "Settings",
        "description": "Settings Description",
        "defaultvalue": "Settings"
      },
      "visualSettings": {
        "label": "Visual Settings",
        "description": "Visual Setting Title",
        "defaultvalue": "Visual Settings"
      },
      "textSettings": {
        "label": "Text Settings",
        "description": "Text Settings Title",
        "defaultvalue": "Text Settings"
      },
      "timezoneSettings": {
        "label": "Timezone Settings",
        "description": "Timezone Settings Title",
        "defaultvalue": "Tiemzone Settings"
      },
      "customsSettings": {
        "label": "Customs Settings",
        "description": "Customs Settings Title",
        "defaultvalue": "Customs Settings"
      }
    },
  }
}


interface ModuleInfo {
  label: string;
  description?: string;
  defaultvalue?: string;
}

type ModuleMapperType = Record<ModuleKey, ModuleInfo>;

export const ModuleMapper: ModuleMapperType = {
  "dashboard": {
    label: "Dashboard"
  },
  "applicationProfiles": {
    label: "Application Profiles",
    description: "User Information",
    defaultvalue: "Application & Roles",

  },
  "analytics": {
    label: "Analytics",
  },
  "appManager": {
    label: "App Manager",
  },
  "rolesManagement": {
    label: "Roles Management",
  },
  "tenantManager": {
    label: "Tenant Manager",
  },
  "settings": {
    label: "Settings",
  },
  "notFound": {
    label: "Not Found",
    description: "Page not found",
    defaultvalue: "Oops! Page not found."
  },
  "maintenance": {
    label: "Maintenance",
    description: "Application cannot start",
    defaultvalue: "The application cannot start"
  },
  "sideMenu": {
    label: "Side Menu",
  },
}