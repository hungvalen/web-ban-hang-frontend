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

export const getEncodedDataFromDataURI = (dataURI) => {
    const [, encodedData] = dataURI?.split(',');
    return encodedData;
}

export const fileName = 'image.jpg';