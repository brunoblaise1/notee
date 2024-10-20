import ScanbotSDK from "scanbot-web-sdk";
import { IBarcodeScannerHandle } from "scanbot-web-sdk/@types/interfaces/i-barcode-scanner-handle";
import { Barcode } from "scanbot-web-sdk/@types/model/barcode/barcode";
import { BarcodeResult } from "scanbot-web-sdk/@types/model/barcode/barcode-result";
import { BarcodeScannerConfiguration } from "scanbot-web-sdk/@types/model/configuration/barcode-scanner-configuration";


// Pass the license key to the Scanbot SDK to initialize it.
// Please refer to the corresponding setup guide in our documentation:
// https://docs.scanbot.io
export default class ScanbotSDKService {

    public static instance: ScanbotSDKService = new ScanbotSDKService();

    sdk?: ScanbotSDK;

    /*
    * TODO add the license key here.
    * Please note: Scanbot Web SDK will run without a license key for one minute per session!
    * After the trial period has expired, all SDK functions and UI components will stop working.
    * You can get a free "no-strings-attached" trial license.
    * Please submit the trial license form (https://scanbot.io/trial/) on our website using
    * "Web SDK" as the license type and a corresponding domain name of your test environment
    * (e.g. myapp.example.com or www.mywebsite.com). Every trial license automatically
    * includes "localhost" as a domain name for local development purposes.
    */
    LICENSE_KEY = "C5nf3le0nIdfuMHoFShh7bYCX+1c5d" +
"bXJK03xaZdG+IXKLtqEbVObABG0C/A" +
"Y3T9vbQX1eE5yyUie7C5/2DGGTfZcz" +
"x35Qps4agjgKKYHSjLZel88qPKPW7e" +
"Q/XBBcURBptwzGzmuosQTzMtq4QC/5" +
"ljTqySTvR4Kd4ni/KVYRxbj+hqu90O" +
"A6NXJlY3dwKKFyLi5znYZ19p9AT3m5" +
"P9xyPtTiTmRjrNiUvs0nHQyMpkWWm4" +
"J+AISE1RaiNQzlFH08+ADCjEJfb8+3" +
"ktHjmPljvtYyCnffIYglIROtdd16zL" +
"cKDaoAAqNMAh6zG7ob5gVBu0QAk6NH" +
"z4ArJDXZjzIw==\nU2NhbmJvdFNESw" +
"psb2NhbGhvc3R8aGFja2Vhc3RhZnJp" +
"Y2Eub3JnCjE3MzAwNzM1OTkKODM4OD" +
"YwNwo4\n";

    public async initialize() {
        if (this.sdk) {
            // The SDK needs to be initialized just once during the entire app's lifecycle
            return;
        }

        // Use dynamic inline imports to load the SDK, else Next will load it into the server bundle
        // and attempt to load it before the 'window' object becomes available.
        // https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading
        const sdk = (await import('scanbot-web-sdk')).default;

        this.sdk = await sdk.initialize({
            licenseKey: this.LICENSE_KEY,
            engine: "wasm",
        });
    }

  
    private barcodeScanner?: IBarcodeScannerHandle;
 

    async createBarcodeScanner(containerId: string, onBarcodeFound: (code: Barcode) => void) {
        /*
        * Ensure the SDK is initialized. If it's initialized, this function does nothing,
        * but is necessary e.g. when opening the barcode url scanner directly.
        */
        await this.initialize();

        const config: BarcodeScannerConfiguration = {
            containerId: containerId,
            overlay: {
                visible: true,

                textFormat: 'TextAndFormat',
                automaticSelectionEnabled: false,
                style: {
                    highlightedTextColor: '#EC3D67',
                    highlightedPolygonStrokeColor: '#3DEC4A'
                },
                onBarcodeFound(code) {
                    // If overlay is visible and automatic selection is disabled, this callback will be called.
                    // The found overlay can be styled via the 'polygon' and 'label' parameters.
                    // However, in this case we just return the code to the view and show a toast
                    onBarcodeFound(code);

                },
            },
            returnBarcodeImage: true,
            onBarcodesDetected: (e: BarcodeResult) => {
                // Process the result as you see fit
                console.log("Detected barcodes: ", e.barcodes);
            },
            onError: (error: Error) => {
                console.log("Encountered error scanning barcodes: ", error);
            },
        };

        this.barcodeScanner = await this.sdk?.createBarcodeScanner(config);
    }



    public disposeBarcodeScanner() {
        this.barcodeScanner?.dispose();
    }


    private documents: ScanbotDocument[] = [];
    public getDocuments() {
        return this.documents;
    }
    public hasDocuments() {
        return this.documents.length > 0;
    }
    findDocument(id: string) {
        return this.getDocuments().find(d => d.id === id);
    }



    /**
     * Callback for when the user has applied a crop to a document.
     * <Link> redirects the user back before async operations have completed,
     * so we need to call this function to update the view after crop operation has been completed
     */

}

/**
 * Wrapper object to conveniently display the image of a detection result
 * the 'image' object is pre-processed into a base64 string for display
 */
export class ScanbotDocument {
    id?: string;
    image?: string;
}