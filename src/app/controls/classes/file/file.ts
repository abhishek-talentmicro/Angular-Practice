export class StandardFile {
    file_title: string;
    mime_type: string;
    content: string;
    extension: string;
    status: number;
    attachment_id: number;
    size: string;
    file_path: string;
    content_type: number;
    setFileDetails(file_title, mime_type, content, extension, status, attachment_id, size, content_type, file_path) {
        this.file_title = file_title;
        this.mime_type = mime_type;
        this.content = content;
        this.extension = extension;
        this.status = status;
        this.attachment_id = attachment_id;
        this.size = size;
        this.content_type = content_type || 1;
        this.file_path = file_path;

        try {
            if (!this.mime_type || this.mime_type == '') {
                this.mime_type = 'application/octet-stream';
            }
        }
        catch (err) {

        }
    }

    constructor(obj = {
        file_title: null,
        mime_type: null,
        content: null,
        status: null,
        attachment_id: null,
        extension: null,
        size: null,
        content_type: null,
        file_path: null,
    }) {
        this.file_title = obj.file_title;
        this.mime_type = obj.mime_type;
        this.content = obj.content;
        this.extension = obj.extension;
        this.status = obj.status;
        this.attachment_id = obj.attachment_id;
        this.size = obj.size;
        this.content_type = obj.content_type || 1;
        this.file_path = obj.file_path;
    }
}