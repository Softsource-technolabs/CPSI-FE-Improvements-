"use client"

import { SetStateAction, useState } from "react"
import { ChevronLeft } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { AddApplicationWizard } from "./add-application-wizard"
import { ApplicationSettings } from "./add-application-wizard"
import { toast } from "../../../../components/ui/use-toast"
import { Application } from "./types"
import { ApplicationManagerList } from "../application-manager/application-table"

export default function ApplicationManager() {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [settings, setSettings] = useState<ApplicationSettings | null>(null)
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)

  const handleSelectApplication = (application: Application) => {
    setSelectedApplication(application)
  
    setSettings({
      basicInfo: {
        uniqueNameorId: application.uniqueNameorId,
        displayName: application.displayName,
        shortName: application.displayName,
        shortDescription: application.shortDescription,
        longDescription: application.description,
        category: application.category,
        publisherName: application.publisherName,
        publisherUrl: application.applicationLink,
        tags: application.applicationTag
      },
      urls: {
        launchUrl: application.ssoRedirectUrl
      },
      images: {
        launcherImage: application.launcherImage,
        smallLauncherImage: application.launcherImage,
        bannerImage: application.bannerImagepath
      },
      settings: {
        status: application.status,
        enabled: application.isActive,
        visible: application.isVisible,
        defaultOrgTypeCode: application.defaultOrgTypeCode ?? "",
        enforceAccessControl: false,
        rolesandFeatures: []
      }
    })
  }

  const handleBackToList = () => {
    setSelectedApplication(null)
    setSettings(null)
  }

  const handleAddApplication = (settings: ApplicationSettings) => {
    if (settings) {
      toast({
        title: "Success",
        description: "Application added successfully",
      })
    }
    setIsCreating(false)
  }

  if (isCreating) {
    return (
      <main className="flex-1 w-full max-w-none">
        <div className="w-full py-6 px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setIsCreating(false)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add New Application</h1>
              <p className="text-muted-foreground mt-1">Configure your new application settings</p>
            </div>
          </div>
          <AddApplicationWizard
            onCancel={() => setIsCreating(false)}
            onComplete={handleAddApplication}
            initialData={selectedApplication!} onApplicationCreated={function (createdApp: any): void {
              throw new Error("Function not implemented.")
            } }          />
        </div>
      </main>
    )
  }

  if (!selectedApplication) {
    return (
      <ApplicationManagerList
                        applications={[]}
                        onEdit={(app: SetStateAction<Application | null>) => setEditingApplication(app)}
                        onDelete={() => {}}
                        onToggleEnabled={() => {}}
                        onToggleVisibility={() => {}}
        />
    )
  }

  return (
    <div className="flex-1">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          className="p-2" 
          onClick={handleBackToList}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
      </div>
    </div>
  )
} 