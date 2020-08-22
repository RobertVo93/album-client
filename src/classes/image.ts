export class Images {
    constructor(obj?: any) {
        this.id = obj?.id;
        this.album = obj?.album;
        this.name = obj?.name;
        this.path = obj?.path;
        this.raw = obj?.raw;
        this.thumbnailWidth = 250;
        this.thumbnailHeight = 150;
        this.src = obj?.raw;
        this.thumbnail = obj?.raw;
        this.thumbnailCaption = obj?.name;
    }
    id: string;
    album: string;
    name: string;
    path: string;
    raw: string;
    //properties support to display images on screen 
    thumbnailWidth: number;
    thumbnailHeight: number;
    src: string;
    thumbnail: string;
    thumbnailCaption: any;
}