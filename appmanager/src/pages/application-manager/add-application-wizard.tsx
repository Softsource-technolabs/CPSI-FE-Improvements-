//@ts-nocheck

import { AppWindow, Globe, Image, Settings, Tag, Plus, Trash2, Loader2, Info } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Switch } from "../../../../components/ui/switch"
import { useState, useRef, useEffect, use } from "react"
// import { FieldHelp } from "../../../../tenant-app/src/pages/tenant-manager/field-help"
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from "react-hook-form"
import { Application } from "./types"
import { IconTabs } from "../../../../components/ui/icon-tabs"
import { Checkbox } from "../../../../components/ui/checkbox"
import { mergeWithDefaults } from '../../../../utils/utils';
import axios from 'axios';
// import { appManager } from '../../../../src/constants/appManager'
import { Select, SelectContent, SelectTrigger } from "../../../../components/ui/select"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react'
import Swal from "sweetalert2"
import ApiService from '../../../../services/api-service';
import { AxiosRequestHeaders } from 'axios';

const ToastStyles = {
  toast: "rounded-lg shadow-lg p-4 max-w-xs text-sm transition-all duration-300",
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
  warning: "bg-yellow-500 text-black",
  icon: "inline-block mr-2 w-5 h-5",
  message: "text-white"
};

// const ImagePattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i
const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i

const basicInfoSchema = Yup.object({
  basicInfo: Yup.object({
    uniqueNameorId: Yup.string()
      .required("Unique Name/ID is required.")
      .max(450, "Unique Name/ID must not exceed 450 characters.")
      .matches(/^[a-z0-9]+$/, "Unique Name/ID must be lowercase and contain no spaces."),
    displayName: Yup.string()
      .required("Display Name is required.")
      .max(100, "Display Name must not exceed 100 characters."),
    shortName: Yup.string()
      .required("Short Name is required.")
      .max(50, "Short Name must not exceed 50 characters."),
    shortDescription: Yup.string()
      .required("Short Description is required.")
      .max(250, "Short Description must not exceed 250 characters."),
    longDescription: Yup.string()
      .required("Long Description is required.")
      .max(1000, "Long Description must not exceed 1000 characters."),
    category: Yup.array()
      .required("category is required.")
      .of(Yup.string().max(500, "Each category must not exceed 500 characters."))
      .max(100, "Category must not exceed 500 characters."),
    publisherName: Yup.string()
      .required("Publisher Name is required.")
      .max(100, "Publisher Name must not exceed 100 characters."),
    publisherUrl: Yup.string()
      .required("Publisher URL is required.")
      .matches(urlPattern, "Publisher URL must be a valid URL."),
    tags: Yup.array()
      .required("Tags must be required.")
      .of(Yup.string().max(50, "Each tag must not exceed 50 characters."))
      .max(10, "You can add up to 10 tags."),
  }),
});

const urlSchema = Yup.object({
  urls: Yup.object({
    launchUrl: Yup.string()
      .required("Launch URL is required.")
      .matches(urlPattern, "Launch URL must be a valid URL."),
  }),
})

const settingSchema = Yup.object({
  settings: Yup.object({
    status: Yup.string()
      .oneOf(["active", "inactive", "beta", "deprecated"], "Invalid status value.")
      .required("Status is required."),
    enforceAccessControl: Yup.boolean(),
    enabled: Yup.boolean(),
    visible: Yup.boolean(),
    rolesandFeatures: Yup.array()
    .of(
      Yup.object({
        id: Yup.string().required("Role ID is required."),
        name: Yup.string()
          .required("Role name is required.")
          .min(1, "Role name cannot be empty."),
        description: Yup.string()
          .required("Role description is required.")
          .min(1, "Role description cannot be empty."),
        features: Yup.array()
          .of(
            Yup.object({
              // id: Yup.string().required("Feature ID is required."),
              key: Yup.string().required("Feature key is required."),
              value: Yup.string().required("Feature value is required."),
            })
          )
          .required("Features are required.")
          .min(1, "At least one feature is required."),
      })
    )
    .required("At least one role is required.")
    .min(1, "At least one role must be added."),
  }),
})

const imageSchema = Yup.object({
  // images: Yup.object({
  //   launcherImage: Yup
  //     .object()
  //     .nullable()
  //     .required("Launcher Image must be a valid URL."),
  //   smallLauncherImage: Yup
  //           .object()
  //     .nullable()
  //     .required("Small Launcher Image must be a valid URL."),
  //   bannerImage: Yup
  //     .object()
  //     .nullable()
  //     .required("Banner Image must be a valid URL.")
  // }),
})

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});


interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ApplicationResponse extends ApiResponse<number> {
  data: number; // ID of created/updated application
}

interface ImageUploadResponse extends ApiResponse<null> {
  success: boolean;
}
export interface ApplicationSettings {
  basicInfo: {
    uniqueNameorId: string
    displayName: string
    shortName: string
    shortDescription: string
    longDescription: string
    category: string[];
    publisherName: string
    publisherUrl: string
    tags: string[]

  }
  urls: {
    launchUrl: string
  }
  images: {
    launcherImage: string
    smallLauncherImage: string
    bannerImage: string
  }
  settings: {
    status: "active" | "inactive" | "beta" | "delete"
    enabled: boolean
    visible: boolean
    defaultOrgTypeCode: string
    enforceAccessControl: boolean
    rolesandFeatures: ApplicationRole[]
  }
}

interface Feature {
  id: string;
  name: string;
  value: string;
}

interface ApplicationRole {
  id: string;
  name: string;
  description: string;
  features: Feature[];
}

interface AddApplicationWizardProps {
  onCancel: () => void
  onComplete: (settings: ApplicationSettings) => void
  onApplicationCreated: (createdApp: any) => void
  initialData?: Application
  isEditMode?: boolean
}

