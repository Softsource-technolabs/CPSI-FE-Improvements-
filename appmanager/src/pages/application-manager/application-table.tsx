//@ts-nocheck

"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, CirclePlus, Search, MoreHorizontal, Edit, Check, X, Link, Eye, EyeOff, Trash2, XCircle, Filter } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import { Application } from "../application-manager/types"
import { AddApplicationWizard } from "./add-application-wizard"
import { mergeWithDefaults } from '../../../../utils/utils';
import { encrypt, decrypt } from '../../../../utils/aesUtils';
// import { appManager } from '../../../../src/constants/appManager'
import { Switch } from "../../../../components/ui/switch"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2"
import ApiService from '../../../../services/api-service';
import { TableMapper } from '../../../../components/TableMapper';
import FilterDrawer from '../../../../components/filterDrawer';
import ColumnFilterDropdown from '../../../../components/columnFilter';

interface ApplicationsTableProps {
  applications: Application[]
  onEdit: (app: Application) => void
  onDelete: (id: string) => void
  onToggleEnabled: (id: string) => void
  onToggleVisibility: (id: string) => void
}

type ButtonVariant = "default" | "outline" | "link" | "secondary" | "destructive" | "ghost";

const getItemProps = (currentPage: number, pageNum: number): { variant: ButtonVariant; className: string } => ({
  variant: (currentPage === pageNum ? "default" : "outline") as ButtonVariant,
  className: `rounded-full w-10 h-10 p-0 text-sm font-medium ${currentPage === pageNum
    ? "bg-gray-900 text-white hover:bg-gray-800"
    : "text-gray-900 hover:bg-gray-100"
    }`,
});

interface ApiResponse<T> {
  success: boolean;
  data: T;
  totalRecords: number;
}

interface ApplicationResponse extends ApiResponse<Application[]> {
  data: Application[];
}

interface ToggleResponse extends ApiResponse<null> {
  success: boolean;
}

