export interface AppSettings {
  ConnectionString?: {
    DefaultConnectionString?: string;
  };
  EncryptionKey?: string;
  AppSettings?: {
    BaseUrlPath?: string;
    WebServicePath?: string;
    Encryption?: string;
    UserSettingsFilePath?: string;
  };
  aesSettings?: {
    AecKey?: string;
    AecIv?: string;
  };
  JwtIssuerOptions?: {
    Issuer?: string;
    Audience?: string;
    JwtClientSecret?: string;
    TokenValidFor?: string;
  };
  AzureAd?: {
    Instance?: string;
    Domain?: string;
    TenantId?: string;
    ClientId?: string;
    CallbackPath?: string;
    MetadataUrl?: string;
    AllowedTenantsForSAML?: string;
  };
  GoogleSettings?: {
    client_id?: string;
    project_id?: string;
    auth_uri?: string;
    token_uri?: string;
    auth_provider_x509_cert_url?: string;
    client_secret?: string;
    redirect_uris?: string;
  };
  clientId?: string;
  ClientSecret?: string;
  [key: string]: any;
}