export function AddApplicationWizard({ onCancel, onComplete, onApplicationCreated, initialData, isEditMode = false }: AddApplicationWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [currentTab, setCurrentTab] = useState("Enter application details and description");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [init, setInit] = useState(false);
  const [locationDetails, setLocationDetails] = useState<any>({})
  const [systemInfo, setSystemInfo] = useState<any>({})
  const [ipaddress, setIpAddress] = useState<any>(null)
   

  const [imagesObjs, setImageObjs] = useState<{
    LargeIcon: File | null | string;
    SmallIcon: File | null | string;
    BannerImage: File | null | string;
  }>({
    LargeIcon: null,
    SmallIcon: null,
    BannerImage: null
  })

  const validationArr = [
    basicInfoSchema,
    urlSchema,
    imageSchema,
    settingSchema
  ];

  console.log("Validation Attay of current steps", validationArr[currentStep])

  const [settings, setSettings] = useState<ApplicationSettings>({
    basicInfo: {
      uniqueNameorId: "",
      displayName: "",
      shortName: "",
      shortDescription: "",
      longDescription: "",
      category: [],
      publisherName: "",
      publisherUrl: "",
      tags: []
    },
    urls: {
      launchUrl: ""
    },
    images: {
      launcherImage: "/placeholder.svg?height=80&width=80",
      smallLauncherImage: "/placeholder.svg?height=40&width=40",
      bannerImage: "/placeholder.svg?height=400&width=800"
    },
    settings: {
      status: "active" as const,
      enabled: true,
      visible: true,
      defaultOrgTypeCode: "01",
      enforceAccessControl: true,
      rolesandFeatures: [
        {
          id: crypto.randomUUID(),
          name: "",
          description: "",
          features: [
            {
              id: crypto.randomUUID(),
              name: "",
              value: ""
            }
          ]
        }
      ]
    }
  })

  useEffect(() => {
    const sysdetail = localStorage.getItem('system') || "";
    const ipdetails = localStorage.getItem('ipaddress') || "";
    const location = localStorage.getItem('location') || "";
    const userId = localStorage.getItem('userId') || "";

    try {
      setSystemInfo(sysdetail ? JSON.parse(sysdetail) : {});
    } catch (error) {
      console.error("Invalid JSON in 'system':", error);
      setSystemInfo({});
    }

    setIpAddress(ipdetails);

    try {
      setLocationDetails(location ? JSON.parse(location) : {});
    } catch (error) {
      console.error("Invalid JSON in 'location':", error);
      setLocationDetails({});
    }

    const handleChangeListner = (isDirty: boolean) => {
      window.dispatchEvent(new CustomEvent("tenantUnsavedChanges", { detail: isDirty }));
    };

    if (init) {
      handleChangeListner(true);
    } else {
      setInit(true);
    }

    return () => {
      handleChangeListner(false);
    };
  }, [settings]);


  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues
  } = useForm<ApplicationSettings>({
    resolver: yupResolver(validationArr[currentStep] as any),
    defaultValues: settings,
    mode: "onChange"
  })

  console.log("errors", errors);

  useEffect(() => {
    if (isEditMode && initialData) {
      let categories: string[] = [];
      if (initialData.category) {
        const categoryValue = initialData.category as unknown;
        if (typeof categoryValue === 'string') {
          categories = categoryValue.split(', ');
        } else if (Array.isArray(categoryValue)) {
          categories = categoryValue as string[];
        }
      }
      // tags
      let tags: string[] = [];
      if (initialData.applicationTag) {
        const tagValue = initialData.applicationTag as unknown;
        if (typeof tagValue === 'string') {
          tags = tagValue.split(', ');
        } else if (Array.isArray(tagValue)) {
          tags = tagValue as string[];
        }
      }

      // const rolesandFeatures = (initialData?.rolesandFeatures as ApplicationRole[])?.map(role => ({
      //   id: role.id,
      //   name: role.name,
      //   description: role.description,
      //   features: role.features?.map(f => ({
      //     id: f.id,
      //     name: f.name,
      //     value: f.value
      //   })) || []
      // })) || [];

      const obj: ApplicationSettings = {
        basicInfo: {
          uniqueNameorId: initialData?.uniqueNameorId || "",
          displayName: initialData?.displayName || "",
          shortName: initialData?.shortName || "",
          shortDescription: initialData?.shortDescription || "",
          longDescription: initialData?.description || "",
          category: categories,
          publisherName: initialData?.publisherName || "",
          publisherUrl: initialData?.applicationLink || "",
          tags: tags,
        },
        urls: {
          launchUrl: initialData?.launchUrl || ""
        },
        images: {
          launcherImage: initialData?.largeIconpath || "",
          smallLauncherImage: initialData?.smallIconpath || "/placeholder.svg?height=40&width=40",
          bannerImage: initialData?.bannerImagepath || "/placeholder.svg?height=400&width=800"
        },
        settings: {
          status: "active" as const,
          enabled: true,
          visible: true,
          defaultOrgTypeCode: "01",
          enforceAccessControl: true,
          rolesandFeatures: initialData?.rolesandFeatures || []
        }
      }

      setImageObjs({
        LargeIcon: initialData?.largeIconpath,
        SmallIcon: initialData?.smallIconpath,
        BannerImage: initialData?.bannerImagepath
      })

      setValue('basicInfo', {
        uniqueNameorId: initialData?.uniqueNameorId || "",
        displayName: initialData?.displayName || "",
        shortName: initialData?.shortName || "",
        shortDescription: initialData?.shortDescription || "",
        longDescription: initialData?.description || "",
        category: categories,
        publisherName: initialData?.publisherName || "",
        publisherUrl: initialData?.applicationLink || "",
        tags: tags,
      });

      setValue('urls', {
        launchUrl: initialData?.launchUrl || ""
      })

      setValue('images', {
        launcherImage: initialData?.launcherImage || "",
        smallLauncherImage: initialData?.smallLauncherImage || "/placeholder.svg?height=40&width=40",
        bannerImage: initialData?.bannerImagepath || "/placeholder.svg?height=400&width=800"
      })

      setValue('settings', {
        status: "active" as const,
        enabled: true,
        visible: true,
        defaultOrgTypeCode: "01",
        enforceAccessControl: true,
        rolesandFeatures: initialData?.rolesandFeatures || []
      })

      setSettings(obj);
    }
  }, [])

  const methods = useForm({
    defaultValues: settings,
  });

  const tabs = [
    {
      label: "General Application Information",
      value: "Enter application details and description",
      icon: AppWindow,
      content: (
        <GeneralInfoTab
          settings={settings}
          onSettingsChange={setSettings}
          validationErrors={errors}
          control={control}
          handleSubmit={handleSubmit}
          setValue={setValue}
          isEditMode={isEditMode}
        />
      ),
    },
    {
      label: "Application Specific Settings",
      value: "Configure application URLs",
      icon: Globe,
      content: (
        <ApplicationSpecificSettingsTab
          settings={settings}
          onSettingsChange={setSettings}
          validationErrors={errors}
          control={control}
          handleSubmit={handleSubmit}
          setValue={setValue}
          isEditMode={isEditMode}
        />
      ),
    },
    {
      label: "Images",
      value: "Upload application images",
      icon: Image,
      content: (
        <ImagesTab
          settings={settings}
          onSettingsChange={setSettings}
          validationErrors={errors}
          control={control}
          handleSubmit={handleSubmit}
          setValue={setValue}
          isEditMode={isEditMode}
          setImageObjs={setImageObjs}
        />
      ),
    },
    {
      label: "Default Application Roles",
      value: "Configure default application roles",
      icon: Settings,
      content: (
        <SettingsTab
          settings={settings}
          onSettingsChange={setSettings}
          validationErrors={errors}
          control={control}
          handleSubmit={handleSubmit}
          setValue={setValue}
          isEditMode={isEditMode}
        />
      ),
    }
  ]

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === tabs.length - 1

  const tabMapper = [
    'Enter application details and description',
    'Configure application URLs',
    'Upload application images',
    'Configure default application roles',
  ]

  const handleNext = async () => {
    try {
      // await methods.trigger();
      setCurrentStep((prev) => prev + 1);
      const index = tabMapper?.indexOf(currentTab);
      if (index !== 3) {
        setCurrentTab(tabMapper[index + 1])
      }
    } catch (err) {
      console.log("Validation errors:", err);
    }
    if (!isLastStep) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      // const currentTab = currentStep - 1;
      setCurrentStep(currentStep - 1)
      const index = tabMapper?.indexOf(currentTab);
      if (index !== 0) {
        setCurrentTab(tabMapper[index - 1])
      }
    }
  }

  const statusMap: { [key: string]: number } = {
    active: 1,
    inactive: 2,
    beta: 3,
    delete: 4
  };

  const userId = localStorage.getItem('userId') || "";

  const handleFinish = async () => {

     Swal.fire({
            title: "Loading...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

    const requestBody = {
      id: isEditMode ? initialData?.id : undefined, // Add ID for edit mode
      uniqueNameorId: settings.basicInfo.uniqueNameorId,
      displayName: settings.basicInfo.displayName,
      shortName: settings.basicInfo.shortName,
      description: settings.basicInfo.longDescription,
      shortDescription: settings.basicInfo.shortDescription,
      category: settings.basicInfo.category.join(", "),
      publisherName: settings.basicInfo.publisherName,
      applicationLink: settings.basicInfo.publisherUrl,
      applicationTag: settings.basicInfo.tags.join(", "),
      launchUrl: settings.urls.launchUrl,
      status: statusMap[settings.settings.status] ?? 0,
      enforceAccessControl: settings.settings.enforceAccessControl,
      smallIconpath: "",
      largeIconpath: "",
      bannerImagepath: "",
      isVisible: settings.settings.visible,
      isActive: settings.settings.enabled,
      isDeleted: false,
      rolesandFeatures: settings.settings.rolesandFeatures.map((role) => ({
        name: role.name,
        description: role.description,
        features: role.features.map((f) => ({
          name: f.name,
          value: f.value
        }))
      }))
    };

    try {
      if (isEditMode && initialData?.id) {
        const response = await ApiService.put<ApplicationResponse>(
          `api/Applications/UpdateApplication/${initialData.id}`,
          requestBody,
        );

        console.log('Update Response:', response);

        if (response.success) {
          // Handle image upload for edit mode if needed
          if (imagesObjs && Object.keys(imagesObjs).some(key => imagesObjs[key as keyof typeof imagesObjs])) {
            const formData = new FormData();
            Object.keys(imagesObjs).forEach((key) => {
              const value = imagesObjs[key as keyof typeof imagesObjs];
              if (value && value instanceof File) {  // Only append if it's a File object
                formData.append(key, value);
              }
            });
            formData.append('Id', initialData.id.toString());

            try {
              await axios.post(
                "https://portal4all.com/AuthBridgeDev/api/Applications/AddApplicationImages",
                formData,
                {
                  headers: {
                    'X-System-location-Info': JSON.stringify({
                      location: locationDetails,
                      system: systemInfo,
                      ipaddress
                    }),
                  }
                });
            } catch (imageError) {
              console.error('Error uploading images:', imageError);
            }
          }

          Toast.fire({
            icon: 'success',
            title: response.message || 'The application was updated successfully!',
            timer: 5000,
            timerProgressBar: true,
          });

          // Swal.fire({
          //   icon: 'success',
          //   title: 'Application Updated',
          //   text: response.message || 'The application was updated successfully!',
          //   confirmButtonColor: '#3085d6',
          //   confirmButtonText: 'OK'
          // });

          // Pass the updated application data back
          const updatedApp = {
            basicInfo: {
              uniqueNameorId: requestBody.uniqueNameorId,
              displayName: requestBody.displayName,
              shortName: requestBody.shortName,
              shortDescription: requestBody.shortDescription,
              longDescription: requestBody.description,
              category: requestBody.category.split(", "),
              publisherName: requestBody.publisherName,
              publisherUrl: requestBody.applicationLink,
              tags: requestBody.applicationTag.split(", ")
            },
            urls: {
              launchUrl: requestBody.launchUrl
            },
            images: {
              launcherImage: requestBody.largeIconpath,
              smallLauncherImage: requestBody.smallIconpath,
              bannerImage: requestBody.bannerImagepath
            },
            settings: {
              status: requestBody.status === 1 ? "active" as const :
                requestBody.status === 0 ? "inactive" as const :
                  requestBody.status === 2 ? "beta" as const : "delete" as const,
              enabled: requestBody.isActive,
              visible: requestBody.isVisible,
              defaultOrgTypeCode: "01",
              enforceAccessControl: requestBody.enforceAccessControl,
              rolesandFeatures: requestBody.rolesandFeatures.map(role => ({
                id: crypto.randomUUID(),
                name: role.name,
                description: role.description,
                features: role.features.map(feature => ({
                  id: crypto.randomUUID(),
                  name: feature.name,
                  value: feature.value
                }))
              }))
            }
          };

          onApplicationCreated(updatedApp);
          onComplete(updatedApp);
        } else {
          throw new Error(response.message || 'Update failed');
        }
        return;
      }

      // CREATE mode
      try {
        // First create the application
        const createResponse = await ApiService.post<ApplicationResponse>(
          "/api/Applications/AddApplication",
          {
            uniqueNameorId: settings.basicInfo.uniqueNameorId,
            displayName: settings.basicInfo.displayName,
            shortName: settings.basicInfo.shortName,
            description: settings.basicInfo.longDescription,
            shortDescription: settings.basicInfo.shortDescription,
            category: settings.basicInfo.category.join(", "),
            publisherName: settings.basicInfo.publisherName,
            applicationLink: settings.basicInfo.publisherUrl,
            applicationTag: settings.basicInfo.tags.join(", "),
            launchUrl: settings.urls.launchUrl,
            status: statusMap[settings.settings.status] ?? 0,
            enforceAccessControl: settings.settings.enforceAccessControl,
            smallIconpath: "",
            largeIconpath: "",
            bannerImagepath: "",
            isVisible: settings.settings.visible,
            isActive: settings.settings.enabled,
            isDeleted: false,
            rolesandFeatures: settings.settings.rolesandFeatures.map(role => ({
              name: role.name,
              description: role.description,
              features: role.features.map(feature => ({
                name: feature.name,
                value: feature.value
              }))
            }))
          }
        );

        if (createResponse.success) {
          const createdAppId = createResponse.data;
          console.log("Application created successfully:", createdAppId);
          console.log("Created Application", imagesObjs);
          // Only attempt image upload if we have images
          if (imagesObjs && Object.keys(imagesObjs).some(key => imagesObjs[key as keyof typeof imagesObjs])) {
            const formData = new FormData();

            Object.keys(imagesObjs).forEach((key) => {
              const value = imagesObjs[key as keyof typeof imagesObjs];
              if (value && value instanceof File) {
                formData.append(key, value);
              }
            });

            formData.append('Id', createdAppId.toString());
            console.log("Fomr DATA", formData)

            try {
              await axios.post(
                "https://portal4all.com/AuthBridgeDev/api/Applications/AddApplicationImages",
                formData,
                {
                  headers: {
                    'X-System-location-Info': JSON.stringify({
                      location: locationDetails,
                      system: systemInfo,
                      ipaddress
                    }),
                  }
                });
            } catch (imageError) {
              console.error('Error uploading images:', imageError);
            }
          }

          Toast.fire({
            icon: 'success',
            title: createResponse.message || 'The application was created successfully!',
            timer: 5000,
            timerProgressBar: true,
          });

          // Swal.fire({
          //   icon: 'success',
          //   title: 'Application Created',
          //   text: createResponse.message || 'The application was created successfully!',
          //   confirmButtonColor: '#3085d6',
          //   confirmButtonText: 'OK'
          // });

          // Return the created application
          const createdApp = {
            basicInfo: {
              uniqueNameorId: settings.basicInfo.uniqueNameorId,
              displayName: settings.basicInfo.displayName,
              shortName: settings.basicInfo.shortName,
              shortDescription: settings.basicInfo.shortDescription,
              longDescription: settings.basicInfo.longDescription,
              category: settings.basicInfo.category,
              publisherName: settings.basicInfo.publisherName,
              publisherUrl: settings.basicInfo.publisherUrl,
              tags: settings.basicInfo.tags
            },
            urls: settings.urls,
            images: settings.images,
            settings: {
              ...settings.settings,
              rolesandFeatures: settings.settings.rolesandFeatures.map(role => ({
                id: crypto.randomUUID(),
                name: role.name,
                description: role.description,
                features: role.features.map(feature => ({
                  id: crypto.randomUUID(),
                  name: feature.name,
                  value: feature.value
                }))
              }))
            }
          };

          onApplicationCreated(createdApp);
          onComplete(createdApp);
        } else {
          throw new Error(createResponse.message || 'Failed to create application');
        }
      } catch (error: any) {
        console.error('Error creating application:', error.response?.data || error);
        throw error;
      }
    } catch (error: any) {
      console.error('Error details:', error.response?.data || error);

      Toast.fire({
        icon: 'error',
        title: isEditMode ? 'Update Failed' : 'Creation Failed',
        text: error.response?.data?.message || 'Something went wrong while saving the application. Please check the console for more details.',
        timer: 5000,
        timerProgressBar: true,
      });

      // Swal.fire({
      //   icon: 'error',
      //   title: isEditMode ? 'Update Failed' : 'Creation Failed',
      //   text: error.response?.data?.message || 'Something went wrong while saving the application. Please check the console for more details.',
      //   confirmButtonColor: '#d33'
      // });
    } finally {
       Swal.close();
    }
  };

  const CurrentStepComponent = tabs[currentStep].content

  useEffect(() => {
    const handleChangeListner = (isDirty: Boolean) => {
      window.dispatchEvent(new CustomEvent("tenantUnsavedChanges", { detail: isDirty }));
    };
    if (init) {
      handleChangeListner(true);
    }
    else {
      setInit(true)
    }
    return () => {
      handleChangeListner(false);
    };
  }, [settings])

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Application Name Header */}
      {!isEditMode && settings.basicInfo.displayName && (
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {settings.basicInfo.displayName}
            </h2>
            {settings.basicInfo.uniqueNameorId && (
              <p className="text-sm text-gray-500">
                {settings.basicInfo.uniqueNameorId}
              </p>
            )}
          </div>
        </div>
      )}

      {/* IconTabs Component */}
      {isEditMode && (
        <CardContent className="p-0">
          <IconTabs tabs={tabs} defaultValue={currentTab} onChange={(tab) => {
            // setCurrentStep
            setCurrentStep(tabMapper?.indexOf(tab))
            setCurrentTab(tab)
          }} />
        </CardContent>
      )}

      {/* Progress Steps */}
      {!isEditMode && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-8 mb-8">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div
                  key={index}
                  className={`
                        relative flex flex-col items-center
                        ${index !== tabs.length - 1 ? 'after:absolute after:top-5 after:left-[calc(50%+24px)] after:w-[calc(100%-48px)] after:h-[2px]' : ''}
                        ${isCompleted ? 'after:bg-blue-600' : 'after:bg-gray-200'}
                      `}
                >
                  <div
                    className={`
                          relative flex items-center justify-center w-10 h-10 rounded-full mb-3
                          ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                        isCompleted ? 'bg-blue-600 text-white' :
                          'bg-gray-100 text-gray-500 border border-gray-200'}
                          transition-all duration-200
                        `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-center space-y-1 max-w-[150px]">
                    <p className={`text-sm font-semibold leading-none ${isActive ? 'text-blue-600' :
                      isCompleted ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                      {tab.label}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight">{tab.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Step Content - Avoid duplicate rendering in edit mode */}
      <FormProvider {...methods}>
        {!isEditMode && (
          <div className="bg-white rounded-lg">
            {CurrentStepComponent}
          </div>
        )}
      </FormProvider>

      {/* Navigation Buttons */}
      <div
        className="
    flex flex-row 
    items-center 
    justify-between 
    gap-2 pt-4
  "
      >
        {/* Cancel / Back Button */}
        <Button
          variant="outline"
          onClick={isFirstStep ? onCancel : handleBack}
          className="text-sm px-4 py-2"
        >
          {isFirstStep ? "Cancel" : "Back"}
        </Button>

        {/* Continue / Create Button */}
        {!isLastStep && (
          <Button
            onClick={handleSubmit(handleNext)}
            className="bg-gray-900 text-white text-sm px-4 py-2"
          >
            Continue
          </Button>
        )}

        {isLastStep && (
          <Button
            onClick={handleSubmit(handleFinish)}
            className="bg-gray-900 text-white text-sm px-4 py-2"
          >
            {isEditMode ? "Update Application" : "Create Application"}
          </Button>
        )}
      </div>
    </div>
  )
}

// Tab Components
function GeneralInfoTab({
  settings,
  onSettingsChange,
  validationErrors,
  control,
  handleSubmit,
  setValue,
  isEditMode
}: {
  settings: ApplicationSettings,
  onSettingsChange: (settings: ApplicationSettings) => void,
  validationErrors?: any,
  control: any,
  handleSubmit: any,
  setValue: any
  isEditMode: boolean;
}) {
  const [isNameValid, setIsNameValid] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<{ id: number, value: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState(settings.basicInfo.category || []);
  const [nameError, setNameError] = useState("");
  const [validationStatus, setValidationStatus] = useState<"idle" | "validating" | "valid" | "invalid" | undefined>();
  const [textSettings, setTextSettings] = useState<any>({})
  const [locationDetails, setLocationDetails] = useState<any>({})
  const [systemInfo, setSystemInfo] = useState<any>({})
  const [ipaddress, setIpAddress] = useState<any>(null)

  // const {
  //   handleSubmit,
  //   formState: { errors },
  //   control,
  // } = useForm({
  //   defaultValues: {
  //     basicInfo: settings.basicInfo,
  //   },
  //   resolver: yupResolver(validationSchema),
  // });

  useEffect(() => {
    const sysdetail = localStorage.getItem('system') || ""
    const ipdetails = localStorage.getItem('ipaddress') || ""
    const location = localStorage.getItem('location') || ""
    setSystemInfo(JSON.parse(sysdetail))
    setIpAddress(ipdetails)
    setLocationDetails(JSON.parse(location))
  }, [])

  // useEffect(() => {
  //   const appManagerTextSettings = localStorage.getItem("textsetting");
  //   if (appManagerTextSettings) {
  //     const appManagerTextJson = JSON.parse(appManagerTextSettings)
  //     if (appManagerTextJson?.appManager) {
  //       const customTexts = mergeWithDefaults(appManager, appManagerTextJson?.appManager || {})
  //       setTextSettings(customTexts)
  //     }
  //     else {
  //       setTextSettings(appManager)
  //     }
  //   }
  //   else {
  //     setTextSettings(appManager)
  //   }
  // }, [])

  const onValidate = async () => {
    const name = settings.basicInfo.uniqueNameorId?.trim();

    if (!name) {
      setValidationStatus("invalid");
      setNameError("Application name cannot be empty.");
      return;
    }

    setValidationStatus("validating");

    try {
      const encodedName = encodeURIComponent(name);
      const response = await fetch(
        `https://portal4all.com/AuthBridgeDev/api/Applications/CheckApplicationExists/${encodedName}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-System-location-Info': JSON.stringify({
              location: locationDetails,
              system: systemInfo,
              ipaddress
            }),
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check application name");
      }

      const result = await response.json();

      if (result.success === false) {
        // Name is duplicate
        setValidationStatus("invalid");
        setNameError("Application name already exists.");
        setIsDuplicate(true);
        setIsNameValid(false);
      } else {
        // Name is available — no error
        setValidationStatus("valid");
        setNameError("");
        setIsDuplicate(false);
        setIsNameValid(true);
      }
    } catch (error) {
      setValidationStatus("invalid");
      setNameError("An error occurred while validating.");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Ensure all required data is available
        if (!locationDetails || !systemInfo || !ipaddress) {
          console.log("System info not ready yet");
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          "X-System-location-Info": JSON.stringify({
            location: {
              ...locationDetails,
              ipaddress, // ensure ipaddress is included
            },
            system: systemInfo,
            IsAdminApp: true, // required by backend
          }),
        };

        const response = await axios.get(
          "https://portal4all.com/AuthBridgeDev/api/ApplicationCategory/GetAll",
          { headers }
        );

        console.log("Application Categories", response.data);

        const categories = response.data.data;
        const uniqueOptions = new Map();

        categories.forEach((cat: any) => {
          uniqueOptions.set(cat.name, { id: cat.id, value: cat.name });
        });

        const categoryArray = Array.from(uniqueOptions.values());
        localStorage.setItem("categories", JSON.stringify(categoryArray));
        setCategoryOptions(categoryArray);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    if (locationDetails && systemInfo && ipaddress) {
      fetchCategories();
    }
  }, [locationDetails, systemInfo, ipaddress]);


  useEffect(() => {
    if (settings?.basicInfo?.category) {
      setSelectedCategories(settings.basicInfo.category);
    }
  }, [settings?.basicInfo?.category]);

  const toggleCategory = (value: string) => {
    const updated = selectedCategories.includes(value)
      ? selectedCategories.filter((c) => c !== value)
      : [...selectedCategories, value];
    onSettingsChange({
      ...settings,
      basicInfo: {
        ...settings.basicInfo,
        category: updated,
      },
    });
  };

  const removeCategory = (value: string) => {
    const updated = selectedCategories.filter((c) => c !== value);
    onSettingsChange({
      ...settings,
      basicInfo: {
        ...settings.basicInfo,
        category: updated,
      },
    });
  };

  const errors = validationErrors
  const isHideErrors = isEditMode ? false : !isNameValid || isDuplicate

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(() => { })(); }}>
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        <div className="space-y-4">
          {/* Application Unique Name/ID */}
          <div className="space-y-2">
            <Label htmlFor="appName">{textSettings?.UniqueName || "Application Unique Name/ID"}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="appName"
                value={settings.basicInfo.uniqueNameorId}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().replace(/\s+/g, '');
                  setValue('basicInfo.uniqueNameorId', value);
                  onSettingsChange({
                    ...settings,
                    basicInfo: { ...settings.basicInfo, uniqueNameorId: value }
                  });

                  // Reset validation state when user types
                  setIsNameValid(false);
                  setValidationStatus(undefined);
                  if (value.trim() !== "") {
                    setNameError("");
                  }
                }}
                onBlur={onValidate}  // << This triggers validation on blur
                placeholder="e.g. myapp-unique-id"
                className="flex-1"

              />
              <Button
                type="button"
                onClick={onValidate}
                // disabled={validationStatus === "validating" || validationStatus === "valid"}
                variant={validationStatus === "valid" ? "default" : "secondary"}
                className={`cursor-pointer px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white-400 disabled:opacity-50
        ${validationStatus === "validating"
                    ? "bg-black text-white"
                    : validationStatus === "valid"
                      ? "!bg-gray-800 text-white"
                      : "bg-gray-900 text-white hover:bg-gray-200"}
      `}
              // disabled={validationStatus === "validating"}
              >
                {validationStatus === "validating" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating
                  </>
                ) : validationStatus === "valid" ? (
                  "Validated"
                ) : (
                  "Validate"
                )}
              </Button>
            </div>
            {/* {nameError && (
              <p className="text-red-500 text-sm">{nameError}</p>
            )} */}
            {
              nameError || validationErrors?.basicInfo?.uniqueNameorId?.message ? <p className="text-red-500 text-sm">{nameError || validationErrors?.basicInfo?.uniqueNameorId?.message}</p> : ""
            }

            {/* <FieldHelp className="text-gray-500" id="appName">
              A short, unique identifier for the application (lowercase, no spaces).
            </FieldHelp> */}
          </div>

          {/* Application Display Name */}
          <div className="space-y-2">
            <Label htmlFor="appDisplayName">{textSettings?.displayName || "Application Display Name"}</Label>
            <Input
              disabled={isEditMode ? false : !isNameValid || isDuplicate}
              id="appDisplayName"
              value={settings.basicInfo.displayName}
              onChange={(e) => {
                const value = e.target.value;
                setValue('basicInfo.displayName', value);
                onSettingsChange({
                  ...settings,
                  basicInfo: { ...settings.basicInfo, displayName: value }
                });
              }}
              onBlur={onValidate}
              placeholder="The full name shown to users"
            />
            {
              isHideErrors ? <></> : <>
                {validationErrors?.basicInfo?.displayName?.message ? (
                  <p className="text-red-500 text-sm">{validationErrors?.basicInfo?.displayName?.message}</p>
                ) : ""}
              </>
            }
            {/* <FieldHelp className="text-gray-500" id="appDisplayName">
              The full name of the application, used when space allows.
            </FieldHelp> */}
          </div>

          {/* Application Short Name */}
          <div className="space-y-2">
            <Label htmlFor="appShortName">{textSettings?.shortName || "Application Short Name"}</Label>
            <Input
              disabled={isEditMode ? false : !isNameValid || isDuplicate}
              id="appShortName"
              value={settings.basicInfo.shortName}
              onChange={(e) => {
                const value = e.target.value;
                setValue('basicInfo.shortName', value)
                onSettingsChange({
                  ...settings,
                  basicInfo: { ...settings.basicInfo, shortName: value }
                })
              }}
              onBlur={onValidate}
              placeholder="A very short name (e.g., Initials)"
              aria-describedby="appShortName-help"
            />
            {
              isHideErrors ? <></> : <>
                {
                  validationErrors?.basicInfo?.shortName?.message ? <p className="text-red-500 text-sm">{validationErrors?.basicInfo?.shortName?.message}</p> : ""
                }
              </>
            }
            {/* <FieldHelp className="text-gray-500" id="appShortName">
              A very short version of the name for use in tight spaces.
            </FieldHelp> */}
          </div>

          {/* Application Short Description */}
          <div className="space-y-2">
            <Label htmlFor="appShortDescription">{textSettings?.shortDescription || "Application Short Description"}</Label>
            <Input
              disabled={isEditMode ? false : !isNameValid || isDuplicate}
              id="appShortDescription"
              value={settings.basicInfo.shortDescription}
              onChange={(e) => {
                setValue('basicInfo.shortDescription', e.target.value)
                onSettingsChange({
                  ...settings,
                  basicInfo: { ...settings.basicInfo, shortDescription: e.target.value }
                })
              }}
              onBlur={onValidate}
              placeholder="A brief summary (max ~100 chars)"
              maxLength={100}
              aria-describedby="appShortDescription-help"
            />
            {
              isHideErrors ? <></> : <>
                {
                  validationErrors?.basicInfo?.shortDescription?.message ? <p className="text-red-500 text-sm">{validationErrors?.basicInfo?.shortDescription?.message}</p> : ""
                }
              </>
            }
            {/* <FieldHelp className="text-gray-500" id="appShortDescription">
              A brief description (max 100 characters) used when space is limited.
            </FieldHelp> */}
          </div>

          {/* Application Long Description */}
          <div className="space-y-2">
            <Label htmlFor="appLongDescription">{textSettings?.longDescription || "Application Long Description"}</Label>
            <textarea
              disabled={isEditMode ? false : !isNameValid || isDuplicate}
              id="appLongDescription"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={settings.basicInfo.longDescription}
              placeholder="Enter a detailed description of the application's features and purpose"
              aria-label="Long Description"
              onChange={(e) => {
                setValue('basicInfo.longDescription', e.target.value)
                onSettingsChange({
                  ...settings,
                  basicInfo: { ...settings.basicInfo, longDescription: e.target.value }
                })
              }}
              onBlur={onValidate}
              aria-describedby="appLongDescription-help"
            />
            {
              isHideErrors ? <></> : <>
                {
                  validationErrors?.basicInfo?.longDescription?.message ? <p className="text-red-500 text-sm">{validationErrors?.basicInfo?.longDescription?.message}</p> : ""
                }
              </>
            }
            {/* <FieldHelp className="text-gray-500" id="appLongDescription">
              A detailed description used when full application details are needed.
            </FieldHelp> */}
          </div>

          {/* Application Category */}
          <div className="space-y-2 w-full">
            <Label htmlFor="appCategory">{textSettings?.category || "Application Category"}</Label>
            <Select disabled={isEditMode ? false : !isNameValid || isDuplicate}>
              <SelectTrigger>
                <span
                  className="w-full text-left"
                >
                  {selectedCategories.length > 0
                    ? `${selectedCategories.length} selected`
                    : "Select categories"}
                </span>
              </SelectTrigger>
              <SelectContent className="w-full max-w-sm p-4 overflow-y-auto max-h-64 rounded-md border border-input bg-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <div className="flex flex-col w-full space-y-2">
                  {categoryOptions.length > 0 ? (
                    categoryOptions.map((option) => (
                      <label key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={selectedCategories.includes(option.value)}
                          onCheckedChange={() => toggleCategory(option.value)}
                        />
                        <span className="text-sm">{option.value}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">Loading categories...</p>
                  )}
                </div>
                {/* Add new category input */}
                {/* <div className="pt-3 mt-3 border-t">
              <div className="flex gap-2">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name"
                  className="text-sm"
                />
                <Button
                  type="button"
                  onClick={handleAddCategory}
                  className="text-sm"
                  variant="secondary"
                >
                  Add
                </Button>
              </div>
            </div> */}
                {/* Update category input */}
                {/* {selectedCategories.length > 0 && (
                <div className="pt-3 mt-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={updatedCategoryName}
                      onChange={(e) => setUpdatedCategoryName(e.target.value)}
                      placeholder="Update category name"
                      className="text-sm"
                    />
                    <Button
                      type="button"
                      onClick={handleUpdateCategory}
                      className="text-sm"
                      variant="secondary"
                    >
                      Update
                    </Button>
                  </div>
                </div>
              )} */}
              </SelectContent>
            </Select>
            {
              isHideErrors ? <></> : <>

                {
                  validationErrors?.basicInfo?.category?.message ? <p className="text-red-500 text-sm">{validationErrors?.basicInfo?.category?.message}</p> : ""
                }
              </>
            }
            {/* <FieldHelp className="text-gray-500" id="appCategory">
              Select one or more categories that best describe the application.
            </FieldHelp> */}

            {selectedCategories.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {selectedCategories.map((category) => (
                  <span
                    key={category}
                    className="group inline-flex items-center gap-1.5 px-2.5 rounded-md text-sm font-medium bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    {category}
                    <Button
                      type="button"
                      className="ml-1 hover:text-red-600 transition-colors text-red-500"
                      onClick={() => removeCategory(category)}
                      // onClick={() => handleDeleteCategory(category)}
                      aria-label={`Remove category ${category}`}
                    >
                      &times;
                    </Button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-xs text-gray-500">No category selected yet.</p>
              </div>
            )}
          </div>

          {/* Publisher Name */}
          <div className="space-y-2">
            <Label htmlFor="appPublisher">{textSettings?.publisherName || "Publisher Name"}</Label>
            <Input
              disabled={isEditMode ? false : !isNameValid || isDuplicate}
              id="appPublisher"
              value={settings.basicInfo.publisherName}
              onChange={(e) => {
                setValue('basicInfo.publisherName', e?.target?.value)
                onSettingsChange({
                  ...settings,
                  basicInfo: { ...settings.basicInfo, publisherName: e.target.value }
                })
              }
              }
              onBlur={onValidate}
              placeholder="The company or organization name"
              aria-describedby="appPublisher-help"
            />
            {
              isHideErrors ? <></> : <>

                {
                  validationErrors?.basicInfo?.publisherName?.message ? <p className="text-red-500 text-sm">{validationErrors?.basicInfo?.publisherName?.message}</p> : ""
                }
              </>
            }
            {/* <FieldHelp className="text-gray-500" id="appPublisher">
              The name of the company that publishes this application.
            </FieldHelp> */}
          </div>

          {/* Publishers Application Link */}
          <div className="space-y-2">
            <Label htmlFor="appPublisherUrl">{textSettings?.publisherAppLink || "Publishers Application Link"}</Label>
            <Input
              disabled={isEditMode ? false : !isNameValid || isDuplicate}
              id="appPublisherUrl"
              type="url"
              value={settings.basicInfo.publisherUrl}
              onChange={(e) => {
                setValue('basicInfo.publisherUrl', e?.target?.value)
                onSettingsChange({
                  ...settings,
                  basicInfo: { ...settings.basicInfo, publisherUrl: e.target.value }
                })
              }
              }
              onBlur={onValidate}
              placeholder="https://www.publisher-website.com/app-info"
              aria-describedby="appPublisherUrl-help"
            />
            {
              isHideErrors ? <></> : <>
                {
                  validationErrors?.basicInfo?.publisherUrl?.message ? <p className="text-red-500 text-sm">{validationErrors?.basicInfo?.publisherUrl?.message}</p> : ""
                }
              </>
            }
            {/* <FieldHelp className="text-gray-500" id="appPublisherUrl">
              A link to the publisher's website for information (not the launch link).
            </FieldHelp> */}
          </div>

          {/* Application Tags - Moved from SettingsTab */}
          <div className="space-y-2">
            <Label htmlFor="appTags">{textSettings?.tags || "Application Tags"}</Label>
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    disabled={isEditMode ? false : !isNameValid || isDuplicate}
                    id="appTags"
                    type="text"
                    placeholder="Type and press Enter or click Add"
                    className="pr-8"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const input = e.target as HTMLInputElement
                        const newTag = input.value.trim()

                        if (newTag && !settings.basicInfo.tags.includes(newTag)) {
                          onSettingsChange({
                            ...settings,
                            basicInfo: {
                              ...settings.basicInfo,
                              tags: [...settings.basicInfo.tags, newTag]
                            }
                          })
                          input.value = ''
                        }
                      }
                    }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Tag className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling?.querySelector('input') as HTMLInputElement
                    const newTag = input.value.trim()
                    if (newTag && !settings.basicInfo.tags.includes(newTag)) {
                      onSettingsChange({
                        ...settings,
                        basicInfo: {
                          ...settings.basicInfo,
                          tags: [...settings.basicInfo.tags, newTag]
                        }
                      })
                      input.value = ''
                    }
                  }}
                >
                  Add Tag
                </Button>
              </div>
            </div>
            {
              isHideErrors ? <></> : <>

                {
                  validationErrors?.basicInfo?.tags?.message ? <p className="text-red-500 text-sm">{validationErrors?.basicInfo?.tags?.message}</p> : ""
                }
              </>
            }

            {/* <FieldHelp className="text-gray-500" id="appTags">
              Add relevant tags to help users find this application (e.g., 'math', 'gradebook', 'communication').
            </FieldHelp> */}

            {/* Tags Display */}
            {settings.basicInfo.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {settings.basicInfo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <Tag className="h-3.5 w-3.5 text-gray-500" />
                    {tag}
                    <button
                      type="button"
                      className="ml-1 text-gray-400 hover:text-red-600 transition-colors"
                      onClick={() => {
                        const newTags = settings.basicInfo.tags.filter((_, i) => i !== index)
                        onSettingsChange({
                          ...settings,
                          basicInfo: { ...settings.basicInfo, tags: newTags }
                        })
                      }}
                      aria-label={`Remove tag ${tag}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <div className="text-center">
                  <Tag className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">No tags added yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

function ApplicationSpecificSettingsTab({
  settings,
  onSettingsChange,
  validationErrors,
  control,
  handleSubmit,
  setValue,
  isEditMode
}: {
  settings: ApplicationSettings,
  onSettingsChange: (settings: ApplicationSettings) => void
  validationErrors?: any,
  control: any,
  handleSubmit: any,
  setValue: any,
  isEditMode: boolean;
}) {
  const [textSettings, setTextSettings] = useState<any>({})

  // useEffect(() => {
  //   const appManagerTextSettings = localStorage.getItem("textsetting");
  //   if (appManagerTextSettings) {
  //     const appManagerTextJson = JSON.parse(appManagerTextSettings)
  //     if (appManagerTextJson?.appManager) {
  //       const customTexts = mergeWithDefaults(appManager, appManagerTextJson?.appManager || {})
  //       setTextSettings(customTexts)
  //     }
  //     else {
  //       setTextSettings(appManager)
  //     }
  //   }
  //   else {
  //     setTextSettings(appManager)
  //   }
  // }, [])

  return (
    <div className="space-y-8">

      {/* Launch URL Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{textSettings?.lunchConfig || "Launch Configuration"}</CardTitle>
          <CardDescription className="text-sm">
            Set the primary URL used to start the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Application Launch URL - Renamed/Relabeled */}
          <div className="space-y-2">
            <Label htmlFor="appLaunchUrl">{textSettings?.appLauchURL || "Application Launch URL"}</Label>
            <Input
              id="appLaunchUrl"
              type="url"
              value={settings.urls.launchUrl}
              onChange={(e) => {
                setValue(`urls.launchUrl`, e.target.value)
                onSettingsChange({
                  ...settings,
                  urls: { ...settings.urls, launchUrl: e.target.value }
                })
              }
              }
              placeholder="https://app.example.com/start"
              aria-describedby="appLaunchUrl-help"
            />
            {
              validationErrors?.urls?.launchUrl?.message ? <p className="text-red-500 text-sm">{validationErrors?.urls?.launchUrl?.message}</p> : ""
            }
            {/* <FieldHelp className="text-gray-500" id="appLaunchUrl">
              This is the URL that will be used to launch the application from the app launcher.
            </FieldHelp> */}
          </div>
        </CardContent>
      </Card>

      {/* Status & Activation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{textSettings?.statusActivation || "Status & Activation"}</CardTitle>
          <CardDescription className="text-sm">
            Control the application's current status, activity, and visibility.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Status Dropdown - Moved here */}
          <div className="space-y-2">
            <Label htmlFor="appStatus">Status</Label>
            <select
              id="appStatus"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-md"
              value={settings.settings.status}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  settings: { ...settings.settings, status: e.target.value as ApplicationSettings['settings']['status'] }
                })
              }
              aria-describedby="appStatus-help"
              aria-label="Application Status"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="beta">Beta</option>
              <option value="delete">Delete</option>
            </select>
            {/* <FieldHelp className="text-gray-500" id="appStatus">
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
                checked={settings.settings.enabled}
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
          <CardTitle className="text-lg">{textSettings?.accessControl || "Access Control"}</CardTitle>
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

function ImagesTab({
  settings,
  onSettingsChange,
  validationErrors,
  control,
  handleSubmit,
  setValue,
  isEditMode,
  setImageObjs
}: {
  settings: ApplicationSettings,
  onSettingsChange: (settings: ApplicationSettings) => void
  validationErrors?: any,
  control: any,
  handleSubmit: any,
  setValue: any,
  setImageObjs: any,
  isEditMode: boolean;
}) {
  const [selectedLauncherFile, setSelectedLauncherFile] = useState<File | null>(null)
  const [selectedSmallLauncherFile, setSelectedSmallLauncherFile] = useState<File | null>(null)
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<string | false>(false)
  const launcherInputRef = useRef<HTMLInputElement>(null)
  const smallLauncherInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [textSettings, setTextSettings] = useState<any>({})

  const errors = validationErrors

  // useEffect(() => {
  //   const appManagerTextSettings = localStorage.getItem("textsetting");
  //   if (appManagerTextSettings) {
  //     const appManagerTextJson = JSON.parse(appManagerTextSettings)
  //     if (appManagerTextJson?.appManager) {
  //       const customTexts = mergeWithDefaults(appManager, appManagerTextJson?.appManager || {})
  //       setTextSettings(customTexts)
  //     }
  //     else {
  //       setTextSettings(appManager)
  //     }
  //   }
  //   else {
  //     setTextSettings(appManager)
  //   }
  // }, [])

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img: HTMLImageElement = document.createElement("img");
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        ctx.drawImage(img, 0, 0, maxWidth, maxHeight);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Image resizing failed"));
            return;
          }
          const resizedFile = new File([blob], file.name, { type: file.type });
          resolve(resizedFile);
        }, file.type);
      };

      img.onerror = (err: string | Event) => reject(err);
    });
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "launcher" | "smallLauncher" | "banner"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img: HTMLImageElement = document.createElement("img");
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        let resizedFile: File | null = null;

        if (type === "launcher") {
          if (img.width < 512 || img.height < 512) {
            toast.error("Large Icon must be at least 512x512px", {
              position: "top-right",
              className: ToastStyles.toast + " " + ToastStyles.error,
            });
            event.target.value = "";
            return;
          }
          resizedFile = await resizeImage(file, 512, 512);
          setSelectedLauncherFile(resizedFile);
        } else if (type === "smallLauncher") {
          if (img.width < 128 || img.height < 128) {
            toast.error("Small Icon must be at least 128x128px", {
              position: "top-right",
              className: ToastStyles.toast + " " + ToastStyles.error,
            });
            event.target.value = "";
            return;
          }
          resizedFile = await resizeImage(file, 128, 128);
          setSelectedSmallLauncherFile(resizedFile);
        } else if (type === "banner") {
          if (img.width < 1024 || img.height < 768) {
            toast.error("Banner image must be at least 1024x768px", {
              position: "top-right",
              className: ToastStyles.toast + " " + ToastStyles.error,
            });
            event.target.value = "";
            return;
          }
          resizedFile = await resizeImage(file, 1024, 768);
          setSelectedBannerFile(resizedFile);
        }

        toast.success(`${type} image processed successfully!`, {
          position: "top-right",
          className: ToastStyles.toast + " " + ToastStyles.success,
        });
      } catch (err) {
        toast.error("Image processing failed.", {
          position: "top-right",
          className: ToastStyles.toast + " " + ToastStyles.error,
        });
        event.target.value = "";
      }
    };

    img.onerror = () => {
      toast.error("Invalid image file.", {
        position: "top-right",
        className: ToastStyles.toast + " " + ToastStyles.error,
      });
      event.target.value = "";
    };
  };



  const handleUpload = async (type: "launcher" | "smallLauncher" | "banner") => {
    let file: File | null = null;
    let stateKey: keyof ApplicationSettings["images"] = "launcherImage";
    let stateKeyAPI: string;
    let inputRef: React.RefObject<HTMLInputElement | null> = launcherInputRef;
    let setSelectedFile: React.Dispatch<React.SetStateAction<File | null>> = setSelectedLauncherFile;

    if (type === "launcher") {
      file = selectedLauncherFile;
      stateKey = "launcherImage";
      stateKeyAPI = "LargeIcon";
      inputRef = launcherInputRef;
      setSelectedFile = setSelectedLauncherFile;
    } else if (type === "smallLauncher") {
      file = selectedSmallLauncherFile;
      stateKey = "smallLauncherImage";
      stateKeyAPI = "SmallIcon";
      inputRef = smallLauncherInputRef;
      setSelectedFile = setSelectedSmallLauncherFile;
    } else if (type === "banner") {
      file = selectedBannerFile;
      stateKey = "bannerImage";
      stateKeyAPI = "BannerImage";
      inputRef = bannerInputRef;
      setSelectedFile = setSelectedBannerFile;
    }
    else {
      stateKeyAPI = 'SmallIcon'
    }
    if (!file) return;

    setIsUploading(type);
    try {
      const imageUrl = URL.createObjectURL(file);

      setValue(`images.${stateKey}`, file, { shouldValidate: true });
      setImageObjs((prev: object) => ({
        ...prev,
        [stateKeyAPI]: file
      }))
      onSettingsChange({
        ...settings,
        images: { ...settings.images, [stateKey]: imageUrl },
      });

      toast.success(`${type} image uploaded successfully!`, {
        position: "top-right",
        className: ToastStyles.toast + " " + ToastStyles.success,
      });

      setSelectedFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      toast.error(`Failed to upload ${type} image.`, {
        position: "top-right",
        className: ToastStyles.toast + " " + ToastStyles.error,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Combined Launcher Icons Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{textSettings?.launcherIcons || "Launcher Icons"}</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Upload icons displayed in the application launcher (large and small formats).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Large Launcher Icon Section - Relabeled */}
          <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
            <h3 className="font-medium text-gray-800">{textSettings?.largeIcon || "Large Launcher Icon"}</h3>
            <p className="text-xs text-gray-500">Used when space allows (e.g., desktop).</p>
            {/* Preview */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-4 min-h-[160px]">
              <div className="relative h-32">
                <img
                  src={settings.images.launcherImage}
                  alt="Large launcher icon"
                  className="w-full h-full object-contain"
                />
                {settings.images.launcherImage.startsWith('/placeholder') && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 rounded-lg">
                    <Image className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            {/* Upload Controls */}
            <div className="border border-dashed border-gray-300 hover:border-blue-400 transition-colors rounded-lg p-3 bg-gray-50/50 hover:bg-blue-50">
              <p className="text-xs text-center text-gray-600 mb-2 truncate px-2">
                {selectedLauncherFile ? selectedLauncherFile.name : "Select a file (e.g., 512x512px)"}
              </p>
              <input
                type="file" accept="image/*"
                onChange={(e) => handleFileSelect(e, 'launcher')}
                className="hidden"
                ref={launcherInputRef}
                aria-label="Upload large launcher icon"
              />
              <div className="flex gap-2">
                <Button onClick={() => launcherInputRef.current?.click()} variant="outline" size="sm" className="flex-1 text-xs" disabled={isUploading !== false}>Browse</Button>
                <Button
                  onClick={() => handleUpload('launcher')}
                  size="sm"
                  className="flex-1 text-xs border border-gray-400 bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={isUploading !== false || !selectedLauncherFile}
                >
                  {isUploading === 'launcher' ? "Uploading..." : "Upload"}
                </Button>
              </div>
              {
                validationErrors?.images?.launcherImage?.message ? <p className="text-red-500 text-sm">{validationErrors?.images?.launcherImage?.message}</p> : ""
              }
            </div>
          </div>

          {/* Small Launcher Icon Section - New */}
          <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
            <h3 className="font-medium text-gray-800">{textSettings?.smallIcon || "Small Launcher Icon"}</h3>
            <p className="text-xs text-gray-500">Used in compact spaces (e.g., mobile).</p>
            {/* Preview */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-4 min-h-[160px]">
              <div className="relative w-16 h-16">
                <img
                  src={settings.images.smallLauncherImage}
                  alt="Small launcher icon"
                  className="w-full h-full object-contain"
                />
                {settings.images.smallLauncherImage.startsWith('/placeholder') && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 rounded-lg">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            {/* Upload Controls */}
            <div className="border border-dashed border-gray-300 hover:border-blue-400 transition-colors rounded-lg p-3 bg-gray-50/50 hover:bg-blue-50">
              <p className="text-xs text-center text-gray-600 mb-2 truncate px-2">
                {selectedSmallLauncherFile ? selectedSmallLauncherFile.name : "Select a file (e.g., 128x128px)"}
              </p>
              <input
                type="file" accept="image/*"
                onChange={(e) => handleFileSelect(e, 'smallLauncher')}
                className="hidden"
                ref={smallLauncherInputRef}
                aria-label="Upload small launcher icon"
              />
              <div className="flex gap-2">
                <Button onClick={() => smallLauncherInputRef.current?.click()} variant="outline" size="sm" className="flex-1 text-xs" disabled={isUploading !== false}>Browse</Button>
                <Button onClick={() => handleUpload('smallLauncher')} size="sm" className="flex-1 text-xs border border-gray-400 bg-gray-100 hover:bg-gray-200 transition-colors" disabled={isUploading !== false || !selectedSmallLauncherFile}>
                  {isUploading === 'smallLauncher' ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
            {
              validationErrors?.images?.smallLauncherImage?.message ? <p className="text-red-500 text-sm">{validationErrors?.images?.smallLauncherImage?.message}</p> : ""
            }
          </div>
        </CardContent>
      </Card>
      <ToastContainer />
      {/* Banner Image Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{textSettings?.bannerImg || "Banner Image"}</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Upload a wide banner image used in detailed application views.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          {/* Preview */}
          <div className="w-full flex items-center justify-center bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[150px]">
            <div className="relative w-full max-w-5xl aspect-[2/1]">
              <img
                src={settings.images.bannerImage}
                alt="Banner image"
                className="w-full h-full object-contain"
              />
              {settings.images.bannerImage.startsWith('/placeholder') && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 rounded-lg">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Upload Controls */}
          <div className="w-full max-w-md border border-dashed border-gray-300 hover:border-blue-400 transition-colors rounded-lg p-4 bg-gray-50/50 hover:bg-blue-50 flex flex-col items-center justify-center min-h-[100px]">
            <p className="text-sm text-gray-600 mb-3 text-center px-2">
              {selectedBannerFile
                ? `Selected: ${selectedBannerFile.name}`
                : "Select file (e.g., 1024x768px)"
              }
            </p>
            <input
              type="file" accept="image/*"
              onChange={(e) => handleFileSelect(e, 'banner')}
              className="hidden"
              ref={bannerInputRef}
              aria-label="Upload banner image"
            />
            <div className="flex gap-2 w-full max-w-xs">
              <Button onClick={() => bannerInputRef.current?.click()} variant="outline" className="flex-1" disabled={isUploading !== false}>Browse</Button>
              <Button onClick={() => handleUpload('banner')} className="flex-1 text-xs border border-gray-400 bg-gray-100 hover:bg-gray-200 transition-colors" disabled={isUploading !== false || !selectedBannerFile}>
                {isUploading === 'banner' ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
          {
            validationErrors?.images?.bannerImage?.message ? <p className="text-red-500 text-sm">{validationErrors?.images?.bannerImage?.message}</p> : ""
          }
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsTab({
  settings,
  onSettingsChange,
  validationErrors,
  control,
  handleSubmit,
  setValue,
  isEditMode
}: {
  settings: ApplicationSettings,
  onSettingsChange: (settings: ApplicationSettings) => void
  validationErrors: any,
  control: any,
  handleSubmit: any,
  setValue: any,
  isEditMode: boolean;
}) {

  const [textSettings, setTextSettings] = useState<any>({})
  const errors = validationErrors

  // useEffect(() => {
  //   const appManagerTextSettings = localStorage.getItem("textsetting");
  //   if (appManagerTextSettings) {
  //     const appManagerTextJson = JSON.parse(appManagerTextSettings)
  //     if (appManagerTextJson?.appManager) {
  //       const customTexts = mergeWithDefaults(appManager, appManagerTextJson?.appManager || {})
  //       setTextSettings(customTexts)
  //     }
  //     else {
  //       setTextSettings(appManager)
  //     }
  //   }
  //   else {
  //     setTextSettings(appManager)
  //   }
  // }, [])

   const addRole = () => {
    // Prevent adding new roles in edit mode
    // if (isEditMode) return;

    const newRole: ApplicationRole = {
      id: crypto.randomUUID(),
      name: "",
      // name: New Role ${settings.settings.rolesandFeatures.length + 1},
      description: '',
      features: [],
    };
    const updatedRoles =  [...settings.settings.rolesandFeatures, newRole]
    setValue(`settings.rolesandFeatures`, updatedRoles, { shouldValidate: true });
    onSettingsChange({
      ...settings,
      settings: {
        ...settings.settings,
        rolesandFeatures: updatedRoles
      }
    });
  };


  const removeRole = (roleId: string) => {
    // Prevent removing roles in edit mode
    const updatedRoles: ApplicationRole[] = settings.settings.rolesandFeatures.filter(
      (role: ApplicationRole) => role.id !== roleId
    );
    setValue(`settings.rolesandFeatures`, updatedRoles, { shouldValidate: true });
    onSettingsChange({
      ...settings,
      settings: {
        ...settings.settings,
        rolesandFeatures: updatedRoles
      }
    });
  };


  const updateRoleField = (roleId: string, field: 'name' | 'description', value: string) => {
    // Allow updating role fields in both create and edit modes
    const updatedRoles: ApplicationRole[] = settings.settings.rolesandFeatures.map(
      (role: ApplicationRole): ApplicationRole =>
        role.id === roleId
          ? { ...role, [field]: value }
          : role
    );

    setValue(`settings.rolesandFeatures`, updatedRoles, { shouldValidate: true });

    onSettingsChange({
      ...settings,
      settings: {
        ...settings.settings,
        rolesandFeatures: updatedRoles
      }
    });
  };

  const addFeature = (roleId: string) => {
    // Prevent adding new features in edit mode
    const newFeature: Feature = {
      id: crypto.randomUUID(),
      name: '',
      value: '',
    };
    const updatedRoles: ApplicationRole[] = settings.settings.rolesandFeatures.map(
      (role: ApplicationRole): ApplicationRole => {
        if (role.id === roleId) {
          const updatedFeatures: Feature[] = [...role.features, newFeature];
          return { ...role, features: updatedFeatures };
        }
        return role;
      }
    );
    setValue(`settings.rolesandFeatures`, updatedRoles, { shouldValidate: true });
    onSettingsChange({
      ...settings,
      settings: {
        ...settings.settings,
        rolesandFeatures: updatedRoles
      }
    });
  };

  const removeFeature = (roleId: string, featureId: string) => {
    const updatedRoles: ApplicationRole[] = settings.settings.rolesandFeatures.map(
      (role: ApplicationRole): ApplicationRole => {
        if (role.id === roleId) {
          const updatedFeatures: Feature[] = role.features.filter(
            (feature: Feature) => feature.id !== featureId
          );
          return { ...role, features: updatedFeatures };
        }
        return role;
      }
    );
    setValue(`settings.rolesandFeatures`, updatedRoles, { shouldValidate: true });
    onSettingsChange({
      ...settings,
      settings: {
        ...settings.settings,
        rolesandFeatures: updatedRoles
      }
    });
  };

  const updateFeatureField = (
    roleId: string,
    featureId: string,
    field: 'name' | 'value',
    value: string
  ) => {
    // Allow updating feature fields in both create and edit modes
    const updatedRoles: ApplicationRole[] = settings.settings.rolesandFeatures.map(
      (role: ApplicationRole): ApplicationRole => {
        if (role.id === roleId) {
          const updatedFeatures: Feature[] = role.features.map(
            (feature: Feature): Feature =>
              feature.id === featureId
                ? { ...feature, [field]: value }
                : feature
          );
          return { ...role, features: updatedFeatures };
        }
        return role;
      }
    );
    setValue(`settings.rolesandFeatures`, updatedRoles, { shouldValidate: true });

    onSettingsChange({
      ...settings,
      settings: {
        ...settings.settings,
        rolesandFeatures: updatedRoles
      }
    });
  };

  return (
    <div className="space-y-6">
      {settings.settings.rolesandFeatures.length === 0 && !isEditMode && (
        <Card className="text-center py-6">
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No roles defined yet. Click "Add Role" to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {/* List of Role Cards */}
      <div className="space-y-4">
        {settings.settings.rolesandFeatures.map((role, roleIndex) => (
          <Card key={role.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 p-4 relative">
              <h3 className="text-lg font-semibold">Role Configuration</h3>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <p className="m-0">
                  Roles help manage access control. Add features under each role to specify what they can or can't do.
                </p>
                <div className="relative group inline-block">
                  <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                  <div className="absolute z-10 hidden group-hover:block bg-white border border-gray-300 rounded-md shadow-lg p-3 mt-1 w-64 text-sm text-muted-foreground left-1/2 -translate-x-1/2">
                    Define a role such as <strong>Admin</strong>, <strong>Editor</strong>, or <strong>Viewer</strong>. Each role includes a set of features or permissions.
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-start gap-4">
                <div className="flex-grow space-y-1.5">
                  <div>
                    <Label htmlFor={`role-name-${role.id}`} className="sr-only">Role Name</Label>
                    <Input
                      id={`role-name-${role.id}`}
                      value={role.name}
                      onChange={(e) => updateRoleField(role.id, 'name', e.target.value)}
                      placeholder="Role Name (e.g., Admin)"
                    />
                    {validationErrors?.settings?.rolesandFeatures?.[roleIndex]?.name?.message && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.settings.rolesandFeatures[roleIndex].name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`role-desc-${role.id}`} className="sr-only">Role Description</Label>
                    <Input
                      id={`role-desc-${role.id}`}
                      value={role.description}
                      onChange={(e) => updateRoleField(role.id, 'description', e.target.value)}
                      placeholder="Role Description"
                    />
                    {validationErrors?.settings?.rolesandFeatures?.[roleIndex]?.description?.message && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.settings.rolesandFeatures[roleIndex].description.message}
                      </p>
                    )}
                  </div>
                </div>
                {settings.settings.rolesandFeatures.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRole(role.id)}
                    aria-label="Remove Role"
                    className="text-red-500 hover:bg-red-100 rounded-full w-8 h-8 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 pt-2">
                <h4 className="text-sm font-medium text-muted-foreground m-0">
                  Features / Permissions
                </h4>
                <div className="relative group inline-block">
                  <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                  <div className="absolute z-10 hidden group-hover:block bg-white border border-gray-300 rounded-md shadow-lg p-3 mt-1 w-64 text-sm text-muted-foreground left-1/2 -translate-x-1/2">
                    Define specific capabilities this role has access to. For example: <code>canDelete</code> or <code>canViewReports</code>.
                  </div>
                </div>
              </div>

              {role.features.length === 0 ? (
                <p className="text-xs text-center text-muted-foreground py-2 italic text-red-500">
                  No features defined for this role. Please add features to specify permissions.
                </p>
              ) : (
                <div className="space-y-3">
                  {role.features.map((feature, featureIndex) => (
                    <div key={feature.id} className="flex flex-col md:flex-row md:items-center gap-2">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor={`feature-key-${feature.id}`} className="sr-only">Feature Key</Label>
                          <Input
                            id={`feature-key-${feature.id}`}
                            value={feature.key}  // Correct binding here
                            onChange={(e) => updateFeatureField(role.id, feature.id, 'key', e.target.value)}
                            placeholder="Feature Key (e.g., canEdit)"
                          />
                          {validationErrors?.settings?.rolesandFeatures?.[roleIndex]?.features?.[featureIndex]?.key?.message && (
                            <p className="text-red-500 text-sm">
                              {validationErrors.settings.rolesandFeatures[roleIndex].features[featureIndex].key.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor={`feature-value-${feature.id}`} className="sr-only">Feature Value</Label>
                          <Input
                            id={`feature-value-${feature.id}`}
                            value={feature.value}
                            onChange={(e) => updateFeatureField(role.id, feature.id, 'value', e.target.value)}
                            placeholder="Value (e.g., true)"
                          />
                          {validationErrors?.settings?.rolesandFeatures?.[roleIndex]?.features?.[featureIndex]?.value?.message && (
                            <p className="text-red-500 text-sm">
                              {validationErrors.settings.rolesandFeatures[roleIndex].features[featureIndex].value.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {!(roleIndex === 0 && featureIndex === 0) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFeature(role.id, feature.id)}
                          aria-label="Remove Feature"
                          className="text-red-500 hover:bg-red-100 rounded-full w-8 h-8 self-end md:self-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => addFeature(role.id)}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Feature
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>


      <div className="pt-4">
        <Button onClick={addRole} variant="default" className="bg-gray-900 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Role
        </Button>
      </div>
    </div>
  );

} 