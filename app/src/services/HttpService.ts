import axios, {AxiosInstance, AxiosResponse} from "axios";
import DetailListItem from "@src/structures/DetailListItem";

export default class HttpService {

    axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: "http://0.0.0.0:9001/",
            headers: {
                "Content-type": "text/html"
            }
        });
    }

    async get(url: string): Promise<any> {
        const result = await this.axiosInstance.get('content/' + url);
        return result.data;
    }

    getContent(language: string, filename: string): Promise<any> {
        return this.get(language + '/' + filename);
    }

    // async getList(language: string = 'lv'): Promise<Array<DetailListItem>> {
    //     const response = await this.get('content/' + language + '/list.json');
    //     const listItems = [];
    //     for (const params of response.data.itemsList) {
    //         listItems.push(
    //             new DetailListItem(params)
    //         );
    //     }
    //     return listItems;
    // }
    //
    // async getDetail(id: number): Promise<any> {
    //
    // }

}
