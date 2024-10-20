"use client"
import { useEffect } from "react";


import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScanbotSDKService from "../services/scanbot-sdk-service";

export default function BarcodeScanner() {

    useEffect(() => {
        ScanbotSDKService.instance.createBarcodeScanner("barcode-scanner", async (barcode) => {
            const base64Image = await ScanbotSDKService.instance.sdk?.toDataUrl(barcode.barcodeImage);
            toast(`Detected code: ${barcode.text} (${barcode.format})`, {
                icon: ({theme, type}) =>  <Image width={25} height={25} src={base64Image!} alt={`${theme} ${type}`}/>
              });
        });

        return () => {
            // To avoid memory leaks, always dispose the scanner when the component is unmounted
            ScanbotSDKService.instance.disposeBarcodeScanner();
        };
    }, [])

    return (
        <div>
           
            <div id="barcode-scanner" style={{ width: "100%", height: "calc(100vh - 50px)" }} />
            <ToastContainer autoClose={2000} />
        </div>
    )
}