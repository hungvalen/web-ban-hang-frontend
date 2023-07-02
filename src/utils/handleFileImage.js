export const convertDataURIToFile = async (dataURI, fileName) => {
    const response = await fetch(dataURI);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
};

export const convertLinkToFile = async (link, fileName) => {
    const response = await fetch(link);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
};

export const dataURItoFile = (dataURI, fileName) => {
    const byteString = atob(dataURI);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: 'image/jpeg' });
    return new File([blob], fileName, { type: 'image/jpeg' });
}

export const getEncodedDataFromDataURI = (file) => {
    // console.log(dataURI);
    // const [, encodedData] = dataURI?.split(',');
    // const mimeType = encodedData[0].split(":")[1];
    // const data = encodedData[1];
    // return encodedData;
    // if (typeof dataURI === "string") {
    //     const dataURIParts = dataURI.split(",");
    //     if (dataURIParts.length === 2) {
    //         const encodedData = dataURIParts[1];
    //         return encodedData;
    //     }
    // }
    // return null;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            const dataURI = reader.result;
            const dataURIParts = dataURI.split(",");
            if (dataURIParts.length === 2) {
                const encodedData = dataURIParts[1];
                resolve(encodedData);
            } else {
                reject("Invalid data URI or image file");
            }
        };

        reader.onerror = () => {
            reject("Error reading file");
        };

        reader.readAsDataURL(file);
    });
}

export const fileName = 'image.jpg';