const formatFilterLabel = (key: string) => {
  if (key === 'isActive') return 'Enabled';
  if (key === 'isVisible') return 'Visible';
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

export function ApplicationManagerList({
  applications: _applications,
  onEdit,
  onDelete,
  onToggleEnabled,
  onToggleVisibility,
}: ApplicationsTableProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [textSettings, setTextSettings] = useState<any>({});
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState("Id");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("asc");
  const [locationDetails, setLocationDetails] = useState<any>({})
  const [systemInfo, setSystemInfo] = useState<any>({})
  const [ipaddress, setIpAddress] = useState<any>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [columnFilters, setColumnFilters] = useState<{
    id: string[];
    displayName: string[];
    category: string[];
    publisherName: string[];
    status: string[];
    isActive: string[];
    isVisible: string[];
  }>({
    id: [],
    displayName: [],
    category: [],
    publisherName: [],
    status: [],
    isActive: [],
    isVisible: [],
  });

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<{ [key: string]: string }>({
    id: '',
    displayName: '',
    category: '',
    publisherName: '',
    status: '',
    isActive: '',
    isVisible: '',
  });

  const pageSizeOptions = [10, 50, 100, 200];

  const fetchApplications = async (showLoading = true) => {
    if (showLoading) {
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    }

    try {
      const serverFilters = Object.entries(columnFilters)
        .filter(([, values]) => values.length > 0)
        .flatMap(([key, values]) =>
          values.map((val) => ({
            column: key,
            operator: "eq",
            value: val,
          }))
        );


      const advancedFilterParams = Object.entries(advancedFilters)
        .filter(([, value]) => value.trim() !== '')
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

      const filterPayload = []
      Object.keys(advancedFilters).forEach((key) => {
        const obj = {
          "column": key,
          "operator": "eq",
          "value": null
        }

        console.log("Key", advancedFilters[key])

        if (advancedFilters[key]) {
          obj.value = advancedFilters[key]
          filterPayload.push(obj)
        }

        // if(Array.isArray(advancedFilters[key]) && advancedFilters[key].length){
        //   obj.value = advancedFilters[key][0]
        //   filterPayload.push(obj)
        // } else if(typeof advancedFilters[key] === 'string'){
        //   obj.value = advancedFilters[key]
        // }
      })

      console.log("Advance filter", advancedFilterParams)
      console.log("Serverd folter", serverFilters)

      const allFilters = [
        ...serverFilters,
        ...Object.entries(advancedFilters)
          .filter(([, value]) => value.trim() !== "")
          .map(([key, value]) => ({
            column: key,
            operator: "eq",
            value,
          })),
      ];

      const response = await ApiService.post<ApplicationResponse>(
        "/api/Applications/GetAllApplication",
        {
          pageSize,
          pageNumber,
          strSearch: searchQuery,
          sortColumn: sortColumn,
          sortOrder: sortOrder,
          columnFilters: serverFilters,
          // filters: filterPayload?.length ? filterPayload : null
          filters: allFilters.length ? allFilters : null,
        }
      );

      setApplications(response.data || []);
      setTotalRecords(response.totalRecords || 0);
      setTotalPages(Math.ceil((response.totalRecords || 0) / pageSize));

      if (response.data && response.data.length > 0) {
        const encrypted = encrypt(JSON.stringify(response.data));
        const decrypted = JSON.parse(decrypt(encrypted));
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an issue fetching the applications. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      if (showLoading) {
        Swal.close();
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isCreating) {
      fetchApplications();
    }
  }, [isCreating])

  const handleSort = (column: string) => {
    const newOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newOrder);
  };

  const handleColumnFilterChange = (key: keyof typeof columnFilters, values: string[]) => {
    setColumnFilters(prev => ({ ...prev, [key]: values }));
    setPageNumber(1);

  };

  const handleFilterDrawerFieldChange = (name: string, value: string) => {
    setAdvancedFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFiltersFromDrawer = () => {
    setIsFilterDrawerOpen(false);
    setPageNumber(1);
    fetchApplications();
  };

  const removeFilterChip = (columnKey: keyof typeof columnFilters, valueToRemove: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnKey]: prev[columnKey].filter(val => val !== valueToRemove)
    }));
    setPageNumber(1);
  };

  const clearAllFilters = () => {
    setColumnFilters({
      id: [],
      displayName: [],
      category: [],
      publisherName: [],
      status: [],
      isActive: [],
      isVisible: [],
    });
    setAdvancedFilters({
      id: '',
      displayName: '',
      publisherName: '',
      status: '',
      isActive: '',
      isVisible: '',
    });
    setSearchQuery("");
    setPageNumber(1);
  };

  const isAnyFilterActive = () => {
    return Object.values(columnFilters).some(values => values.length > 0) ||
      Object.values(advancedFilters).some(filter => filter.trim() !== '') ||
      searchQuery !== "";
  };

  const getUniqueColumnValues = (columnKey: string): string[] => {
    const values = applications.map(app => {
      const value = app[columnKey as keyof Application];
      if (columnKey === 'isActive' || columnKey === 'isVisible') {
        return value ? 'true' : 'false';
      }
      if (columnKey === 'category' && Array.isArray(value)) {
        return value.join(', ');
      }
      return String(value || '');
    }).filter(Boolean);
    return Array.from(new Set(values));
  };

  useEffect(() => {
    const sysdetail = localStorage.getItem('system') || ""
    const ipdetails = localStorage.getItem('ipaddress') || ""
    const location = localStorage.getItem('location') || ""
    setSystemInfo(JSON.parse(sysdetail))
    setIpAddress(ipdetails)
    setLocationDetails(JSON.parse(location))

    const delayDebounce = setTimeout(() => {
      fetchApplications();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, pageNumber, pageSize, sortColumn, sortOrder]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchApplications(false);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [columnFilters]);


  useEffect(() => {
    if (Object.values(advancedFilters).some(filter => filter.trim() !== '')) {
      const delayDebounce = setTimeout(() => {
        fetchApplications(false);
      }, 500);
      return () => clearTimeout(delayDebounce);
    }
  }, [advancedFilters]);

  const handleApplicationCreated = (newApp: Application) => {
    // setApplications(prev => [...prev, newApp]);
    fetchApplications(false);
  };

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

  const handleEdit = async (app: Application) => {
    try {
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const result = await ApiService.get<{ success: boolean; data: Application }>(
        `/api/Applications/GetApplicationById/${app?.id}`
      );
      console.log("[DEBUG] handleEdit API response:", result);
      if (result?.data) {
        setSelectedApplication(result.data);
        setIsCreating(false);
      } else if (result) {
        setSelectedApplication(result);
        setIsCreating(false);
      } else {
        console.warn("[DEBUG] No application data returned from API.");
      }
    } catch (error) {
      console.log("Error fetching application:", error);
      Swal.fire("Error", "Unable to fetch application details.", "error");
    } finally {
      Swal.close();
    }
  };

  const handleCancel = () => {
    setSelectedApplication(null);
    setIsCreating(false);
  };

  const handleDelete = async (appId: number | string, displayName: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `This action will delete the application "${displayName}" permanently!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await ApiService.delete<ToggleResponse>(
        `/api/Applications/DeleteApplication/${appId}`
      );

      if (response.success) {
        await fetchApplications(false);
        setApplications((prev) => prev.filter((app) => Number(app.id) !== appId));

        Swal.close(); // close the loader

        // ✅ Show SweetAlert2 toast with displayName
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Application "${displayName}" deleted successfully!`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        throw new Error('Failed to delete application.');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: `There was an issue deleting "${displayName}". Please try again later.`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };


  const handleComplete = (updatedApplication: Application) => {
    setSelectedApplication(null);
    setIsCreating(false);
    fetchApplications(false);
  };

  const handleToggleEnabled = async (id: number, currentStatus: boolean) => {
    try {
      Swal.fire({
        title: "Updating...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await ApiService.get<ToggleResponse>(`/api/Applications/ToggleActiveApplication/${id}`, {
        isActive: !currentStatus,
      });
      fetchApplications();
      if (response.success) {
        setApplications((prev => {
          const updated = prev.map(app =>
            Number(app.id) === id ? { ...app, isActive: !currentStatus } : app
          );
          return updated;
        }));
      }
    } catch (error) {
      console.error("Error toggling isActive:", error);
    } finally {
      Swal.close();
    }
  };

  const handleToggleVisibility = async (id: number, currentStatus: boolean) => {
    try {
      Swal.fire({
        title: "Updating...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await ApiService.get<ToggleResponse>(`/api/Applications/ToggleVisibleApplication/${id}`, {
        isVisible: !currentStatus
      });
      fetchApplications();
      if (response.success) {
        setApplications((prev => {
          const updated = prev.map(app =>
            Number(app.id) === id ? { ...app, isVisible: !currentStatus } : app
          );
          return updated;
        }));
      }
    } catch (error) {
      console.error("Error toggling isVisible:", error);
    } finally {
      Swal.close();
    }
  };

  const getStatusBadge = (status: string | number) => {
    const normalized = typeof status === 'string' ? status.toLowerCase() : Number(status);

    switch (normalized) {
      case 'active':
      case 1:
        return <Badge variant="outline" className="text-green-700 border border-gray-400 bg-green-100">Active</Badge>;

      case 'inactive':
      case 0:
        return <Badge variant="outline" className="bg-red-100 text-red-700 border border-gray-400">Inactive</Badge>;

      case 'beta':
      case 2:
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border border-gray-400">Beta</Badge>;

      case 'delete':
      case 'deprecated':
      case 3:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border border-gray-400">Delete</Badge>;

      default:
        return <Badge variant="outline" className="bg-white text-gray-700 border border-gray-500">{String(status)}</Badge>;
    }
  };

  const renderFilterChips = () => {
    if (!isAnyFilterActive()) return null;

    return (
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Active filters:</span>

        {/* Search chip */}
        {searchQuery && (
          <div className="inline-flex items-center rounded-full bg-indigo-900 hover:bg-indigo-800 text-white text-xs sm:text-sm px-2 py-0.5 shadow-sm whitespace-nowrap ring-1 ring-indigo-300">
            <span className="mr-1 opacity-90">Search:</span>
            <span className="font-medium">{searchQuery}</span>
            <X
              className="ml-2 h-3 w-3 cursor-pointer text-white/90 hover:text-white"
              onClick={() => setSearchQuery("")}
            />
          </div>
        )}

        {/* Column filter chips */}
        {Object.entries(columnFilters).map(([columnKey, values]) => (
          values.map(value => (
            <div
              key={`${columnKey}-${value}`}
              className="inline-flex items-center rounded-full bg-indigo-900 hover:bg-indigo-800 text-white text-xs sm:text-sm px-2 py-0.5 shadow-sm whitespace-nowrap ring-1 ring-indigo-300"
            >
              <span className="mr-1 opacity-90">{formatFilterLabel(columnKey)}:</span>
              <span className="font-medium">{value}</span>
              <X
                className="ml-2 h-3 w-3 cursor-pointer text-white/90 hover:text-white"
                onClick={() => removeFilterChip(columnKey as keyof typeof columnFilters, value)}
              />
            </div>
          ))
        ))}

        {/* Advanced filter chips */}
        {Object.entries(advancedFilters).map(([key, value]) =>
          value.trim() !== "" ? (
            <div
              key={key}
              className="inline-flex items-center rounded-full bg-indigo-900 hover:bg-indigo-800 text-white text-xs sm:text-sm px-2 py-0.5 shadow-sm whitespace-nowrap ring-1 ring-indigo-300"
            >
              <span className="mr-1 opacity-90">{formatFilterLabel(key)}:</span>
              <span className="font-medium">{value}</span>
              <X
                className="ml-2 h-3 w-3 cursor-pointer text-white/90 hover:text-white"
                onClick={() => handleFilterDrawerFieldChange(key, "")}
              />
            </div>
          ) : null
        )}
      </div>
    );
  };

  useEffect(() => {
    const handleTenantUnsavedChanges = (e: any) => {
      setHasUnsavedChanges(e.detail);
    };

    window.addEventListener("tenantUnsavedChanges", handleTenantUnsavedChanges);
    return () => {
      window.removeEventListener("tenantUnsavedChanges", handleTenantUnsavedChanges);
    };
  }, []);

  const handleCloseManageApplication = () => {
    if (hasUnsavedChanges) {
      Swal.fire({
        titleText: 'You have unsaved changes! Are sure you want to switch without saving?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          setIsCreating(false)
          setHasUnsavedChanges(false)
          // navigate(path); 
          // if (key) setCurrentPage(key); 
          // else setCurrentPage(path as NonNullable<AdminLayoutProps["activePage"]>); 
        }
      });
    } else {
      setIsCreating(false);
    }
  }

  if (isCreating) {
    return (
      <div className="w-full py-6 px-6 md:px-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            className="p-2"
            onClick={() => handleCloseManageApplication()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{textSettings?.createApplicationTitle || "Add New Application"}</h1>
            <p className="text-muted-foreground mt-1 text-gray-500">Configure the settings for your new application</p>
          </div>
        </div>
        <Card>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full border-gray-200">
            <div className="p-6">
              <div className="space-y-6">
                <AddApplicationWizard
                  onCancel={() => setIsCreating(false)}
                  onComplete={() => {
                    setIsCreating(false);
                    fetchApplications(false);
                  }}
                  onApplicationCreated={handleApplicationCreated}
                  initialData={selectedApplication!}
                />

              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (selectedApplication) {
    return (
      <div className="w-full py-6 px-4 sm:px-6 md:px-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="p-2"
                onClick={() => setSelectedApplication(null)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold">{selectedApplication.displayName}</h2>
            </div>
          </div>
          <Card>
            <div className="p-2">
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <AddApplicationWizard
                  onCancel={() => setSelectedApplication(null)}
                  onComplete={(updatedApplication) => {
                    console.log("Application updated:", updatedApplication);
                    setSelectedApplication(null);
                  }}
                  onApplicationCreated={() => { }}
                  initialData={selectedApplication}
                  isEditMode={true}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const getFilePath = async (url: string | undefined | null): Promise<string | null> => {
    if (!url || typeof url !== "string") return null;

    const parts = url.split("\\");
    const fileName = parts[parts.length - 1];

    if (!fileName) return null;

    const fullUrl = `/ApplicationImage/${fileName}`;

    try {
      const response = await ApiService.get<any>(fullUrl, {
        responseType: 'blob',
      });
      return URL.createObjectURL(response?.data);
    } catch (error) {
      console.error("Error fetching file:", error);
      return null;
    }
  };

  return (
    <div className="w-full py-6 px-4 sm:px-6 md:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{textSettings?.appManager || "Applications"}</h1>
          <p className="text-muted-foreground mt-1 text-gray-500">Manage your applications and their configurations</p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{textSettings?.subTitle || "Application List"}</CardTitle>
              <CardDescription className="text-gray-500">View and manage all registered applications</CardDescription>
            </div>
            <Button onClick={() => setIsCreating(true)} className="bg-gray-900 text-white">
              <CirclePlus className="h-4 w-4 mr-2" />
              {textSettings?.createApp || "Add Application"}
            </Button>
          </div>
        </CardHeader>
        <CardContent style={{ backgroundColor: 'var(--cardBackColor)' }}>
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by roles name, description, or application"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setIsFilterDrawerOpen(true)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                {isAnyFilterActive() && (
                  <Button
                    variant="outline"
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    onClick={clearAllFilters}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {renderFilterChips()}
          </div>

          <div className="rounded-md border">
            <TableMapper
              columns={[
                {
                  key: 'smallIconpath',
                  header: 'Icon',
                  render: (app) => (
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={app.smallIconpath || "/assets/Images/icon.jpg"}
                        alt={app.displayName}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/assets/Images/icon.jpg";
                        }}
                      />
                      <AvatarFallback>
                        {app.displayName?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ),
                },
                { key: 'id', header: 'ID', sortable: true },
                {
                  key: 'displayName',
                  header: 'Display Name',
                  // sortable: true,
                  filterable: true,
                  selectedFilterValues: columnFilters.displayName,
                  onFilterChange: (values) => handleColumnFilterChange('displayName', values),
                  filterComponent: (
                    <ColumnFilterDropdown
                      column="displayName"
                      values={getUniqueColumnValues('displayName')}
                      selectedValues={columnFilters.displayName}
                      onSelect={(values) => handleColumnFilterChange('displayName', values)}
                      close={() => { }}
                      anchorRef={{ current: null }}
                    />
                  ),
                  render: (app) => (
                    <div>
                      <div className="font-large">{app.displayName}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[120px] md:max-w-[200px] text-gray-500">{app.uniqueNameorId}</div>
                    </div>
                  ),
                },
                {
                  key: 'category',
                  header: 'Category',
                  // sortable: true,
                  filterable: true,
                  selectedFilterValues: columnFilters.category,
                  onFilterChange: (values) => handleColumnFilterChange('category', values),
                  filterComponent: (
                    <ColumnFilterDropdown
                      column="category"
                      values={getUniqueColumnValues('category')}
                      selectedValues={columnFilters.category}
                      onSelect={(values) => handleColumnFilterChange('category', values)}
                      close={() => { }}
                      anchorRef={{ current: null }}
                    />
                  ),
                  render: (app) => (
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(app.category)
                        ? app.category.map((cat) => <Badge key={cat}>{cat}</Badge>)
                        : <Badge>{app.category}</Badge>}
                    </div>
                  ),
                },
                {
                  key: 'publisherName',
                  header: 'Publisher',
                  // sortable: true,
                  filterable: true,
                  selectedFilterValues: columnFilters.publisherName,
                  onFilterChange: (values) => handleColumnFilterChange('publisherName', values),
                  filterComponent: (
                    <ColumnFilterDropdown
                      column="publisherName"
                      values={getUniqueColumnValues('publisherName')}
                      selectedValues={columnFilters.publisherName}
                      onSelect={(values) => handleColumnFilterChange('publisherName', values)}
                      close={() => { }}
                      anchorRef={{ current: null }}
                    />
                  ),
                },
                {
                  key: 'status',
                  header: 'Status',
                  // sortable: true,
                  filterable: true,
                  selectedFilterValues: columnFilters.status,
                  onFilterChange: (values) => handleColumnFilterChange('status', values),
                  filterComponent: (
                    <ColumnFilterDropdown
                      column="status"
                      values={['Active', 'Inactive', 'Beta', 'Delete']}
                      selectedValues={columnFilters.status}
                      onSelect={(values) => handleColumnFilterChange('status', values)}
                      close={() => { }}
                      anchorRef={{ current: null }}
                    />
                  ),
                  render: (app) => getStatusBadge(app.status),
                },
                {
                  key: 'launchUrl',
                  header: 'URL',
                  render: (app) => app.launchUrl ? (
                    <a
                      href={app.launchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <Link className="h-3 w-3 mr-1" />
                      <span className="truncate max-w-[100px] md:max-w-[150px]">
                        {app.launchUrl.replace(/^https?:\/\//, "")}
                      </span>
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  ),
                },
                {
                  key: 'isActive',
                  header: 'Enabled',
                  filterable: true,
                  selectedFilterValues: columnFilters.isActive,
                  onFilterChange: (values) => handleColumnFilterChange('isActive', values),
                  filterComponent: (
                    <ColumnFilterDropdown
                      column="isActive"
                      values={['true', 'false']}
                      selectedValues={columnFilters.isActive}
                      onSelect={(values) => handleColumnFilterChange('isActive', values)}
                      close={() => { }}
                      anchorRef={{ current: null }}
                    />
                  ),
                  render: (app) => (
                    <Switch
                      checked={app.isActive}
                      onCheckedChange={() => handleToggleEnabled(Number(app.id), app.isActive)}
                      aria-label={`Toggle application ${app.uniqueNameorId} enabled state`}
                    />
                  ),
                },
                {
                  key: 'isVisible',
                  header: 'Visible',
                  filterable: true,
                  selectedFilterValues: columnFilters.isVisible,
                  onFilterChange: (values) => handleColumnFilterChange('isVisible', values),
                  filterComponent: (
                    <ColumnFilterDropdown
                      column="isVisible"
                      values={['true', 'false']}
                      selectedValues={columnFilters.isVisible}
                      onSelect={(values) => handleColumnFilterChange('isVisible', values)}
                      close={() => { }}
                      anchorRef={{ current: null }}
                    />
                  ),
                  render: (app) => (
                    <Switch
                      checked={app.isVisible}
                      onCheckedChange={() => handleToggleVisibility(Number(app.id), app.isVisible)}
                      aria-label={`Toggle application ${app.uniqueNameorId} visibility`}
                    />
                  ),
                },
              ]}
              data={applications}
              loading={isLoading}
              onSort={handleSort}
              pagination={{
                page: pageNumber,
                pageSize: pageSize,
                total: totalRecords,
                onPageChange: (page) => setPageNumber(page),
                onPageSizeChange: (size) => {
                  setPageSize(size);
                  setPageNumber(1);
                },
                pageSizeOptions,
              }}
              actions={(app) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    {
                      app.isActive ?
                        <DropdownMenuItem onClick={() => handleEdit(app)} className="flex w-full items-center px-2 py-1 text-sm hover:bg-gray-200">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        : <>

                        </>
                    }
                    <DropdownMenuItem
                      onClick={() => handleToggleEnabled(Number(app.id), app.isActive)}
                      className="flex w-full items-center px-2 py-1 text-sm hover:bg-gray-100"
                    >
                      {app.isActive ? (
                        <>
                          <X className="mr-2 h-4 w-4" />
                          Disable
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Enable
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleVisibility(Number(app.id), app.isVisible)}
                      className="flex w-full items-center px-2 py-1 text-sm hover:bg-gray-100"
                    >
                      {app.isVisible ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Show
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex w-full items-center px-2 py-1 text-sm hover:bg-gray-100"
                      onClick={() => handleDelete(app.id, app.displayName)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              emptyMessage="No applications found"
            />
          </div>
        </CardContent>
      </Card>

      <FilterDrawer
        drawerOpen={isFilterDrawerOpen}
        closeDrawer={() => setIsFilterDrawerOpen(false)}
        title="Advanced Filters"
        width="30vw"
        filters={advancedFilters}
        onChange={handleFilterDrawerFieldChange}
        onApply={handleApplyFiltersFromDrawer}
        onClear={() => {
          clearAllFilters();
          setIsFilterDrawerOpen(false);
        }}
        moduleNames={getUniqueColumnValues('category')}
        showModuleNameFilter={true}
      />
    </div>
  )
}