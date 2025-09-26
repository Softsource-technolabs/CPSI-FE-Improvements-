// import { FieldHelp } from "../../../../tenant-app/src/pages/tenant-manager/field-help";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Switch } from "../../../../components/ui/switch";
import { ApplicationSettings } from "../application-manager/add-application-wizard";


export default function ApplicationSpecificSettingsTab({ settings, onSettingsChange }: { settings: ApplicationSettings, onSettingsChange: (settings: ApplicationSettings) => void }) {
    return (
      <div className="space-y-8"> {/* Use larger spacing between cards */}
  
        {/* Launch URL Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Launch Configuration</CardTitle>
            <CardDescription className="text-sm">
              Set the primary URL used to start the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Application Launch URL - Renamed/Relabeled */}
            <div className="space-y-2">
              <Label htmlFor="appLaunchUrl">Application Launch URL</Label>
              <Input
                id="appLaunchUrl"
                type="url"
                value={settings.urls.launchUrl} // Changed from ssoRedirectUrl
                onChange={(e) => onSettingsChange({
                  ...settings,
                  urls: { ...settings.urls, launchUrl: e.target.value } // Changed state key
                })}
                placeholder="https://app.example.com/start"
                aria-describedby="appLaunchUrl-help"
              />
              {/* <FieldHelp id="appLaunchUrl">
                This is the URL that will be used to launch the application from the app launcher.
              </FieldHelp> */}
            </div>
          </CardContent>
        </Card>
  
        {/* Status & Activation Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status & Activation</CardTitle>
            <CardDescription className="text-sm">
              Control the application's current status, activity, and visibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Dropdown - Moved here */}
            <div className="space-y-2">
              <Label htmlFor="appStatus">Status</Label>
              <select
                id="appStatus"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-md"
                value={settings.settings.status} // State path updated
                onChange={(e) => onSettingsChange({
                  ...settings,
                  settings: { ...settings.settings, status: e.target.value as ApplicationSettings['settings']['status'] } // State path updated
                })}
                aria-describedby="appStatus-help"
                aria-label="Application Status"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="beta">Beta</option>
                <option value="deprecated">Deprecated</option>
                <option value="delete">Delete</option>
              </select>
              {/* <FieldHelp id="appStatus">
                Select the current status of the application.
              </FieldHelp> */}
            </div>
  
            {/* Toggles in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Active Toggle - Moved here */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-1">
                  <Label htmlFor="appActive" className="text-base font-medium">Active</Label>
                  <p className="text-sm text-gray-500">
                    Mark the application as active or inactive.
                  </p>
                </div>
                <Switch
                  id="appActive"
                  checked={settings.settings.enabled} // Uses 'enabled' state
                  onCheckedChange={(checked: boolean) => onSettingsChange({
                    ...settings,
                    settings: { ...settings.settings, enabled: checked }
                  })}
                  aria-label="Mark application as active or inactive"
                />
              </div>
  
              {/* Visible Toggle - Moved here */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-1">
                  <Label htmlFor="appVisible" className="text-base font-medium">Visible</Label>
                  <p className="text-sm text-gray-500">
                    Mark the application as visible or invisible in the launcher.
                  </p>
                </div>
                <Switch
                  id="appVisible"
                  checked={settings.settings.visible}
                  onCheckedChange={(checked: boolean) => onSettingsChange({
                    ...settings,
                    settings: { ...settings.settings, visible: checked }
                  })}
                  aria-label="Set application visibility"
                />
              </div>
            </div>
          </CardContent>
        </Card>
  
        {/* Access Control Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Access Control</CardTitle>
            <CardDescription className="text-sm">
              Configure if access control should be enforced for this application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Enforce Access Control Toggle - Added here */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-1">
                <Label htmlFor="appEnforceAccess" className="text-base font-medium">Enforce Access Control</Label>
                <p className="text-sm text-gray-500">
                  If enabled, user permissions will be checked before launch.
                </p>
              </div>
              <Switch
                id="appEnforceAccess"
                checked={settings.settings.enforceAccessControl}
                onCheckedChange={(checked: boolean) => onSettingsChange({
                  ...settings,
                  settings: { ...settings.settings, enforceAccessControl: checked }
                })}
                aria-label="Enable or disable access control enforcement for this application"
              />
            </div>
          </CardContent>
        </Card>
  
      </div>
    )
  }