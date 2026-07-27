// ==========================================
// FAST MAGIC PDF
// ADVANCED PDF COMPRESSION ENGINE
// ==========================================


async function compressPDFEngine(
    file,
    quality,
    updateProgress
){


    const arrayBuffer =
    await file.arrayBuffer();



    const loadingTask =
    pdfjsLib.getDocument({
        data:arrayBuffer
    });



    const pdf =
    await loadingTask.promise;



    const newPDF =
    await PDFLib.PDFDocument.create();



    let imageQuality = 0.6;



    if(quality==="high"){

        imageQuality=0.35;

    }


    if(quality==="medium"){

        imageQuality=0.6;

    }


    if(quality==="low"){

        imageQuality=0.85;

    }




    for(
        let pageNumber=1;
        pageNumber<=pdf.numPages;
        pageNumber++
    ){



        updateProgress(
            Math.round(
                (pageNumber/pdf.numPages)*80
            )
        );



        const page =
        await pdf.getPage(pageNumber);



        const viewport =
        page.getViewport({
            scale:1.5
        });




        const canvas =
        document.createElement("canvas");



        const context =
        canvas.getContext("2d");



        canvas.width =
        viewport.width;



        canvas.height =
        viewport.height;




        await page.render({

            canvasContext:context,

            viewport:viewport

        }).promise;




        const imageData =
        canvas.toDataURL(
            "image/jpeg",
            imageQuality
        );




        const jpgBytes =
        await fetch(imageData)
        .then(res=>res.arrayBuffer());





        const jpgImage =
        await newPDF.embedJpg(
            jpgBytes
        );





        const newPage =
        newPDF.addPage([
            viewport.width,
            viewport.height
        ]);





        newPage.drawImage(
            jpgImage,
            {

            x:0,

            y:0,

            width:viewport.width,

            height:viewport.height

            }
        );



    }




    updateProgress(100);



    const output =
    await newPDF.save();



    return output;



}
