import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dtbahtven', 
    api_key: '297317452783464', 
    api_secret: '7nIMqb9TxEQTxMXYaWDyaKny0Xs',
    secure: true,
});

export default cloudinary;
