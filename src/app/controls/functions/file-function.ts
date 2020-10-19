
export function makeFormDataFile(file) {
    try {
        if (file) {
            let base64 = (file.content);
            let file_title = (file.file_title);
            let mime_type = (file.mime_type);
            function dataURLtoFile(dataurl, filename) {

                var arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);

                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }

                return new File([u8arr], filename, { type: mime });
            }
            let formatted_file = dataURLtoFile(base64, file_title);
            return formatted_file;
        }
    }
    catch (err) {


    }

}


export function downloadFile(file, file_save_svc) {
    if (file && file.file_path && file.file_path != '') {
        // file_save_svc.importFromFilepath(file.file_path).subscribe(res => {
        //     if (res && res.body) {
        file_save_svc.saveFile(null, file.file_title, file.file_path);
        // }
        // },
        // err => {

        // })
    }
    else {
        let blob = makeFormDataFile(file);
        file_save_svc.saveFile(blob, file.file_title);
    }
}

