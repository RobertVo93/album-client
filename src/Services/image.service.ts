
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { apiConfig } from "../Configuration/api.config";
import { Images } from "../classes/image";
import { commonAPI } from "./common-api.service";
import { ServerUploadURL } from '../Configuration/Enum';
import { ImageRequest, CommonResponse, ImageResponse, DeleteImageRequest} from '../interfaces';

export class Imageservice {
    axiosConfig: AxiosRequestConfig;
    constructor() {
        this.axiosConfig = apiConfig;
    }

    /**
     * Get all data
     */
    public async getAllData(config: ImageRequest): Promise<ImageResponse> {
        try {
            const res = await commonAPI.post<string, ImageRequest, AxiosResponse<ImageResponse>>(`${ServerUploadURL}/list`, config);
            return commonAPI.success(res);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Get file by album and file name
     * @param album album
     * @param fname file name
     */
    public async getFile(album: string, fname: string): Promise<Images> {
        try {
            const res: AxiosResponse<Images> = await commonAPI.get(`${ServerUploadURL}/${album}/${fname}`);
            return commonAPI.success(res);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * upload image
     * @param obj form data
     */
    public async createNew(obj: FormData): Promise<Images[]> {
        try {
            const res = await commonAPI.put<string, FormData, AxiosResponse<Images[]>>(`${ServerUploadURL}`, obj);
            return commonAPI.success(res);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Delete bulk
     * @param objs all file
     */
    public async deleteBulk(objs: DeleteImageRequest[]): Promise<CommonResponse> {
        try {
            this.axiosConfig.data = objs;
            const res = await commonAPI.delete<string, AxiosResponse<CommonResponse>>(`${ServerUploadURL}`, this.axiosConfig);
            return commonAPI.success(res);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * Delete target file
     * @param album album
     * @param fname file name
     */
    public async delete(album: string, fname: string): Promise<any> {
        try {
            const res = await commonAPI.delete(`${ServerUploadURL}/${album}/${fname}`);
            return commonAPI.success(res);
        }
        catch (e) {
            throw e;
        }
    }
}