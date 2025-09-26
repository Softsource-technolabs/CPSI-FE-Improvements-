
"use client"

import { useEffect, useState } from "react"
import { PlusCircle, Trash2, ChevronDown, ChevronUp, Edit, Save } from "lucide-react"

import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import { ScrollArea } from "../../../components/ui/scroll-area"
import {mergeWithDefaults} from '../../../utils/utils';
// import { applicationProfiles } from '../../../../src/constants/applicationProfile';
import { encrypt, decrypt } from '../../../utils/aesUtils';

interface Role {
  Name: string
  Id: string
}

interface Organization {
  Name: string
  ParentOrgId: string
  Code: string
  TypeCode: string
  AccessAllAssocSites?: boolean
  Roles: Role[]
}

interface Application {
  Name: string
  Id: string
  Org: Organization[]
}

interface AppProfile {
  RefId: string
  staffrecordId: string
  FirstName: string
  LastName: string
  Email: string
  Phone: string
  PrimaryOrg: string
  PrimaryOrgName: string
  PrimaryRole: string
  Title: string
  xdTouchDate: string
  xdOrgId: string
  Application: Application[]
}

export default function AppProfileForm() {
  // Test handler for AES encryption/decryption
 const handleTestAES = () => {
  // Test with a real object
  const testObj = {
    BaseUrlPath: "https://example.com",
    WebServicePath: "/api",
    Encryption: "AES",
    UserSettingsFilePath: "/settings.json"
  };
  const encrypted = encrypt(JSON.stringify(testObj));
  const decrypted = JSON.parse(decrypt(encrypted));
  console.log("Decrypted Test Object:", decrypted);

  // Still show the string test in alert for UI feedback
  const plainText = "Hello, AES!";
  const encryptedText = encrypt(plainText);
  const decryptedText = decrypt(encryptedText);
  alert(`Original: ${plainText}\nEncrypted: ${encryptedText}\nDecrypted: ${decryptedText}`);
};
  // Sample data based on the provided XML
  const [profile, setProfile] = useState<AppProfile>({
    RefId: "",
    staffrecordId: "Kevin.Seel",
    FirstName: "Kevin",
    LastName: "Seel",
    Email: "",
    Phone: "",
    PrimaryOrg: "",
    PrimaryOrgName: "",
    PrimaryRole: "",
    Title: "",
    xdTouchDate: "",
    xdOrgId: "",
    Application: [
      {
        Name: "Data Validation Dashboard",
        Id: "38",
        Org: [
          {
            Name: "LOS ALAMOS DIST OFFICE",
            ParentOrgId: "041",
            Code: "041",
            TypeCode: "01",
            Roles: [
              { Name: "xyz", Id: "38100" },
              { Name: "abc", Id: "38200" },
              { Name: "efg", Id: "38300" },
            ],
          },
        ],
      },
      {
        Name: "EDUID App",
        Id: "35",
        Org: [
          {
            Name: "Albaq",
            ParentOrgId: "002",
            Code: "021",
            TypeCode: "02",
            Roles: [
              { Name: "xyz", Id: "3510" },
              { Name: "abc", Id: "3520" },
              { Name: "efg", Id: "3350" },
            ],
          },
          {
            Name: "alb1",
            ParentOrgId: "002",
            Code: "031",
            TypeCode: "02",
            Roles: [
              { Name: "xyz", Id: "3510" },
              { Name: "abc", Id: "3520" },
              { Name: "efg", Id: "3350" },
            ],
          },
          {
            Name: "Alb2",
            ParentOrgId: "002",
            Code: "041",
            TypeCode: "02",
            Roles: [
              { Name: "hgf", Id: "3510" },
              { Name: "mkl", Id: "3520" },
              { Name: "cfg", Id: "3350" },
            ],
          },
          {
            Name: "Columbia",
            ParentOrgId: "003",
            Code: "0045",
            TypeCode: "02",
            Roles: [
              { Name: "xyz", Id: "3510" },
              { Name: "abc", Id: "3520" },
              { Name: "efg", Id: "3350" },
            ],
          },
        ],
      },
      {
        Name: "Eng App",
        Id: "16",
        Org: [
          {
            Name: "Albaq",
            ParentOrgId: "002",
            Code: "002",
            TypeCode: "01",
            AccessAllAssocSites: true,
            Roles: [{ Name: "State", Id: "1600" }],
          },
        ],
      },
    ],
  })
  const [textSettings, setTextSettings] = useState<any>({})
  const [expandedApps, setExpandedApps] = useState<Record<string, boolean>>({})
  const [isEditMode, setIsEditMode] = useState(false)

  const toggleAppExpand = (appId: string) => {
    setExpandedApps((prev) => ({
      ...prev,
      [appId]: !prev[appId],
    }))
  }

  const handleSave = () => {
    // Here you would typically send the profile data to your API
    console.log("Saving profile:", profile)
    setIsEditMode(false)
  }

  // useEffect(() => {
  //   const profileTextSettings = localStorage.getItem("textsetting");
  //   if(profileTextSettings){
  //     const profileTextJson = JSON.parse(profileTextSettings)
  //     if(profileTextJson?.applicationProfiles){
  //       const customTexts = mergeWithDefaults(applicationProfiles, profileTextJson?.applicationProfiles || {})
  //       setTextSettings(customTexts)
  //       console.log("customTexts",customTexts)
  //     }
  //     else{
  //       setTextSettings(applicationProfiles)
  //     }
  //   }
  //   else{
  //     setTextSettings(applicationProfiles)
  //   }
  // },[])

 return (
  <div className="w-full py-6 px-6 md:px-8">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold ">
        {textSettings?.applicationProfiles || "Application Profiles"}
      </h1>
      <div className="space-x-2">
        {isEditMode ? (
          <Button onClick={handleSave} className="bg-gray-900 text-white">
            <Save className="mr-2 h-4 w-4" />
            <span className="text-sm md:text-base">Save Changes</span>
          </Button>
        ) : (
          <Button onClick={() => setIsEditMode(true)} className="bg-gray-900 text-white">
            <Edit className="mr-2 h-4 w-4" />
            <span className="text-sm md:text-base">{textSettings?.editProfile || "Edit Profile"}</span>
          </Button>
        )}
      </div>
    </div>

    {/* User Information Summary - Read Only */}
    <Card className="w-full mb-6 border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl">
          {textSettings?.userInfo || "User Information"}
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs md:text-sm font-medium text-muted-foreground">
              {textSettings?.id || "Staff ID"}
            </p>
            <p className="text-sm md:text-base">{profile.staffrecordId}</p>
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-muted-foreground">
              {textSettings?.userName || "Name"}
            </p>
            <p className="text-sm md:text-base">
              {profile.FirstName} {profile.LastName}
            </p>
          </div>
          {profile.Email && (
            <div>
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm md:text-base">{profile.Email}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Applications & Roles Management */}
    <Card className="w-full border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          {textSettings?.appInfo || "Applications & Roles"}
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          Manage the user's application access, organizations, and roles
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full border-gray-200">
        <ScrollArea className="h-[calc(100vh-280px)] w-full pr-4">
          <div className="space-y-6 w-full">
            {profile.Application.map((app, appIndex) => (
              <Collapsible
                key={app.Id}
                open={expandedApps[app.Id]}
                onOpenChange={() => toggleAppExpand(app.Id)}
                className="border rounded-lg w-full border-gray-200"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 rounded-t-lg">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-gray-900 text-white">
                      {app.Id}
                    </Badge>
                    <span className="text-sm md:text-base font-medium">{app.Name}</span>
                  </div>
                  {expandedApps[app.Id] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="w-full">
                  <div className="p-4 pt-0 w-full">
                    <div className="mb-4 flex justify-between items-center">
                      <h4 className="text-sm md:text-base font-medium text-muted-foreground">
                        Organizations & Roles
                      </h4>
                      {isEditMode && (
                        <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-100">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          <span className="text-sm">Add Organization</span>
                        </Button>
                      )}
                    </div>

                    {app.Org.map((org, orgIndex) => (
                      <Card key={`${org.Name}-${orgIndex}`} className="mb-4 w-full border-gray-200">
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base md:text-lg">{org.Name}</CardTitle>
                            {isEditMode && (
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs md:text-sm text-muted-foreground">
                            <div>
                              Code: <span className="font-medium">{org.Code}</span>
                            </div>
                            <div>
                              Parent Org ID: <span className="font-medium">{org.ParentOrgId}</span>
                            </div>
                            <div>
                              Type Code: <span className="font-medium">{org.TypeCode}</span>
                            </div>
                            {org.AccessAllAssocSites && (
                              <Badge variant="secondary" className="text-xs bg-gray-300">
                                Access All Associated Sites
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="py-0 w-full">
                          <div className="w-full overflow-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-gray-200">
                                  <TableHead className="text-sm md:text-base">Role Name</TableHead>
                                  <TableHead className="text-sm md:text-base">Role ID</TableHead>
                                  {isEditMode && (
                                    <TableHead className="w-[100px] text-sm md:text-base">Actions</TableHead>
                                  )}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {org.Roles.map((role, roleIndex) => (
                                  <TableRow className="border-gray-200" key={`${role.Id}-${roleIndex}`}>
                                    <TableCell className="text-sm md:text-base">{role.Name}</TableCell>
                                    <TableCell className="text-sm md:text-base">{role.Id}</TableCell>
                                    {isEditMode && (
                                      <TableCell>
                                        <Button variant="ghost" size="icon">
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      </TableCell>
                                    )}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          {isEditMode && (
                            <div className="mt-4 mb-2">
                              <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-100">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                <span className="text-sm">Add Role</span>
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

            {isEditMode && (
              <Button className="w-full bg-gray-900 text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                <span className="text-sm md:text-base">Add Application</span>
              </Button>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  </div>
);

}

