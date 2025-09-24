import ApiService from "../services/api-service";

    const sysdetail = localStorage.getItem('system') || ""
    const ipdetails = localStorage.getItem('ipaddress') || ""
    const location = localStorage.getItem('location') || ""

const RootAppService = {
    getLayoutSettings: async (id: number, headers: any | null): Promise<any> => {
        return await ApiService.get<any>(`api/ApplicationSettings/GetLayoutSettings/${id}`, headers);
    },

    updateLayoutSettings: async (id: number, data: any, headers: any | null): Promise<any> => {
        const res = await ApiService.put<any>(`api/ApplicationSettings/UpdateLayoutSettings/${id}`, data, headers)
        return res.data;
    },

    addSettings: async (data: any): Promise<any> => {
        const res = await ApiService.post<any>(`api/ApplicationSettings/AddLayoutSettings`, data)
        return res.data;
    },

    getTextSettings: async (id: number, headers: any | null): Promise<any> => {
        return await ApiService.get<any>(`api/ApplicationSettings/GetTextSettings/${id}`, headers);
    },

    addTextSettings: async (data: any, headers: any | null): Promise<any> => {
        const res = await ApiService.post<any>(`api/ApplicationSettings/AddTextSettings`, data, headers);
        return res.data;
    },

}

export default RootAppService;